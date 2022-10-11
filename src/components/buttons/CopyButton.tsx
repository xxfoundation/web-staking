import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { IconButton, IconButtonProps, Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

import useCopyClipboard from '../../hooks/useCopyToClipboard';
import { theme } from '../../theme';

export const callbackCopyMessage = (value: ReactNode) => {
  return (
    <Stack
      spacing={1}
      sx={{
        maxHeight: '60px',
        maxWidth: '300px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <CheckCircleOutlineIcon sx={{ color: theme.palette.success.light }} />
        <Typography fontSize={10} fontWeight={600}>
          Copied to Clipboard
        </Typography>
      </Stack>
      <Typography fontSize={10} fontStyle={'italic'} component={'span'}>
        {value}
      </Typography>
    </Stack>
  );
};

const CopyButton: React.FC<{ value: string } & IconButtonProps> = ({ value, ...props }) => {
  const [isCopied, staticCopy] = useCopyClipboard(4000);
  return (
    <IconButton
      {...props}
      size='small'
      arial-label='copy'
      onClick={() => {
        staticCopy(value, callbackCopyMessage);
      }}
    >
      {isCopied ? (
        <FileCopyIcon fontSize={'small'} color={'primary'} />
      ) : (
        <FileCopyOutlinedIcon fontSize={'small'} color={'primary'} />
      )}
    </IconButton>
  );
};

export default CopyButton;
