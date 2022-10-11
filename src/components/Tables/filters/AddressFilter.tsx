import { useTheme, Badge, Button, Checkbox, FormControlLabel, Stack } from '@mui/material';

import React, { FC, useCallback, useState } from 'react';

import Dropdown from '../../Dropdown';

export type AddressFilters = {
  from?: string;
  to?: string;
}

export type Props = {
  label: string | React.ReactElement;
  onChange: (v: AddressFilters) => void;
  value: AddressFilters;
  address: string;
}

const AddressFilter: FC<Props> = ({ address, label, onChange, value }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState<AddressFilters>({});

  const reset = useCallback(() => setFilters({}), []);
  const filterToggle = useCallback(
    (key: keyof AddressFilters) => () => setFilters(
      (f) => ({ ...f, [key]: f[key] ? undefined : address })
    ),
    [address]
  )

  const applyChanges = useCallback(
    () => {
      onChange(filters)
    },
    [onChange, filters]
  );

  const canApplyChanges = value.from !== filters.from || value.to !== filters.to;
  const filterCount = Object.values(value).filter((v) => !!v).length;

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
        <FormControlLabel
          sx={{
            mb: 1,
            span: {
              fontSize: '14px',
              fontWeight: 400,
              color:
                filters.from
                  ? theme.palette.primary.main
                  : theme.palette.grey[600]
            }
          }}
          control={
            <Checkbox
              checked={filters.from !== undefined}
              onChange={filterToggle('from')}
            />
          }
          label={'From this address'}
        />
        <FormControlLabel
          sx={{
            mb: 1,
            span: {
              fontSize: '14px',
              fontWeight: 400,
              color:
                filters.to
                  ? theme.palette.primary.main
                  : theme.palette.grey[600]
            }
          }}
          control={
            <Checkbox
              checked={filters.to !== undefined}
              onChange={filterToggle('to')}
            />
          }
          label={'To this address'}
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

export default AddressFilter;
