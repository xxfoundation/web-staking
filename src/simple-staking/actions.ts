// @ts-check
import '../augment-types/augment-api';
import { ApiPromise } from '@polkadot/api';
import { BN, BN_ZERO } from '@polkadot/util';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import _ from 'lodash';

export interface StakingBalances {
  staked: BN;
  unbonding: BN;
  redeemable: BN;
  unlocking: [BN, number][];
  available: BN;
  total: BN;
  onlyStash: boolean;
  stash: string;
  controller: string;
}

export const getStakingBalances = async (api: ApiPromise, account: string): Promise<StakingBalances> => {
  const [
    currentEra,
    optController,
    optLedger,
  ] = await Promise.all([
    api.query.staking.currentEra(),
    api.query.staking.bonded(account),
    api.query.staking.ledger(account),
  ]);
  const ed = api.consts.balances.existentialDeposit.toBn();
  // Check if account is stash / controller
  // If the account is bonded (some controller exists on chain), then this account is a stash
  const isStash = optController.isSome;
  // If the ledger exists on chain, then this account is a controller
  const isController = optLedger.isSome;
  // Get the stash balances  
  const stash = (isStash || !isController) ? account : optLedger.unwrap().stash.toString();
  const { data: { free, reserved } } = await api.query.system.account(stash);
  // If not staked, return
  if (!isStash && !isController) {
    return {
      staked: BN_ZERO,
      unbonding: BN_ZERO,
      redeemable: BN_ZERO,
      unlocking: [],
      available: free.sub(ed),
      total: free.add(reserved),
      onlyStash: false,
      stash: account,
      controller: account
    }
  }
  // Compute staking balances
  const controller = isController ? account : optController.unwrap().toString();
  const ledger = isController ? optLedger.unwrap() : (await api.query.staking.ledger(controller)).unwrap();
  const totalStaked = ledger.total.unwrap();
  const staked = ledger.active.unwrap();
  const unbonding = totalStaked.sub(staked);
  const currEra = currentEra.unwrap().toNumber();
  const redeemable = ledger.unlocking.filter(({ era }) => era.toNumber() <= currEra).reduce((total, { value }) => total.add(value.unwrap()), BN_ZERO);
  const uniqueEras = _.uniq(ledger.unlocking.filter(({ era }) => era.toNumber() > currEra).map(({ era }) => era.toNumber() - currEra));
  const unlockingDup: [BN, number][] = ledger.unlocking.filter(({ era }) => era.toNumber() > currEra).map(({ era, value }) => [ value.unwrap().toBn(), era.toNumber() - currEra]);
  const unlocking: [BN, number][] = uniqueEras.map((uniqEra) => [unlockingDup.reduce((total, [value, era]) => era === uniqEra ? total.add(value) : total, BN_ZERO), uniqEra]);
  const onlyStash =  isStash && !isController;
  // If account is only stash, then can only stake free funds (not including unbonding funds)
  const availableToStake = onlyStash ? free.sub(totalStaked) : free.sub(staked);
  // If account is not stash, then can only rebond
  const available = isStash ? (availableToStake.gt(ed) ? availableToStake.sub(ed) : BN_ZERO) : unbonding;
  const total = free.add(reserved);
  return {
    staked,
    unbonding,
    redeemable,
    unlocking,
    available,
    total,
    onlyStash,
    stash,
    controller
  }
}

export const stake = async (api: ApiPromise, controller: string, amount: BN, targets: string[]): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
  const calls = [];
  const optLedger = await api.query.staking.ledger(controller);
  if (optLedger.isNone) {
    calls.push(api.tx.staking.bond(controller, amount, null));
  } else if (!amount.isZero()) {
    const ledger = optLedger.unwrap();
    const unbonding = ledger.total.unwrap().sub(ledger.active.unwrap());
    if (unbonding.gt(BN_ZERO)) {
      calls.push(api.tx.staking.rebond(amount));
    }
    if (amount.gt(unbonding)) {
      const extra = amount.sub(unbonding);
      calls.push(api.tx.staking.bondExtra(extra));
    }
  }
  calls.push(api.tx.staking.nominate(targets));
  if (calls.length > 1) {
    return api.tx.utility.batch(calls)
  }
  return calls[0]
}

export const stakeExtra = async (api: ApiPromise, amount: BN): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
  return api.tx.staking.bondExtra(amount)
}

export const unstake = async (api: ApiPromise, controller: string, amount: BN): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
  const calls = [];
  const ledger = (await api.query.staking.ledger(controller)).unwrap();
  const staked = ledger.active.unwrap();
  if (amount.eq(staked)) {
    calls.push(api.tx.staking.chill());
  }
  calls.push(api.tx.staking.unbond(amount));
  if (calls.length > 1) {
    return api.tx.utility.batch(calls)
  }
  return calls[0]
}

export const redeem = async (api: ApiPromise, controller: string): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
  const ledger = (await api.query.staking.ledger(controller)).unwrap();
  const slashingSpans = await api.query.staking.slashingSpans(ledger.stash);
  const spanCount = slashingSpans.isNone ? 0 : slashingSpans.unwrap().prior.length + 1;
  return api.tx.staking.withdrawUnbonded(spanCount)
}
