import { Divider, TablePagination as MuiTablePagination } from '@mui/material';
import React, { FC } from 'react';
import { theme } from '../../theme';

export const styles = {
  mt: 1,
  '.MuiTablePagination-displayedRows': { fontSize: 14, fontWeight: 500 },
  '.MuiTablePagination-selectLabel': { fontSize: 14, fontWeight: 500 },
  '.MuiTablePagination-select': {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.grey[500]
  },
  '.MuiTablePagination-actions > button': {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.primary.main
  },
  '.MuiTablePagination-actions > button.MuiButtonBase-root.Mui-disabled.MuiIconButton-root.Mui-disabled':
    {
      color: theme.palette.grey[400]
    }
};

const TablePagination: FC<{
  count: number;
  page: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}> = ({
  count,
  page,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  rowsPerPage = 15,
  rowsPerPageOptions = [rowsPerPage]
}) => {
  if (count > rowsPerPage || count > rowsPerPageOptions[0])
    return (
      <>
        <Divider />
        <MuiTablePagination
          sx={styles}
          count={count}
          component={'div'}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange(event);
          }}
          onPageChange={(_event, number) => {
            onPageChange(_event, number);
          }}
          backIconButtonProps={{ size: 'small' }}
          nextIconButtonProps={{ size: 'small' }}
          showFirstButton={true}
          showLastButton={true}
        />
      </>
    );
  return <></>;
};

export default TablePagination;
