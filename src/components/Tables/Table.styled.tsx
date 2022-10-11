import { Table as MuiTable, TableContainer as MuiTableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Table = styled(MuiTable)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& thead': {
      display: 'none',
    },
    '& tr': {
      display: 'block',
      border: '1px solid #eee',
      padding: '1em 1em .5em',
      '& + tr': {
        marginTop: '.625em',
      }
    },
    '& td': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      borderBottom: '1px solid #eee',
      fontSize: '.8em',
      lineHeight: '1.35em',

      '&:before': {
        content: 'attr(data-label)',
        fontSize: '.9em',
        textAlign: 'left',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        maxWidth: '45%',
        color: '#545454',
      },

      '& + td': {
        marginTop: '.8em',
      },

      '&:last-child': {
        borderBottom: 0,
      }
    },
  },
  [theme.breakpoints.up('sm')]: {
    '& td:first-child, & th:first-child': {
      paddingLeft: 0
    },
    '& td:last-child, & th:first-child': {
      paddingRight: 0
    },
  }
}));

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  padding: 0,
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    padding: 0
  },
  '.MuiTableHead-root': {
    textTransform: 'uppercase'
  },
  '.MuiTableCell-head': {
    paddingTop: 0
  },
  '.MuiTableCell-body': {
    borderBottom: 'none',
    fontSize: theme.typography.body2.fontSize,
    color: theme.typography.body2.color,
    fontWeight: 400,
    p: {
      // if a <p> in the table cell fix styles
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 400
    }
  }
}));

