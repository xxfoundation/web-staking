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

// const StyledButton = styled(Button)(() => ({
//   backgroundColor: 'white',
//   margin: 'auto',
//   padding: '1em 0.75em 0.75em',
//   '&:hover': {
//     backgroundColor: 'rgb(255,255,255,0.8)',
//   }
// }));

// const AppsMenu = () => {
//   const button = useRef(null);
//   const [opened, { toggle, toggleOff: close }] = useToggle();

//   return (
//     <>
//       <MenuButton
//         sx={{ color: 'white' }}
//         ref={button}
//         id='apps-button'
//         aria-controls={opened ? 'apps-menu' : undefined}
//         aria-haspopup='true'
//         aria-expanded={opened ? 'true' : undefined}
//         onClick={toggle}
//         endIcon={<KeyboardArrowDownIcon />}
//       >
//         Apps
//       </MenuButton>
//       {button.current && (
//         <Menu
//           id='apps-menu'
//           anchorEl={button.current}
//           open={opened}
//           onClose={close}
//           MenuListProps={{
//             'aria-labelledby': 'apps-button'
//           }}
//         >
//           <MenuLink href='https://explorer.xx.network/staking/simple' onClick={close}>
//             Staking
//           </MenuLink>
//           <MenuLink href='https://wallet.xx.network'  onClick={close}>
//             Explorer
//           </MenuLink>
//           <MenuLink href='https://xx.polkassembly.io/' onClick={close}>
//             Governance
//           </MenuLink>
//           <MenuLink href='https://dashboard.xx.network' onClick={close}>
//             Cmix Dashboard
//           </MenuLink>
//           <MenuLink href='https://sleeve.xx.network' onClick={close}>
//             Wallet Generation (Sleeve)
//           </MenuLink>
//         </Menu>
//       )}
//     </>
//   );
// }

// const DocsMenu = () => {
//   const button = useRef(null);
//   const [opened, { toggle, toggleOff: close }] = useToggle();

//   return (
//     <>
//       <MenuButton
//         sx={{ color: 'white' }}
//         ref={button}
//         id='apps-button'
//         aria-controls={opened ? 'docs-menu' : undefined}
//         aria-haspopup='true'
//         aria-expanded={opened ? 'true' : undefined}
//         onClick={toggle}
//         endIcon={<KeyboardArrowDownIcon />}
//       >
//         Docs
//       </MenuButton>
//       {button.current && (
//         <Menu
//           id='docs-menu'
//           anchorEl={button.current}
//           open={opened}
//           onClose={close}
//           MenuListProps={{
//             'aria-labelledby': 'docs-button'
//           }}
//         >
//           <MenuLink href='https://wiki.xx.network/' onClick={close}>
//             Wiki
//           </MenuLink>
//           <MenuLink href='https://blockchainapi.xx.network/' onClick={close}>
//             Blockchain API
//           </MenuLink>
//           <MenuLink href='https://xxdk-dev.xx.network/' onClick={close}>
//             Client API (xxDK)
//           </MenuLink>
//           <MenuLink href='https://dashboard-api.xx.network/v1/docs/' onClick={close}>
//             Cmix Dashboard API
//           </MenuLink>
//         </Menu>
//       )}
//     </>
//   );
// }

const Header = () => (
  <StyledContainer position='static'>
    <Container maxWidth='lg'>
      <Toolbar sx={{ flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between'}}>
        <Link>
          <img src={logo} />
        </Link>
        <Typography variant='h4' sx={{fontWeight: 'bolder'}} >
          Wallet Generation - Sleeve
        </Typography>
        {/* <Stack direction={'row'} spacing={2} sx={{flexWrap: 'wrap', p: { xs: '1em 0 0 1.5em', md: '0', lg: '0' }}}> */}
          {/* <MenuButton href='https://explorer.xx.network/staking/simple' sx={{ color: 'white' }}>
            Staking
          </MenuButton>
          <MenuButton href='https://explorer.xx.network/' sx={{ color: 'white' }}>
            Explorer
          </MenuButton>
          <MenuButton href='https://xx.polkassembly.io/' sx={{ color: 'white' }}>
            Governance
          </MenuButton>
          <MenuButton href='https://wallet.xx.network/' sx={{ color: 'white' }}>
            Wallet
          </MenuButton>
          <MenuButton href='https://dashboard.xx.network' sx={{ color: 'white' }}>
            Cmix
          </MenuButton>
          <DocsMenu /> */}
          {/* <StyledButton href='https://hub.xx.network' variant='contained'>
            <img src={hub} />
          </StyledButton> */}
        {/* </Stack> */}
      </Toolbar>
    </Container>
  </StyledContainer>
)

export default Header;
