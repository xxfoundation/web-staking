import type { StakingOptions } from '../SimpleStaker';

import React, { FC } from 'react';
import { BN } from '@polkadot/util';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import FormatBalance from '../../../components/FormatBalance';
import Loading from '../../../components/Loading';
import Link from '../../../components/Link';

type Props = {
  option: StakingOptions;
  amount: BN;
  error?: string;
  account: string;
  blockHash?: string;
  loading: boolean;
  reset: () => void;
};

const optionToVerb: Record<StakingOptions, string> = {
  '': '',
  change: '',
  redeem: 'redeemed',
  stake: 'staked',
  unstake: 'unstaked'
};

const FinishPanel: FC<Props> = ({ account, amount, blockHash, error, loading, option, reset }) => {
  if (error) {
    return (
      <>
        <Stack spacing={4} sx={{ pb: 10, textAlign: 'center' }}>
          <Alert severity='error'>
            {error}
          </Alert>
        </Stack>
        <Box sx={{ textAlign: 'right' }}>
          <Button onClick={reset} variant='contained'>
            Go back
          </Button>
        </Box>
      </>
    )
  }

  if (loading || !blockHash) {
    return (
      <Stack spacing={4} sx={{ p: 3, textAlign: 'center' }}>
        <Loading size='md' />

        <Typography variant='body3' sx={{ mt: 2, fontSize: '1.25rem' }}>
          {!loading && !blockHash ? (
            <>Waiting for your transaction to be included in a block...</>
          ) : (
            <>Connecting to the xx network blockchain...</>
          )}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant='h2'>Extrinsic Submitted Successfully</Typography>
      <Typography variant='body3' sx={{ fontSize: '1rem' }}>
        Congratulations! You've successfully{' '}
        {
          option === 'change' ?
          'selected new validators'
          :
          <b>
            {optionToVerb[option]}
            &nbsp;
            <FormatBalance value={amount} />
          </b>
        }
        .
      </Typography>
      <Typography variant='body3' sx={{ fontSize: '1rem' }}>
        See it in all its glory over <Link to={`https://explorer.xx.network/blocks/${blockHash}`}>here</Link>.
      </Typography>
      <Typography variant='body3' sx={{ fontSize: '1rem' }}>
        Check your account <Link to={`https://explorer.xx.network/blocks/accounts/${account}`}>here</Link>.
      </Typography>
      <Box sx={{ p: 4 }} />
      <Box sx={{ textAlign: 'right' }}>
        <Button onClick={reset} variant='contained'>
          Done
        </Button>
      </Box>
    </Stack>
  );
};

export default FinishPanel;
