import { stripNonDigits } from '../../../utils';
import { BN, BN_MILLION } from '@polkadot/util';
import { Economics } from '../../../schemas/economics.schema';

export const getStakedReturn = (economics: Economics): number => {
  const totalStaked = new BN(stripNonDigits(economics?.staked.toString().slice(0,-3)));
  const tmStaked = new BN(stripNonDigits(economics?.tmStaked.toString().slice(0,-3)));
  const stakeableSupply = new BN(stripNonDigits(economics?.stakeableSupply.toString().slice(0,-3)));
  const inflationRate = new BN(stripNonDigits(economics?.inflationRate)).toNumber();
  const stakedFraction =
    totalStaked.mul(BN_MILLION).div(stakeableSupply).toNumber() / BN_MILLION.toNumber();
  const multiplierImpact = totalStaked.mul(BN_MILLION).div(totalStaked.add(tmStaked)).toNumber() / 1e6;
  return stakedFraction ? inflationRate * multiplierImpact / stakedFraction / 100 : 0;
};