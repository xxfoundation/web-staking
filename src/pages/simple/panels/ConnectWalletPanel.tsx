import React, { FC, useCallback } from 'react';
import { Alert, AlertTitle, Button, Link, Stack, Typography } from '@mui/material';
import { keyring } from '@polkadot/ui-keyring';

import GenerateWalletDialog from '../dialogs/GenerateWalletDialog';
import MnemonicDialog from '../dialogs/MnemonicDialog';
import KeyfileDialog from '../dialogs/KeyfileDialog';
import useToggle from '../../../hooks/useToggle';
import useAccounts from '../../../hooks/useAccounts';
import AccountList from '../utils/AccountList';
import { getStakedReturn } from '../utils';
import { Economics, LISTEN_FOR_ECONOMICS } from '../../../schemas/economics.schema';
import { useQuery } from '@apollo/client';
import Loading from '../../../components/Loading';

const { href: walletUrl } = new URL('/#/accounts', process.env.REACT_APP_WALLET_URL ?? '');

const ConnectWallet: FC = () => {
  const accounts = useAccounts();
  const [generateDialogOpen, generateDialog] = useToggle();
  const [mnemonicDialogOpen, mnemonicDialog] = useToggle();
  const [keyfileDialogOpen, keyfileDialog] = useToggle();
  const [expandWallets, wallets] = useToggle();
  const [expandConnectionButtons, connectionButtons] = useToggle();
  const [expandDisclaimer, disclaimer] = useToggle();

  const handleKeyfileClose = useCallback(() => {
    keyfileDialog.toggleOff();
  }, [keyfileDialog]);

  const forget = useCallback(() => {
    const confirmed = confirm(
      `Are you sure you want to delete ${accounts.allAccounts.length} accounts?`
    );
    if (confirmed) {
      accounts.allAccounts.forEach((acct) => {
        keyring.forgetAccount(acct);
      });
    }
  }, [accounts.allAccounts]);

  // Get APY
  const query = useQuery<{ economics: [Economics] }>(LISTEN_FOR_ECONOMICS);
  const economics = query.data?.economics[0];
  const loadingQuery = query.loading;
  const avgStakedReturn = economics ? getStakedReturn(economics) : 0;

  return (
    <>
      <GenerateWalletDialog open={generateDialogOpen} onClose={generateDialog.toggleOff} />
      <MnemonicDialog open={mnemonicDialogOpen} onClose={mnemonicDialog.toggleOff} />
      <KeyfileDialog open={keyfileDialogOpen} onClose={handleKeyfileClose} />
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Stack direction={'column'} spacing={2}>
            <Typography variant='h2' sx={{fontSize: {xs: '22px', md: '30px'}, textAlign: {xs: 'center', md: 'left'}}}>Connect Wallet</Typography>
            <Typography variant='body3'>
              Welcome to the xx network’s simplified staking tool. This app will help you stake (or
              unstake) your xx coins and redeem your rewards with only a handful of clicks while
              ensuring you retain control and custody of your coins at all times.
            </Typography>
            <Loading loading={loadingQuery}>
              <Typography variant='h4' sx={{ textAlign: 'left' }}>
                Average Return (APY): <b>{avgStakedReturn.toFixed(2)}%</b>
              </Typography>
            </Loading>
            {!accounts.hasAccounts && (
              <>
              <Typography variant='body3' sx={{ textAlign: 'left' }}>
                To get started please generate a wallet or recover your existing wallet(s) using one
                of the options below.
              </Typography>
              <Alert severity='info'>
                <AlertTitle sx={{ fontSize: '1rem', mb: 1 }}>
                  Do you have your accounts in the wallet webapp?
                </AlertTitle>
                <Typography variant='body3'>
                  You can head to the Accounts <Link target='__blank' href={walletUrl}>page</Link> and Export your accounts.
                  Then use the "Import Keyfile (JSON)" option below to add your accounts to this app.
                </Typography>
              </Alert>
              </>
            )}
          </Stack>
        </Stack>
        {accounts.hasAccounts && (
          <Stack display='columns' spacing={2}>
            <Alert
              action={
                <Button sx={{ minWidth: 0 }} size='small' onClick={wallets.toggle}>
                  {wallets.icon}
                </Button>
              }
              severity='success'
            >
              Found {accounts.allAccounts.length} account
              {accounts.allAccounts.length > 1 ? 's' : ''}. &nbsp;
              <Link onClick={forget} href='#' underline='hover'>
                Forget?
              </Link>{' '}
              &nbsp;
            </Alert>
            {expandWallets && accounts.allAccounts && (
              <AccountList accounts={accounts.allAccounts} />
            )}
          </Stack>
        )}
        {accounts.hasAccounts && (
          <Button
            onClick={connectionButtons.toggle}
            endIcon={connectionButtons.icon}
            sx={{ display: 'flex', justifyContent: 'start' }}
          >
            Add more wallets
          </Button>
        )}
        {(expandConnectionButtons || !accounts.hasAccounts) && (
          <Stack spacing={5} direction={{ xs: 'column', sm: 'row' }}>
            <Button onClick={generateDialog.toggleOn} variant='contained'>
              Generate Wallet
            </Button>
            <Button onClick={mnemonicDialog.toggleOn} variant='contained'>
              Recovery Phrase
            </Button>
            <Button onClick={keyfileDialog.toggleOn} variant='contained'>
              Import Keyfile (JSON)
            </Button>
          </Stack>
        )}
        <Alert sx={{ mt: 3 }} severity='warning'>
          <Typography variant='h5' sx={{ pb: 1 }}>
            Important Notice
          </Typography>
          <Typography variant='body3'>
            All xx coins you stake will be <b>locked</b>, meaning they cannot be transferred to any
            other wallet. If you decide to stop staking some or all of your coins, there is a{' '}
            <b>28 day</b> waiting period (from the time you unstake them) before you can redeem and
            then be able to transfer them. Please remember that when you stake xx coins, they will
            remain staked until you decide to unstake them.
          </Typography>
        </Alert>

        <Button
          onClick={disclaimer.toggle}
          endIcon={disclaimer.icon}
          sx={{ width: 'fit-content', alignSelf: 'start', color: 'brown' }}
        >
          Disclaimer
        </Button>
        {expandDisclaimer && (
          <Alert sx={{ mt: '0.25em !important' }} severity='info'>
            <Typography variant='body3'>
              This app uses an algorithm which attempts to simplify the decision making process for
              staking by analyzing all potential nodes’ performance, stake, and commission and
              suggesting up to 16 viable nodes per wallet.
              <br />
              <br />
              This app does not make any guarantees as to the future performance or viability of any
              nodes. While extremely rare, if nodes you’ve staked on misbehave, it is possible for
              you to lose some of your staked xx coin.
              <br />
              <br />
              This app does not guarantee fixed returns. The staking rewards earned daily will
              depend on the selected validators, their performance, and other stakers. For most
              users, the staking returns should be close to the network average (displayed above).
            </Typography>
          </Alert>
        )}
      </Stack>
    </>
  );
};

export default ConnectWallet;
