import { gql } from '@apollo/client';

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

export type EconomicsSubscription = {
  economics: Economics[];
}

export const LISTEN_FOR_ECONOMICS = gql`
  query ListenForEconomics {
    economics(limit: 1, order_by: {active_era: desc}) {
      activeEra: active_era
      bridge
      canary
      circulating
      claims
      custody
      inflationRate: inflation_rate
      rewards
      sales
      stakeableSupply: stakeable_supply
      staked
      inactiveStaked: inactive_staked
      timestamp
      totalIssuance: total_issuance
      totalSupply: total_supply
      treasury
      unbonding
      liquid
      vesting
      tmStaked: tm_staked
    }
  }
`;