import React, { FC } from 'react';
import { Box, Button, Stack } from '@mui/material';

export type NavProps = {
  onBack?: () => void;
  canNext?: boolean;
  onNext?: () => void;
  canBack?: boolean;
  confirmStep?: boolean;
};

const NavButtons: FC<NavProps> = ({ canBack, canNext, confirmStep, onBack, onNext }) => {
  return (
    <Stack direction='row' sx={{ mt: 5 }} justifyContent='space-between'>
      <Box>
        {onBack && (
          <Button disabled={canBack !== undefined && !canBack} onClick={onBack} variant='contained'>
            Back
          </Button>
        )}
      </Box>
      <Box>
        {confirmStep ? (
          <>
            <Button
              disabled={canNext !== undefined && !canNext}
              variant='contained'
              onClick={onNext}
            >
              Submit
            </Button>
          </>
        ) : (
          <>
            {onNext && (
              <Button
                disabled={canNext !== undefined && !canNext}
                onClick={onNext}
                variant='contained'
              >
                Next
              </Button>
            )}
          </>
        )}
      </Box>
    </Stack>
  );
};

export default NavButtons;
