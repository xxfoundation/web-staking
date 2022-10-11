import React, { FC, useCallback, useState } from 'react';
import { Box, Button, Dialog, TextField, Grid, Stack, Typography, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { keyring } from '@polkadot/ui-keyring';
import { useSnackbar } from 'notistack';

import useInput from '../../../hooks/useInput';
import useAccounts from '../../../hooks/useAccounts';

type Props = {
  open: boolean;
  onClose: (value: string[]) => void;
};

const MNEMONIC_COUNT = 24;
const inputCount = Array.from(Array(MNEMONIC_COUNT).keys()).map((i) => i);

const MnemonicDialog: FC<Props> = ({ onClose, open }) => {
  const { allAccounts: accounts } = useAccounts();
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPasswordHandler, setPassword] = useInput();
  const [mnemonic, setMnemonic] = useState<string[]>(inputCount.map(() => ''));
  const [isValid, setValid] = useState(true);

  const notifyOfDuplicate = useCallback((acct: string) => {
    if (accounts.includes(acct)) {
      enqueueSnackbar(
        'Ignoring duplicate.',
        { variant: 'warning' }
      );
    }
  }, [accounts, enqueueSnackbar]);

  const handleClose = useCallback(() => {
    onClose(mnemonic);
    setMnemonic(inputCount.map(() => ''));
    setPassword('');
  }, [mnemonic, onClose, setPassword]);

  const handleDone = useCallback(() => {
    const seed = mnemonic.join(' ');
    const valid = mnemonicValidate(seed);
    setValid(valid);
    if (valid) {
      const result = keyring.addUri(seed, password, undefined, 'sr25519');
      notifyOfDuplicate(result.json.address);
      handleClose();
    }
  }, [handleClose, mnemonic, notifyOfDuplicate, password]);

  const mnemonicSetter = useCallback(
    (index: number) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      const copy = mnemonic.slice();
      const words = evt.target.value.split(' ');
      words.forEach((word, i) => {
        copy[index + i] = word;
      });
      setMnemonic(copy);
    },
    [mnemonic]
  );

  return (
    <Dialog onClose={handleClose} open={open}>
      <Button variant='text' sx={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
        <Close />
      </Button>
      <Stack spacing={3} sx={{ p: { md: 5, sm: 3, xs: 2 } }}>
        <Typography variant='h3'>Mnemonic Phrase</Typography>
        {!isValid && <Alert severity='error'>Please verify that your mnemonic is correct.</Alert>}
        <Grid container>
          {inputCount.map((i) => (
            <Grid key={i} item xs={4} sm={3}>
              <TextField
                error={!isValid}
                onChange={mnemonicSetter(i)}
                value={mnemonic[i]}
                sx={{ m: 1 }}
                size='small'
                label={`${i + 1}.`}
                variant='outlined'
              />
            </Grid>
          ))}
        </Grid>
        <Box>
          <TextField
            type='password'
            label='Password'
            size='small'
            value={password}
            onChange={setPasswordHandler}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button onClick={handleDone} variant='contained'>
            Done
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default MnemonicDialog;
