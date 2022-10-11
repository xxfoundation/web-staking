import type { WithChildren } from '../../types';

import { Divider, Stack } from '@mui/material';
import React, { FC } from 'react';

export const TableCellLeftDivider: FC<WithChildren> = ({ children }) => {
  return (
    <Stack direction={'row'} spacing={2} sx={{ 'a': { textAlign: 'center', width: '100%' } }}>
      <Divider orientation='vertical' variant='fullWidth' flexItem />
      {children}
    </Stack>
  );
};
