// @ts-check
import '../augment-types/augment-api';

import type { PalletStakingNominations, PalletStakingStakingLedger, PalletStakingValidatorPrefs } from '@polkadot/types/lookup';
import type { ApiPromise } from '@polkadot/api';

import _ from 'lodash';
import BigNumber from 'bignumber.js';

import { ElectedValidator, Voter, seqPhragmen } from './phragmen';


interface ChainData {
  // Current information
  controllers: Record<string, string>;
  ledgers: Record<string, PalletStakingStakingLedger>;
  validators: Record<string, PalletStakingValidatorPrefs>;
  nominators: Record<string, PalletStakingNominations>;
  count: number;
  // Performance information
  performance: Record<string, number[]>;
}

// Get chain data
// Current information is always fetched
// Past points information for the given number of eras + current era is fetched
const getChainData = async (api: ApiPromise, eras = 7): Promise<ChainData> => {
  const data: ChainData = {
    controllers: {},
    ledgers: {},
    validators: {},
    nominators: {},
    count: 0,
    performance: {},
  };
  // Get data from chain
  const [
    bonded,
    ledger,
    validators,
    nominators,
    validatorCount,
    activeEra,
  ] = await Promise.all([
    api.query.staking.bonded.entries(),
    api.query.staking.ledger.entries(),
    api.query.staking.validators.entries(),
    api.query.staking.nominators.entries(),
    api.query.staking.validatorCount(),
    api.query.staking.activeEra(),
  ]);
  // ------------------------------------ //
  // Current information
  // ------------------------------------ //
  // Convert all controllers
  bonded.forEach(([{ args }, controller]) => {
    data.controllers[args[0].toString()] = controller.toString();
  })
  // Convert all ledgers
  ledger.forEach(([{ args }, ledgerInfo]) => {
    data.ledgers[args[0].toString()] = ledgerInfo.unwrap();
  })
  // Convert all validators
  validators.forEach(([{ args }, validatorPrefs]) => {
    data.validators[args[0].toString()] = validatorPrefs;
  })
  // Convert all nominators
  nominators.forEach(([{ args }, nominations]) => {
    data.nominators[args[0].toString()] = nominations.unwrap();
  })
  data.count = validatorCount.toNumber();

  // ------------------------------------ //
  // Get points information
  // ------------------------------------ //
  // Get active era
  const activeEraNumber = activeEra.unwrap().index.toNumber();
  const firstEra = activeEraNumber > eras ? activeEraNumber - eras : 0;

  // Calculate performance for all eras
  for (let era = firstEra; era <= activeEraNumber; era++) {
    const erasPoints = await api.query.staking.erasRewardPoints(era);
    // Process points
    const validatorPoints: [string, number][] = [];
    let totalPoints = 0;
    let count = 0;
    erasPoints.individual.forEach((pointsIn, addr) => {
      const points = pointsIn.toNumber();
      validatorPoints.push([addr.toString(), points]);
      totalPoints += points;
      count += 1;
    });
    const avgPoints = totalPoints / count;
    validatorPoints.forEach(([addr, points]) => {
      if (addr in data.performance) {
        data.performance[addr].push(points / avgPoints);
      } else {
        data.performance[addr] = [points / avgPoints];
      }
    });
  }

  return data
}

const buildVotersList = (chainData: ChainData, exclude: string): Voter[] => {
  // Build voters list
  const voters: Voter[] = [];
  // Add nominators
  Object.keys(chainData.nominators).forEach((nomId) => {
    // Skip excluded address
    if (exclude !== nomId) {
      // Remove duplicates and non validators from targets
      const noms = chainData.nominators[nomId];
      const targets = _.uniq(noms.targets).map((target) => target.toString()).filter((target) => target in chainData.validators);
      const ledger = chainData.ledgers[chainData.controllers[nomId]];
      voters.push({
        nominatorId: nomId,
        stake: ledger.active.toString(),
        targets: targets,
      });
    }
  });
  // Add validators self vote
  Object.keys(chainData.validators).forEach((valId) => {
    const ledger = chainData.ledgers[chainData.controllers[valId]];
    voters.push({
      nominatorId: valId,
      stake: ledger.active.toString(),
      targets: [valId],
    });
  });

  return voters
}

export interface ElectedWithReturn extends ElectedValidator {
  return: number;
  blocked: boolean;
}

// We give a rating of 0.25 to validators without any performance data
const computeReturn = (chainData: ChainData, elected: ElectedValidator, avgStake: BigNumber): ElectedWithReturn => {
  const performance = chainData.performance[elected.validatorId];
  const avgPerformance = performance ? performance.reduce((sum, val) => sum + val, 0) / performance.length : 0.25;
  const commission = chainData.validators[elected.validatorId].commission.toNumber() / 1e9;
  const blocked = chainData.validators[elected.validatorId].blocked.toPrimitive();
  const stakingReturn = avgStake.dividedBy(elected.backedStake).toNumber() * (1 - commission);
  return {
    validatorId: elected.validatorId,
    backedStake: elected.backedStake,
    score: elected.score,
    backers: elected.backers,
    return: avgPerformance * stakingReturn,
    blocked: blocked,
  }
}

const targets = 16;
const maxNominations = 256;

const orderValidatorsByReturn = (chainData: ChainData, validators: ElectedValidator[]): ElectedWithReturn[] => {
  // Compute average stake
  const avgStake = validators.reduce((sum, val) => sum.plus(val.backedStake), new BigNumber(0)).dividedBy(validators.length);
  // Compute return for all elected validators
  // Then filter out validators that are blocking nominations and that have 256+ nominators
  // And finally sort them descending (by return)
  const ordered: ElectedWithReturn[] = validators
    .map((validator) => computeReturn(chainData, validator, avgStake))
    .filter(({ backers, blocked }) => !blocked && backers < maxNominations)
    .sort((a, b) => a.return > b.return ? -1 : 1);
  return ordered.slice(0, targets)
}

export const selectValidators = async (api: ApiPromise, nominator: string): Promise<ElectedWithReturn[]> => {
  // Get chain data
  const chainData = await getChainData(api);
  // Builder voters list (excluding our address)
  const voters = buildVotersList(chainData, nominator);
  // Run phragmen
  const [, elected] = seqPhragmen(voters, chainData.count);
  // Order validators by return and get top 16
  return orderValidatorsByReturn(chainData, elected);
}
