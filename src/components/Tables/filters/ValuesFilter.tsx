import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  useTheme,
  Badge,
  Button,
  Checkbox,
  Input,
  FormControlLabel,
  Stack,
  FormControl
} from '@mui/material';

import Dropdown from '../../Dropdown';
import { arrayCompare } from '../../../utils';

type Props = {
  buttonLabel: string | null | React.ReactNode;
  value?: string[];
  onChange: (v?: string[]) => void;
  availableValues?: string[];
};

const ValuesFilter: FC<Props> = ({ availableValues: available, buttonLabel, onChange, value }) => {
  const theme = useTheme();
  const [localValues, setLocalValues] = useState<string[] | undefined>(value);
  const toggleValue = useCallback(
    (module: string) =>
      setLocalValues((currentModules) =>
        currentModules?.includes(module)
          ? currentModules?.filter((meth) => meth !== module)
          : currentModules?.concat(module).sort((a, b) => a.localeCompare(b))
      ),
    []
  );

  const [valuesFilter, setValuesFilter] = useState('');

  const toggleFilter = useCallback(() => {
    setLocalValues((m) => (m !== undefined ? undefined : []));
  }, []);

  const reset = useCallback(() => setLocalValues(undefined), []);
  const applyChanges = useCallback(() => onChange(localValues), [localValues, onChange]);
  const canApplyChanges = localValues !== value || !arrayCompare(localValues, value);

  const availableValues = useMemo(
    () =>
      available
        ?.filter((v) => v.toLocaleLowerCase().includes(valuesFilter.toLocaleLowerCase()))
        .sort((a, b) => (localValues?.includes(a) ? 0 : 1) - (localValues?.includes(b) ? 0 : 1)),
    [available, localValues, valuesFilter]
  );

  return (
    <Dropdown
      buttonLabel={
        <>
          {buttonLabel}
          &nbsp;
          {localValues !== undefined && localValues.length > 0 && (
            <>
              <Badge color='primary' sx={{ pl: 1 }} badgeContent={localValues.length} />
              &nbsp;
            </>
          )}
        </>
      }
    >
      <Stack padding={2}>
        <FormControlLabel
          sx={{
            mb: 1,
            span: {
              fontSize: '14px',
              fontWeight: 400,
              color:
                localValues !== undefined ? theme.palette.primary.main : theme.palette.grey[600]
            }
          }}
          control={<Checkbox checked={localValues !== undefined} onChange={toggleFilter} />}
          label={'Enable'}
        />
        {localValues !== undefined && (
          <Stack>
            <FormControl>
              <Input
                sx={{ mb: 1 }}
                placeholder='Search...'
                onChange={(v) => setValuesFilter(v.target.value)}
                value={valuesFilter}
              />
            </FormControl>
            <Stack sx={{ maxHeight: '12rem', overflow: 'auto', mb: 1 }}>
              {availableValues?.map((val) => (
                <FormControlLabel
                  key={val}
                  sx={{
                    mb: -0.75,
                    span: {
                      fontSize: '14px',
                      fontWeight: 400,
                      color: localValues.includes(val)
                        ? theme.palette.primary.main
                        : theme.palette.grey[600]
                    }
                  }}
                  control={
                    <Checkbox
                      checked={localValues.includes(val)}
                      onChange={() => toggleValue(val)}
                    />
                  }
                  label={val}
                />
              ))}
            </Stack>
          </Stack>
        )}
        <Stack direction={'row'} marginTop={'12px'} justifyContent={'space-evenly'}>
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
  );
};

export default ValuesFilter;
