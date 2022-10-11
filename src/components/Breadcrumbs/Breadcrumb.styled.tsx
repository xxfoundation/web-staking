import { Breadcrumbs } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from '../Link';

export const BreadcrumbStyled = styled(Breadcrumbs)(({ theme }) => ({
  marginBottom: 14,
  'a, svg, li, ol': {
    // target all items
    textTransform: theme.typography.h5.textTransform,
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight
  },
  'ol li:last-child *': {
    // target last item
    fontWeight: theme.typography.h6.fontWeight
  }
}));

export const CustomLink = styled(Link)(({ theme }) => ({
  textDecorationLine: 'none',
  color: theme.palette.grey[500],
  ':hover': {
    color: theme.palette.primary.main,
    textDecorationLine: 'none'
  }
}));
