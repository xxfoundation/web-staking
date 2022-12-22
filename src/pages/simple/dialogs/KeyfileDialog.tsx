import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { KeyringPair$Json } from '@polkadot/keyring/types';

import React, { FC, useCallback, useMemo, useState } from 'react';
import { Alert, Box, Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { keyring } from '@polkadot/ui-keyring';

import useInput from '../../../hooks/useInput';
import useApi from '../../../hooks/useApi';
import useAccounts from '../../../hooks/useAccounts';

type Props = {
  open: boolean;
  onClose: (value?: unknown) => void;
};

const parseJsonFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target?.result?.toString() ?? ''));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
};

const isKeyringPairs$Json = (
  json: KeyringPair$Json | KeyringPairs$Json
): json is KeyringPairs$Json => {
  return json.encoding.content.includes('batch-pkcs8');
};

const parseFile = async (
  file: File,
  setError: (error: string | null) => void
): Promise<KeyringPair$Json | KeyringPairs$Json | null> => {
  try {
    return (await parseJsonFile(file)) as KeyringPair$Json | KeyringPairs$Json;
  } catch (error) {
    setError((error as Error).message ? (error as Error).message : (error as Error).toString());
  }

  return null;
};

const KeyfileDialog: FC<Props> = ({ onClose, open }) => {
  const { api } = useApi();
  const { allAccounts: accounts } = useAccounts();
  const { enqueueSnackbar } = useSnackbar();
  const [json, setJson] = useState<KeyringPair$Json | KeyringPairs$Json | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPasswordHandler, setPassword] = useInput('');
  const apiGenesisHash = useMemo(() => api?.genesisHash.toHex(), [api]);
  const duplicateAccountCount = useMemo(() => {
    if (!json) { return 0; }
    const newAccts = isKeyringPairs$Json(json) ? json.accounts.map((a) => a.address) : [json?.address];
    return newAccts.filter((a) => accounts.includes(a)).length;
  }, [accounts, json])

  const notifyOfDuplicateAccounts = useCallback(() => {
    if (duplicateAccountCount > 0) {
      enqueueSnackbar(
        `Ignoring ${duplicateAccountCount} duplicate${duplicateAccountCount > 1 ? 's' : ''}.`,
        { variant: 'warning' }
      );
    }
  }, [duplicateAccountCount, enqueueSnackbar]);

  const accountsContainDifferentGenesis = useMemo<boolean>(() => {
    if (!json) {
      return false;
    }
    if (isKeyringPairs$Json(json)) {
      return json.accounts.map((a) => a.meta.genesisHash).some((h) => h !== apiGenesisHash);
    } else {
      return json.meta.genesisHash !== apiGenesisHash;
    }
  }, [apiGenesisHash, json]);

  const accountCount = useMemo<number>(() => {
    if (!json) {
      return 0;
    }

    return isKeyringPairs$Json(json) ? json.accounts.length : json.address ? 1 : 0;
  }, [json]);

  const handleClose = useCallback(() => {
    setError(null);
    onClose(undefined);
  }, [onClose]);

  const onChangeFile = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    const currentFile = evt.target.files?.[0];
    if (currentFile) {
      parseFile(currentFile, setError)
        .then(setJson)
        .catch((err) => console.error(err));
    }
  }, []);

  const onAdd = useCallback((): void => {
    setError(null);
    if (!json) {
      return;
    }

    setLoading(true);
    setTimeout((): void => {
      try {
        if (isKeyringPairs$Json(json)) {
          keyring.restoreAccounts(json, password);
        } else {
          keyring.restoreAccount(json, password);
        }

        notifyOfDuplicateAccounts();
        setLoading(false);
        setJson(null);
        setPassword('');
        onClose();
      } catch (err) {
        setError('Decoding failed, double check your password.');
        setLoading(false);
      }
    }, 0);
  }, [json, setPassword, onClose, notifyOfDuplicateAccounts, password]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <Button variant='text' sx={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
        <Close />
      </Button>
      <Stack spacing={3} sx={{ p: { md: 5, sm: 3, xs: 2 } }}>
        <Typography variant='h3'>Upload Backup File</Typography>
        <Typography variant='body3'>
          Supply a backed-up JSON file, encrypted with your account-specific password
        </Typography>
        {accountCount > 0 && (
          <Alert severity='info'>
            Found {accountCount} account{accountCount > 1 ? 's' : ''}.
          </Alert>
        )}
        {error && <Alert severity='error'>{error}</Alert>}
        {duplicateAccountCount > 0 && (
          <Alert severity='warning'>
            We've detected {duplicateAccountCount} duplicate account{duplicateAccountCount > 1 ? 's' : ''}.
          </Alert>
        )}
        {accountsContainDifferentGenesis && (
          <Alert severity='warning'>
            One or more accounts imported were originally generated on a different network.
          </Alert>
        )}
        <Stack direction='row' justifyContent='center' spacing={2}>
          <Box>
            <Button variant='contained' component='label' sx={{minWidth: '9em'}}>
              Upload File
              <input
                onChange={onChangeFile}
                accept='application/JSON'
                id='json-import'
                type='file'
                hidden
              />
            </Button>
          </Box>
          <Box>
            <TextField
              type='password'
              label='Password'
              size='small'
              value={password}
              onChange={setPasswordHandler}
            />
          </Box>
        </Stack>
        <Box sx={{ textAlign: 'center' }}>
          <Button disabled={loading} onClick={onAdd} variant='contained'>
            {loading ? 'Importing...' : 'Import'}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default KeyfileDialog;
