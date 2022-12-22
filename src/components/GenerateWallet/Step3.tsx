import React, { useCallback, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

import useInput from '../../hooks/useInput';
import { saveAs } from 'file-saver';
import type { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/api';

interface Props {
  keypair: KeyringPair | undefined;
  keyring: Keyring | undefined;
  onFinish: () => void;
}

const getTimestampString = (date: Date) => date.toUTCString().replace(',','').replaceAll(' ', '_').replaceAll(':', '-');

const exportAccount = (keypair: KeyringPair | undefined, keyring: Keyring | undefined, password: string): void => {
  if (keypair && keyring) {
    const exported = keyring.toJson(keypair.address, password)
    const blob = new Blob([JSON.stringify(exported)], { type: 'application/json; charset=utf-8' });
    saveAs(blob, `${keypair.address}_${getTimestampString(new Date())}.json`);
  }
};

function Step3({ keypair, keyring, onFinish }: Props): React.ReactElement {
  const [download, setDownload] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useInput('');

  const saveAccount = useCallback((): void => {
    setError(null);
    setTimeout((): void => {
      try {
        exportAccount(keypair, keyring, password);
        setDownload(false);
      } catch (err) {
        setError('Unable to save your account in an encrypted file.');
        setDownload(true);
      }
    }, 0);
  }, [keypair, keyring, password]);

  return (
    <Stack style={{ margin: '1em' }} spacing={2}>
      <Typography variant='h2' sx={{fontSize: {xs: '22px', md: '30px'}, textAlign: {xs: 'center', md: 'left'}}}>Finish Wallet Setup</Typography>
      <Typography variant='body3'>Nicely done! You are now ready to use your wallet.</Typography>
      {keypair ?
        <Stack spacing={0} sx={{ borderLeft: '4px solid #00A2D6', paddingLeft: '0.5em'  }}>
          <Typography variant='body3'><b>xx network blockchain public address</b></Typography>
          <Typography variant='body3'>{keypair?.address}</Typography>
        </Stack>
        : <Alert severity='error'>Keypair not detected. Error generating Sleeve Wallet. Please try again.</Alert>}
      {keypair && download && (
        <>
          <Typography variant='body3'>
            Define a password used to save your account on an encrypted file <i>OR</i> press <i>DONE</i>
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
            <Button onClick={saveAccount} variant='contained'>
              Export JSON Account File
            </Button>
          </Stack>
        </>
      )}
      {!download &&
        <Typography variant='body3'>
          Account successfully exported in JSON format! Wallet generation completed.
        </Typography>
      }
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
