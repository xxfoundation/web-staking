import React, { FC } from 'react';
import { Stack } from '@mui/material';
import AccountDisplay from './AccountDisplay';

type Props = {
  accounts: string[];
};

const AccountList: FC<Props> = ({ accounts }) => (
  <Stack spacing={2} sx={{ overflow: 'auto', maxHeight: '10rem', width: '100%' }}>
    {accounts?.map((acct) => (
      <AccountDisplay account={acct} key={acct} targetBlank={true} />
    ))}
  </Stack>
);

export default AccountList;
