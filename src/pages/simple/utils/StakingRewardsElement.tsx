import { BN, BN_ZERO } from '@polkadot/util';
import React, { FC, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import FormatBalance from '../../../components/FormatBalance';
import { useQuery } from '@apollo/client';
import { GET_STAKING_REWARDS_COUNTS, GetStakingRewardCounts } from '../../../schemas/accounts.schema';
import Loading from '../../../components/Loading';

type Props = {
  address: string;
};

const StakingRewardsElement: FC<Props> = ({ address }) => {
  const [rewards, setRewards] = useState<BN>(BN_ZERO);
  const { data, loading }= useQuery<GetStakingRewardCounts>(GET_STAKING_REWARDS_COUNTS, {
    variables: { accountId: address }
  });

  useEffect(() => {
    if (data && !loading) {
      setRewards(new BN(data.rewardsInfo.aggregate.sum.amount || 0))
    }
  }, [address, data, loading])

  return (
    <>
    {loading ? (
        <Loading size='xs' />
    ) : (
        <Typography>
            <FormatBalance value={rewards} />
        </Typography>
    )}
    </>
  );
};

export default StakingRewardsElement;
