export type { Range } from '../../DateRange';

import React, { FC } from 'react';
import { Badge } from '@mui/material';

import Dropdown from '../../Dropdown';
import DateRange, { Props as RangeProps} from '../../DateRange';

const DateRangeFilter: FC<RangeProps & { label?: string }> = (props) => {
  const badgeCount = Object.values(props.value ?? {}).filter((v) => !!v).length;

  return (
   <Dropdown buttonLabel={
      <>
        {props.label ?? 'Time'}
        &nbsp;
        {badgeCount > 0 && <>
          <Badge color='primary' sx={{ pl: 1 }} badgeContent={badgeCount} />
          &nbsp;
        </>
        }
      </>}>
      <DateRange {...props} />
    </Dropdown>
  );
}

export default DateRangeFilter;
