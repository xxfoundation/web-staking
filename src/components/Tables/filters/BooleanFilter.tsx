import { useTheme, Badge, Button, Checkbox, FormControlLabel, Stack, Switch } from '@mui/material';
import React, { FC, useCallback, useState } from 'react';

import Dropdown from '../../Dropdown';

export type Props = {
  label: string;
  toggleLabel: (v: boolean) => string;
  onChange: (v: boolean | null) => void;
  value: boolean | null;
}

const BooleanFilter: FC<Props> = ({ label, onChange, toggleLabel, value }) => {
  const theme = useTheme();
  const [valueFilter, setValueFilter] = useState(value);

  const reset = useCallback(() => setValueFilter(null), []);
  const toggleFilter = useCallback(() => setValueFilter((v) => !v), []);
  const toggleFilterEnabled = useCallback(
    () => setValueFilter((v) => v === null ? true : null),
    []
  );
  const applyChanges = useCallback(
    () => onChange(valueFilter),
    [onChange, valueFilter]
  );

  const canApplyChanges = value !== valueFilter;
  const resultLabel = toggleLabel(valueFilter || false);

  return (
    <Dropdown buttonLabel={
      <>
        {label}
        &nbsp;
        {valueFilter !== null && <>
          <Badge color='primary' sx={{ pl: 1 }} badgeContent={1} />
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
                valueFilter !== null
                  ? theme.palette.primary.main
                  : theme.palette.grey[600]
            }
          }}
          control={
            <Checkbox
              checked={valueFilter !== null}
              onChange={toggleFilterEnabled}
            />
          }
          label={'Enable'}
        />
        {valueFilter !== null && (
          <FormControlLabel
            label={resultLabel}
            control={
              <Switch
                onChange={toggleFilter}
                inputProps={{'aria-label': resultLabel}}
                checked={valueFilter}
                color='success' />
            }
          />
        )}
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

export default BooleanFilter;
