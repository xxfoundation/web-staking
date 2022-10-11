import { Close } from '@mui/icons-material';
import { Alert, Box, Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import keyring from '@polkadot/ui-keyring';
import React, { FC, useCallback, useState } from 'react';
import useInput from '../../../hooks/useInput';

type Props = {
  open: boolean;
  account: string;
  onClose: () => void;
};

const PromptPassword: FC<Props> = ({ account, onClose, open }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useInput('');

  const handleClose = useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  const onAdd = useCallback((): void => {
    setError(null);
    setLoading(true);
    setTimeout((): void => {
      try {
        keyring.saveAccount(keyring.getPair(account), password);
        setLoading(false);
        onClose();
      } catch (err) {
        setError('Decoding failed, double check your password.');
        setLoading(false);
      }
    }, 0);
  }, [onClose, account, password]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <Button variant='text' sx={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
        <Close />
      </Button>
      <Stack spacing={3} sx={{ p: { md: 5, sm: 3, xs: 2 } }}>
        <Typography variant='h3'>Unlock Wallet</Typography>
        <Typography variant='body3'>
          Insert the password used to save your account to this web app.
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
        </Stack>
        <Box sx={{ textAlign: 'center' }}>
          <Button disabled={loading} onClick={onAdd} variant='contained'>
            {loading ? 'Unlocking...' : 'Unlock'}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default PromptPassword;
