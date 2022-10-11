import type { Breakpoint } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import useWindowSize from './useWindowSize';

const byBreakpointValue = ([,a]: [string, number], [,b]: [string, number]) => b - a;

const useBreakpoint = (): Breakpoint | undefined => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()
  const { width } = useWindowSize();
  const theme = useTheme();
  const breakpointValues = theme.breakpoints.values;

  useEffect(() => {
    const found = Object.entries(breakpointValues)
      .sort(byBreakpointValue)
      .find(([,bp]) => width && bp < width);

      if (found && found[0] !== breakpoint) {
        setBreakpoint(found[0] as Breakpoint);
      }
  }, [breakpoint, breakpointValues, width]);


  return breakpoint;
}

export default useBreakpoint;
