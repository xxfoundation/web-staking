import React, { useCallback, useState } from 'react';
import { keyring } from '@polkadot/ui-keyring';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import useInput from '../../../../hooks/useInput';

interface Props {
  standardMnemonic: string;
  onFinish: () => void;
}

function Step3({ onFinish, standardMnemonic }: Props): React.ReactElement {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useInput('');

  const addAccount = useCallback((): void => {
    setError(null);
    setLoading(true);
    setTimeout((): void => {
      try {
        const wallet = keyring.addUri(standardMnemonic, password, undefined, 'sr25519');
        setAddress(wallet.pair.address);
        setLoading(false);
      } catch (err) {
        setError('Unable to add your wallet.');
        setLoading(false);
      }
    }, 0);
  }, [password, standardMnemonic]);

  return (
    <Stack style={{ margin: '1em' }} spacing={2}>
      <Typography variant='h2'>Finish Wallet Setup</Typography>
      <Typography variant='body3'>Nicely done! You are now ready to use your wallet.</Typography>
      {!address && (
        <>
          <Typography variant='body3'>
            Define a password used to save your account on this web app.
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
          <Stack direction='row' justifyContent='center' spacing={2}>
            <Box>
              <TextField
                type='password'
                label='Password'
                size='small'
                value={password}
                onChange={setPassword}
              />
            </Box>
            <Button onClick={addAccount} variant='contained'>
              Add Address
            </Button>
          </Stack>
        </>
      )}
      {address && (
        <Stack spacing={0}>
          <Typography variant='body3'>
            <b>xx network blockchain address</b>
          </Typography>
          {loading ? 'Adding...' : <Typography variant='body3'>{address}</Typography>}
        </Stack>
      )}
      <Typography variant='body4' sx={{ marginTop: '2em !important' }}>
        To setup a hardware wallet:{' '}
        <a className='ml-1' href='https://xxnetwork.wiki/Ledger' rel='noreferrer' target='_blank'>
          https://xxnetwork.wiki/Ledger
        </a>
      </Typography>
      <div style={{ textAlign: 'end' }}>
        <Button onClick={onFinish} variant='contained'>
          Done
        </Button>
      </div>
    </Stack>
  );
}

export default Step3;
