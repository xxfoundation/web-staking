import React, { FC, useCallback, useEffect, useState } from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useSnackbar } from 'notistack';

import useToggle from '../hooks/useToggle';

const defaultFrom = dayjs.utc().startOf('day');
defaultFrom.set('hour', 7);
const defaultTo = dayjs.utc();

export type Range = {
  from: string | null;
  to: string | null;
};

export type Props = {
  value?: Range;
  onChange: (range: Range) => void;
  maximumRange?: number;
};

const THREE_MONTHS_IN_SECONDS = 7890000000;

const DateRange: FC<Props> = ({
  onChange,
  value = { from: null, to: null },
  maximumRange = THREE_MONTHS_IN_SECONDS
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [from, setFrom] = useState<string | null>(value.from);
  const [to, setTo] = useState<string | null>(value.to);
  const [fromEnabled, { toggle: toggleFrom, toggleOff: disableFrom }] = useToggle(!!from);
  const [toEnabled, { toggle: toggleTo, toggleOff: disableTo }] = useToggle(!!to);

  const applyChanges = useCallback(() => {
    onChange({ from, to });
  }, [from, to, onChange]);

  const reset = useCallback(() => {
    setFrom(null);
    disableFrom();
    setTo(null);
    disableTo();
  }, [disableFrom, disableTo]);

  const validateRange = useCallback(
    (keyChanged: keyof Range, r: Range) => {
      let newRange = r;
      const timeThatToIsBehindOfFrom = dayjs.utc(r.from).diff(r.to).valueOf() ?? 0;

      if (timeThatToIsBehindOfFrom > 0) {
        enqueueSnackbar('You cannot travel back in time', { variant: 'error' });

        newRange =
          keyChanged === 'from'
            ? {
                ...r,
                from: r.to
              }
            : { ...r, to: r.from };
      }

      const differenceOverMax = dayjs.utc(r.to).diff(r.from).valueOf() - maximumRange;
      if (differenceOverMax > 0) {
        enqueueSnackbar(
          `Date range is over maximum of ${dayjs.duration(maximumRange).humanize()}`,
          { variant: 'error' }
        );
        if (keyChanged === 'to') {
          newRange = {
            ...r,
            to: dayjs.utc(dayjs.utc(r.to).valueOf() - differenceOverMax).toISOString()
          };
        } else {
          newRange = {
            ...r,
            from: dayjs.utc(dayjs.utc(r.from).valueOf() + differenceOverMax).toISOString()
          };
        }
      }

      return newRange;
    },
    [enqueueSnackbar, maximumRange]
  );

  const validatedOnChange = useCallback(
    (k: keyof Range, r: Range) => {
      const { from: f, to: t } = validateRange(k, r);
      if (k === 'from') {
        setFrom(f);
      } else {
        setTo(t);
      }
    },
    [validateRange]
  );

  const fromChanged = useCallback(
    (f: Dayjs | null) => {
      validatedOnChange('from', {
        ...value,
        from: f?.toISOString() ?? null
      });
    },
    [value, validatedOnChange]
  );

  const toChanged = useCallback(
    (t: Dayjs | null) => {
      validatedOnChange('to', {
        ...value,
        to: t?.toISOString() ?? null
      });
    },
    [validatedOnChange, value]
  );

  useEffect(() => {
    if (fromEnabled && from === null) {
      fromChanged(defaultFrom);
    }

    if (!fromEnabled && from !== null) {
      fromChanged(null);
    }
  }, [fromChanged, fromEnabled, from]);

  useEffect(() => {
    if (toEnabled && to === null) {
      toChanged(defaultTo);
    }

    if (!toEnabled && to !== null) {
      toChanged(null);
    }
  }, [to, toChanged, toEnabled]);

  const canApplyChanges = value.from !== from || value.to !== to;

  return (
    <Stack padding={2}>
      <FormControlLabel
        sx={{
          mb: 1,
          span: {
            fontSize: '14px',
            fontWeight: 400,
            color: fromEnabled ? theme.palette.primary.main : theme.palette.grey[600]
          }
        }}
        control={<Checkbox checked={fromEnabled} onChange={toggleFrom} />}
        label={'From'}
      />
      {fromEnabled && (
        <FormControl sx={{ mb: 1.5 }} component='div'>
          <MobileDateTimePicker
            disableFuture
            label={'From (UTC)'}
            onChange={fromChanged}
            value={from}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      )}
      <FormControlLabel
        sx={{
          marginLeft: '-11px',
          span: {
            fontSize: '14px',
            fontWeight: 400,
            color: toEnabled ? theme.palette.primary.main : theme.palette.grey[600]
          }
        }}
        control={<Checkbox checked={toEnabled} onChange={toggleTo} />}
        label={'To'}
      />

      {toEnabled && (
        <MobileDateTimePicker
          disableFuture
          label={'To (UTC)'}
          onChange={toChanged}
          value={to}
          renderInput={(params) => <TextField {...params} />}
        />
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
  );
};

export default DateRange;
