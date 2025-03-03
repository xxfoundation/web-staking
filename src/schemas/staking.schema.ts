import { gql } from '@apollo/client';
import { AccountRoles, ROLES_FRAGMENT } from './accounts.schema';

/* ------------------------------ General Types ----------------------------- */
export type Nominator = {
  account_id: string; // * Not overwritten when queried, so it needs to match the DB
  stake: string;
  share: string;
}

/* -------------------------------------------------------------------------- */
/*                          Validator Stats Fragment                          */
/* -------------------------------------------------------------------------- */
export type ValidatorStats = {
  era: number;
  stashAddress: string;
  rewardsAddress: string;
  commission: number;
  selfStake: number;
  otherStake: number;
  totalStake: number;
  nominators: Nominator[];
  sessionKeys: string | null;
  cmixId: string | null;
  location: string | null;
  points: number | null;
  relativePerformance: number | null;
  reward: number | null;
  rewardsAccount: {
    roles: AccountRoles,
    identity: null | { display: string }
  };
}

const VALIDATOR_STATS_FRAGMENT = gql`
  ${ROLES_FRAGMENT}
  fragment validatorStatsFragment on validator_stats {
    cmixId: cmix_id
    commission
    era
    location
    nominators
    otherStake: other_stake
    points
    relativePerformance: relative_performance
    reward
    rewardsAddress: rewards_address
    rewardsAccount {
      roles: role {
        ...roles
      }
      identity {
        display
      }
    }
    selfStake: self_stake
    sessionKeys: session_keys
    stashAddress: stash_address
    timestamp
    totalStake: total_stake
  }
`;

/* -------------------------------------------------------------------------- */
/*                       Staking Page > Validators Table                      */
/* -------------------------------------------------------------------------- */

export type LatestEraQuery = {
  validatorStats: { era: number }[]
}

export const GET_LATEST_ERA = gql`
  query GetLatestEra {
    validatorStats: validator_stats(limit: 1, order_by: {era: desc}) {
      era
    }
  }
`;

export type ActiveCountsQuery = {
  active: { aggregate: { count: number } };
  waiting: { aggregate: { count: number } };
}

export const GET_ACTIVE_COUNTS = gql`
  query ActiveCounts($era: Int!) {
    active: validator_stats_aggregate(where: { era: { _eq: $era }}) {
      aggregate {
        count
      }
    }

    waiting: waiting_aggregate {
      aggregate {
        count
      }
    }
  }
`
export type ValidatorAccount = {
  addressId: string;
  location: string;
  cmixId: string;
  nominators: Nominator[];
  ownStake: string;
  totalStake: string;
  otherStake: string;
  commission: number;
  name: {
    display: string;
  }[];
};

export type ValidatorAccountsQuery = {
  validators: ValidatorAccount[];
};

export const GET_CURRENT_VALIDATORS = gql`
  query GetCurrentValidators($limit: Int!, $offset: Int!, $where: validator_stats_bool_exp) {
    validators: validator_stats(limit: $limit, offset: $offset, where: $where, order_by: { total_stake: desc }) {
      addressId: stash_address
      location
      ownStake: self_stake
      otherStake: other_stake
      totalStake: total_stake
      commission
      cmixId: cmix_id
      nominators
      name: identity {
        display
      }
    }
  }
`;

export const GET_WAITING_LIST = gql`
  query GetWaitingList ($where: waiting_bool_exp) {
    validators: waiting(order_by: { self_stake: desc }, where: $where) {
      addressId: stash_address
      location
      ownStake: self_stake
      commission
      cmixId: cmix_id
      nominators
      name: identity {
        display
      }
    }
  }
`;


/* -------------------------------------------------------------------------- */
/*                       Account Page > Validator Stats                       */
/* -------------------------------------------------------------------------- */
export type GetValidatorStats = {
  aggregates: { aggregate: { count: number } }
  stats: ValidatorStats[]
}

export const GET_VALIDATOR_STATS = gql`
  ${VALIDATOR_STATS_FRAGMENT}
  query GetValidatorStats ($accountId: String!) {
    aggregates: validator_stats_aggregate(where: { stash_address: { _eq: $accountId }}) {
      aggregate {
        count
      }
    }

    stats: validator_stats(where: { stash_address: { _eq: $accountId } }, order_by: { era: desc }) {
      ...validatorStatsFragment
    }
  }
`;

export type GetValidatorsPerCommission = {
  agg: { aggregate: { count: number } }
  stats: {
    id: string;
  }[]
}

export const GET_VALIDATORS_PER_COMMISSION = gql`
  query GetValidatorsPerCommission($commission: Float!) {
    agg: validator_stats_aggregate(
      where: {commission: {_gte: $commission}}
      distinct_on: stash_address
    ) {
      aggregate {
        count
      }
    }
    stats: validator_stats(where: {commission: {_gte: $commission}}, distinct_on: stash_address) {
      id: stash_address
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                Staking Stats                               */
/* -------------------------------------------------------------------------- */
type StakingStats = {
  era: number;
  commissionAvg: number;
  pointsAvg: number;
  pointsMax: number;
  pointsTotal: number;
  rewardTotal: number;
  selfStakeAvg: number;
  timestamp: number;
  totalStakeAvg: number;
}

export type GetStakingStats = {
  stats: StakingStats[]
}

export const GET_STAKING_STATS = gql`
  query GetStakingStats($limit: Int!, $offset: Int!) {
    stats: staking_stats(limit: $limit, offset: $offset, order_by: {era: desc, points_avg: asc}) {
      commissionAvg: commission_avg
      era
      pointsAvg: points_avg
      pointsMax: points_max
      pointsTotal: points_total
      rewardTotal: reward_total
      selfStakeAvg: self_stake_avg
      timestamp
      totalStakeAvg: total_stake_avg
    }
  }
`
/* -------------------------------------------------------------------------- */
/*                               Staking Rewards                              */
/* -------------------------------------------------------------------------- */
export type StakingReward = {
  accountId: string;
  amount: number;
  blockNumber: number;
  era: number;
  timestamp: string;
  validatorAddress: string;
  identity: {
    display: string;
  }
}

const STAKING_REWARDS_FRAGMENT = gql`
  fragment stakingRewardsFragment on staking_reward {
    accountId: account_id
    amount
    blockNumber: block_number
    era
    timestamp
    validatorAddress: validator_stash_address
    identity {
      display
    }
  }
`;

export type GetStakingRewards = {
  aggregates: { aggregate: { count: number } }
  rewards: StakingReward[]
}
export const GET_STAKING_REWARDS = gql`
  ${STAKING_REWARDS_FRAGMENT}
  query GetStakingRewards ($accountId: String!) {
    aggregates: staking_reward_aggregate(where: { account_id: { _eq: $accountId }}) {
      aggregate {
        count
      }
    }

    rewards: staking_reward(where: { account_id: { _eq: $accountId } }, order_by: { era: desc, block_number: desc }) {
      ...stakingRewardsFragment
    }
  }
`;
