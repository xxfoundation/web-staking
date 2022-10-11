import {
  AppBar,
  Button,
  Toolbar,
  Link,
  styled,
  Container,
  Typography
} from '@mui/material';
import logo from '../assets/images/logos/xx-network-logo--white.svg';

export const MenuButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 400,
  fontSize: 14,
  color: theme.palette.text.primary,
  '&:hover': {
    background: 'none',
    '&:before': {
      content: '\'\'',
      display: 'block',
      height: 1,
      width: 20,
      background: theme.palette.text.secondary,
      position: 'absolute',
      top: 0,
      left: 6
    }
  }
}));

export const MenuLink = styled(Link)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 400,
  fontSize: 14,
  padding: 9,
  paddingLeft: 24,
  paddingRight: 24,
  display: 'block',
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.text.secondary,
    textDecoration: 'none'
  },
  ':first-child': {
    paddingTop: 14
  },
  ':last-child': {
    paddingBottom: 14
  }
}));

const StyledContainer = styled(AppBar)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  background: theme.gradients?.primary,
}));

const Header = () => (
  <StyledContainer position='static'>
    <Container maxWidth='lg'>
      <Toolbar sx={{ flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between'}}>
        <Link>
          <img src={logo} />
        </Link>
        <Typography variant='h4' sx={{fontWeight: 'bolder'}} >
          Simple Staking
        </Typography>
      </Toolbar>
    </Container>
  </StyledContainer>
)

export default Header;
