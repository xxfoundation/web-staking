import { useTheme, Badge, Button, Stack, TextField } from '@mui/material';

import React, { useCallback } from 'react';
import useInput from '../../../hooks/useInput';

import Dropdown from '../../Dropdown';


export type Props = {
  label: string | React.ReactElement;
  onChange: (v?: string) => void;
  value?: string;
}

const GeneralFilter = ({ label, onChange, value }: Props) => {
  const theme = useTheme();
  const [filter, onFilterChange, setFilter] = useInput(value);

  const reset = useCallback(() => setFilter(''), [setFilter]);
  const applyChanges = useCallback(
    () => {
      onChange(filter)
    },
    [onChange, filter]
  );

  const canApplyChanges = value !== filter;
  const filterCount = value ? 1 : 0;

  return (
    <Dropdown buttonLabel={
      <>
        {label}
        &nbsp;
        {(filterCount > 0) && <>
          <Badge color='primary' sx={{ pl: 1 }} badgeContent={filterCount} />
          &nbsp;
        </>
        }
      </>
    }>
      <Stack padding={2}>
        <TextField
          placeholder='Filter'
          sx={{
            mb: 1,
            span: {
              fontSize: '14px',
              fontWeight: 400,
              color:
                filter
                  ? theme.palette.primary.main
                  : theme.palette.grey[600]
            }
          }}
          size='small'
          onChange={onFilterChange}
          value={filter}
          />
        <Stack
          direction={'row'}
          marginTop={'12px'}
          justifyContent={'space-evenly'}>
          <Button
            disabled={!canApplyChanges}
            variant='contained'
            sx={{
              borderRadius: '45px',
              textTransform: 'uppercase',
              marginRight: '1em'
            }}
            onClick={applyChanges}
          >
            Apply
          </Button>
          <Button
            variant='contained'
            sx={{
              bgcolor: theme.palette.grey[200],
              color: theme.palette.text.primary,
              borderRadius: '45px',
              textTransform: 'uppercase',
              boxShadow: 'none',
              [':hover']: {
                bgcolor: theme.palette.grey[200],
                color: theme.palette.text.primary
              }
            }}
            onClick={reset}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Dropdown>
  )
}

export default GeneralFilter;
