import React, { FC } from 'react';
import { TableCell, TableRow, Skeleton } from '@mui/material';

const SkeletonRows: FC<{ rows: number, columns: number }> = (props) => {
  const rows = Array.from(Array(props.rows).keys());
  const cells =  Array.from(Array(props.columns).keys());

  return <>
    {rows.map((row) => (
      <TableRow key={row}>
        {cells.map((cell) => (
          <TableCell key={`${row}-${cell}`}>
            <Skeleton />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
}

export default SkeletonRows;