import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import React, { FC } from 'react';

import { WithChildren } from './types';

const SnackbarCloseButton: FC<{ snackbarKey: SnackbarKey }> = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();
  const theme = useTheme();

  return (
    <IconButton
      sx={{ color: theme.palette.grey['100'] }}
      onClick={() => closeSnackbar(snackbarKey)}
    >
      <CloseIcon />
    </IconButton>
  );
};

const SnackbarCustomProvider: FC<WithChildren> = ({ children }) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      preventDuplicate={true}
      autoHideDuration={4000}
      style={{ borderRadius: 14 }}
      action={(key) => <SnackbarCloseButton snackbarKey={key} />}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarCustomProvider;
