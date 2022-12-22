import { BN } from '@polkadot/util';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Radio,
  Stack,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Button,
  Box
} from '@mui/material';
import { Close, Info, Warning } from '@mui/icons-material';
import { keyring } from '@polkadot/ui-keyring';

import useAccounts from '../../../hooks/useAccounts';
import usePagination from '../../../hooks/usePagination';
import useApi from '../../../hooks/useApi';
import { Table, TableContainer } from '../../../components/Tables/Table.styled';
import FormatBalance from '../../../components/FormatBalance';
import Loading from '../../../components/Loading';
import { CustomTooltip as Tooltip } from '../../../components/Tooltip';
import StakingRewardsElement from '../utils/StakingRewardsElement';
import AccountDisplay from '../utils/AccountDisplay';

type Props = {
  selected: string;
  onSelect: (addr: string) => void;
};

const WalletSelection: FC<Props> = ({ onSelect, selected }) => {
  const accounts = useAccounts();
  const { api } = useApi();
  const pagination = usePagination({ rowsPerPage: 10 });
  const [balances, setBalances] = useState<BN[]>();
  const [stashes, setStashes] = useState<string[]>(['']);

  const { setCount } = pagination;
  useEffect(() => {
    setCount(accounts.allAccounts.length);
  }, [accounts.allAccounts.length, setCount]);

  useEffect(() => {
    if (stashes[0] !== '') {
      api?.query.system.account
        .multi(stashes)
        .then((infos) => {
          const b = infos.map((info) => info.data.free.add(info.data.reserved));
          setBalances(b);
        })
        .catch((error) => console.error(error));
    }
  }, [stashes, api?.query?.system?.account]);

  useEffect(() => {
    api?.query?.staking?.ledger
      .multi(accounts?.allAccounts)
      .then((ledgers) => {
        const st = ledgers.map((ledger, idx) => ledger.isSome ? ledger.unwrap().stash.toString() : accounts?.allAccounts[idx]);
        setStashes(st);
      })
      .catch((error) => console.error(error));
  }, [accounts?.allAccounts, api?.query?.staking?.ledger]);

  const handleAccountChange = useCallback(
    (acct: string) => () => {
      onSelect(acct);
    },
    [onSelect]
  );

  const { paginate } = pagination;
  const paginated = useMemo(() => paginate(accounts.allAccounts), [accounts, paginate]);

  const forget = useCallback(
    (acct: string) => () => {
      const confirmed = confirm('Are you sure you want to forget this account?');
      if (confirmed) {
        keyring.forgetAccount(acct);
      }
    },
    []
  );

  return (
    <Stack spacing={4}>
      <Typography variant='h2' sx={{fontSize: {xs: '22px', md: '30px'}, textAlign: {xs: 'center', md: 'left'}}}>Select Wallet</Typography>
      {!balances || !accounts || !stashes || !navigator.onLine ? (
        <Box sx={{ p: 5, py: 20 }}>
          <Loading size='md' />
          <Typography variant='body1' sx={{ textAlign: 'center', marginTop: '1em' }}>
            Trying to connect to the API... Please check your internet connectivity
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size='small' padding='none'>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Rewards</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((acct, i) => (
                <TableRow key={acct} onClick={(balances[i] && !balances[i].eqn(0)) ? handleAccountChange(acct) : undefined} sx={{ cursor: 'pointer' }}>
                  <TableCell data-label='Account'>
                    <Stack direction='row'>
                      {balances[i]?.eqn(0) && (
                        <Tooltip
                          title='A positive balance is required for any staking activity'
                          placement='top'
                        >
                          <Warning sx={{ mr: 1, color: 'warning.main' }} />
                        </Tooltip>
                      )}
                      {acct != stashes[i] && (
                        <Tooltip
                            title='This account is a Controller. Balance and rewards shown are from the respective Stash account'
                            placement='top'
                        >
                          <Info sx={{ mr: 1, color: 'info.main' }} />
                        </Tooltip>
                      )}
                      <AccountDisplay  
                        account={acct}
                        balance={balances[i]}/>
                    </Stack>
                  </TableCell>
                  <TableCell data-label='Balance'>
                    <Typography>
                      <FormatBalance value={balances[i]} />
                    </Typography>
                  </TableCell>
                  <TableCell data-label='Rewards'>
                    <StakingRewardsElement address={stashes[i]} />
                  </TableCell>
                  <TableCell>
                    <Stack alignItems='center' direction='row'>
                      <Radio
                        disabled={!balances[i] || balances[i].eqn(0)}
                        checked={selected === acct}
                        onChange={handleAccountChange(acct)}
                        value={acct}
                      />
                      <Button
                        size='small'
                        color='error'
                        onClick={forget(acct)}
                        sx={{ minWidth: 0 }}
                      >
                        <Close color='error' />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination.controls}
        </TableContainer>
      )}
    </Stack>
  );
};

export default WalletSelection;
