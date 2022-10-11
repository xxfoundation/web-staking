import { stripNonDigits } from '../../../utils';
import { BN, BN_MILLION } from '@polkadot/util';

export type Economics = {
  activeEra: number;
  inflationRate: string;
  timestamp: string;
  totalIssuance: string;
  totalSupply: string;
  bridge: string;
  canary: string;
  circulating: string;
  claims: string;
  custody: string;
  rewards: string;
  sales: string;
  stakeableSupply: string;
  staked: string;
  inactiveStaked: string;
  treasury: string;
  unbonding: string;
  liquid: string;
  vesting: string;
  tmStaked: string;
}


export const getStakedReturn = (economics: Economics): number => {
  const totalStaked = new BN(stripNonDigits(economics?.staked));
  const tmStaked = new BN(stripNonDigits(economics?.tmStaked));
  const stakeableSupply = new BN(stripNonDigits(economics?.stakeableSupply));
  const inflationRate = new BN(stripNonDigits(economics?.inflationRate)).toNumber();
  const stakedFraction =
    totalStaked.mul(BN_MILLION).div(stakeableSupply).toNumber() / BN_MILLION.toNumber();
  const multiplierImpact = totalStaked.mul(BN_MILLION).div(totalStaked.add(tmStaked)).toNumber() / 1e6;
  return stakedFraction ? inflationRate * multiplierImpact / stakedFraction / 100 : 0;
};