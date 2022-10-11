import type { HeaderCell } from '.';

import React, { FC, useMemo } from 'react';
import { Button, Box, styled, Stack } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import useToggle from '../../hooks/useToggle';

type Props = {
  headers: HeaderCell[]
} 

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
  display: 'none',
  textAlign: 'right',
}));

const FilterStack = styled(Stack)({
  '& div *': {
    marginTop: '0 !important',
    display: 'none',
  },
  '& div button': {
    display: 'inline'
  },
  paddingBottom: '1rem',
});

const HeaderMobileFilters: FC<Props> = ({ headers }) => {
  const [open, { toggle }] = useToggle();

  const endIcon = useMemo(() => (open ? <FilterAltIcon fontSize='large' /> : <FilterAltOutlinedIcon  fontSize='large' />), [open]);

  const filters = useMemo<JSX.Element[]>(
    () => headers
      .filter(({ value }) => typeof value !== 'string'
        && typeof value !== 'number')
      .map((header) => (header.value as JSX.Element)),
    [headers]
  );
  
  return filters.length > 0 ? (
    <StyledBox>
      <Button onClick={toggle}>
        {endIcon}
      </Button>
      <FilterStack sx={{ pr: 2.5 }}>
        {open && filters.map((filter) => 
          <Box>
            {filter}
          </Box>
        )}
      </FilterStack>
    </StyledBox>
  ) : null;
};

export default HeaderMobileFilters;
