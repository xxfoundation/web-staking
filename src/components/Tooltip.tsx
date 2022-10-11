import { styled, ClickAwayListener, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import React, { FC } from 'react';

import useToggle from '../hooks/useToggle';

export const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500
  }
});

export const ClickableTooltip: FC<TooltipProps> = (props) => {
  const [active, toggle] = useToggle();
  return (
    <ClickAwayListener onClickAway={toggle.toggleOff}>
      <Tooltip
        {...props}
        onClose={(evt) => {
          if (evt.type !== 'touchend') {
            toggle.toggleOff();
          }
        }}
        open={active}
        onClick={toggle.toggle}
        onMouseEnter={toggle.toggleOn}
        arrow
        classes={{ popper: props.className }} />
    </ClickAwayListener>
  )
} 

export const CustomTooltip = styled(ClickableTooltip)({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#4F4F4F',
    padding: '1.25rem',
    fontSize: '0.75rem',
    h5: {
      letterSpacing: '1px',
      textTransform: 'uppercase',
      margin: '0 0 0.5rem'
    },
    p: {
      textTransform: 'capitalize',
      letterSpacing: '8%',
      fontSize: 10,
      fontWeight: 400
    }
  }
});

export default CustomTooltip;
