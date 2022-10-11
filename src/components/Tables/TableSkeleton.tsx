import { Skeleton } from '@mui/material';
import React, { FC, useMemo } from 'react';

import { BaselineTable, HeaderCell } from '.';

const genSkeletons = (count: number) => {
  return Array.from(Array(count).keys()).map(() => {
    return Skeleton;
  });
};

export const TableSkeleton: FC<{
  rows: number;
  cells: number;
  footer?: boolean;
  header?: boolean;
}> = ({ cells, footer, rows }) => {
  const loadingCells = useMemo<HeaderCell[]>(
    () => genSkeletons(cells).map((Cell, index) =>  ({ label: '', value:  <Cell key={index} /> })),
    [cells]
  );
  const loadingRows = useMemo(
    () => genSkeletons(rows).map(() => loadingCells),
    [loadingCells, rows]
  );
  const footerEl = useMemo(() => (footer ? <Skeleton /> : undefined), [footer]);

  return <BaselineTable headers={loadingCells} rows={loadingRows} footer={footerEl} />;
};
