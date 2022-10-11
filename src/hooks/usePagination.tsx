import React, { useCallback, useMemo, useState } from 'react';
import TablePagination from '../components/Tables/TablePagination';

export type PaginationOptions = {
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
};

type PaginationResult = {
  controls: React.ReactNode,
  count: number;
  page: number;
  paginate: <T,>(items: Array<T>) => Array<T>;
  reset: () => void;
  rowsPerPage: number;
  setCount: (c: number) => void;
  limit: number;
  offset: number;
};

function usePagination(options?: PaginationOptions): PaginationResult {
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.rowsPerPage ?? 20);
  const [page, setPage] = useState(0);

  const onRowsPerPageChange = useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(value));
    setPage(0);
  }, []);

  const reset = useCallback(() => {
    setPage(0);
  }, [])
  
  const onChange = useCallback(
    (_: unknown, number: number) => {
      setPage(number);
    },
    []
  );

  const controls = useMemo(() => count > 0 && (
    <TablePagination
      page={page}
      count={count}
      rowsPerPage={rowsPerPage}
      onPageChange={onChange}
      rowsPerPageOptions={options?.rowsPerPageOptions || [10, 20, 30, 40, 50]}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  ), [onChange, onRowsPerPageChange, page, options?.rowsPerPageOptions, rowsPerPage, count]);

  const paginate = useCallback<PaginationResult['paginate']>(
    (items) => items.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [page, rowsPerPage]
  );
  
  return {
    controls,
    count,
    rowsPerPage,
    page,
    paginate,
    setCount,
    reset,
    limit: rowsPerPage,
    offset: page * rowsPerPage
  };
}

export default usePagination;
