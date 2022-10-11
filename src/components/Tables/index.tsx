import {
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableProps,
  TableRow
} from '@mui/material';
import Error from '../Error';
import React, { FC, useMemo } from 'react';
import { TableSkeleton } from './TableSkeleton';
import { Table, TableContainer } from './Table.styled';
import HeaderMobileFilters from './HeaderMobileFilters';

type NormalCell = {
  value: number | string;
  props?: TableCellProps;
  key?: string | number;
};

type JSXCell = {
  value: JSX.Element;
  label: string;
  props?: TableCellProps;
  key?: string | number;
}

export type HeaderCell = NormalCell | JSXCell;

export type BaselineCell = {
  value: number | string | JSX.Element;
  props?: TableCellProps;
  key?: string | number;
};

const isNormalCell = (cell: HeaderCell): cell is NormalCell => typeof cell.value !== 'object';
const getCellLabel = (cell: HeaderCell) =>  isNormalCell(cell) ? cell.value : cell.label;

type Props = {
  loading?: boolean;
  error?: boolean;
  rowsPerPage?: number;
  headers: HeaderCell[];
  rows: BaselineCell[][];
  footer?: JSX.Element | React.ReactNode;
  tableProps?: TableProps;
};

export const BaselineTable: FC<Props> = (props) => {
  const {
    loading,
    error,
    headers,
    rows,
    rowsPerPage = 20,
    footer,
    tableProps = {}
  } = props;
  const memoistHeaders = useMemo(() => {
    return headers.map(({ key, props: p, value }, index) => {
      return (
        <TableCell {...p} key={key || index}>
          {value}
        </TableCell>
      );
    });
  }, [headers]);

  const memoizedRows = useMemo(() => {
    return error ? (
      <TableRow>
        <TableCell colSpan={headers.length}>
          <Error type='data-unavailable' />
        </TableCell>
      </TableRow>
    ) : (
      rows.map((row, index) => (
          <TableRow key={index}>
            {row.map(({ key, props: p, value }, cellIndex) => (
              <TableCell {...p} key={key || cellIndex} data-label={getCellLabel(headers[cellIndex])}>
                {value}
              </TableCell>
            ))}
          </TableRow>
        )
      )
    );
  }, [error, headers, rows]);

  if (loading) return <TableSkeleton rows={rowsPerPage} cells={headers.length} footer />;

  return (
    <TableContainer>
      <HeaderMobileFilters headers={headers} />
      <Table {...tableProps}>
        <TableHead>
          <TableRow>{memoistHeaders}</TableRow>
        </TableHead>
        <TableBody>{memoizedRows}</TableBody>
      </Table>
      {footer}
    </TableContainer>
  );
};

export const HeaderWrapper = (element: JSX.Element | string | number, label: string): HeaderCell => {
  return typeof element === 'string' || typeof element === 'number' ? {
    value: element,
  } : {
    value: element, 
    label
  };
};

export const HeaderCellsWrapper = (elements: ([string, JSX.Element] | string | number)[]) => {
  return elements.map((e) => Array.isArray(e) ? HeaderWrapper(e[1], e[0]) : HeaderWrapper(e, e.toString()));
}

export const BaseLineCellWrapper = (element: JSX.Element | string | number) => {
  return {
    value: element
  };
};

export const BaseLineCellsWrapper = (elements: (JSX.Element | string | number)[]) => {
  return elements.map(BaseLineCellWrapper);
};
