import { Box, Container, Divider, Grid, Typography, styled, Button } from '@mui/material';
import React from 'react';
import Socials from './Socials';
import Link from './Link';

import hub from '../assets/images/logos/xx_hub_logotype.svg';

const ListLink = styled(Link)(({ theme }) => ({
  display: 'block',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  color: theme.palette.primary.contrastText,
  fontSize: 14
}));

const StyledButton = styled(Button)(() => ({
  backgroundColor: 'white',
  margin: 'auto',
  padding: '1em 0.75em 0.75em',
  '&:hover': {
    backgroundColor: 'rgb(255,255,255,0.8)',
  }
}));

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'grey.600'
      }}
    >
      <Container
        sx={{
          py: 6,
          px: { xs: 3, md: 6 },
          color: 'text.primary'
        }}
      >
        <Grid container justifyContent='space-between'>
          <Grid item xs={12} md='auto' sx={{ mb: 2 }}>
            {/* <img src={logo} /> */}
            <StyledButton href='https://hub.xx.network'>
              <img src={hub} />
            </StyledButton>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              <Grid item xs>
                <ListLink to='/' underline='hover'>
                  Home
                </ListLink>
                <ListLink to='https://xx.network/mission/' underline='hover' rel='noopener' target='_blank'>
                  Mission
                </ListLink>
                <ListLink
                  to='https://xx.network/resources/'
                  underline='hover'
                  rel='noopener'
                  target='_blank'
                >
                  Resources
                </ListLink>
              </Grid>
              <Grid item xs> 
                <ListLink
                  to='https://xx.network/blockchain'
                  underline='hover'
                  rel='noopener'
                  target='_blank'
                >
                  xx blockchain
                </ListLink>
                <ListLink
                  to='https://xx.network/messenger/'
                  underline='hover'
                  rel='noopener'
                  target='_blank'
                >
                  xx messenger
                </ListLink>
                <ListLink to='https://xx.network/welcome/' underline='hover' rel='noopener' target='_blank'>
                  xx community
                </ListLink>
              </Grid>
              <Grid item xs={12} md='auto'>
                <ListLink to='https://xx.network/whitepapers' underline='hover' rel='noopener' target='_blank'>
                  Whitepapers
                </ListLink>
                <ListLink to='https://xx.network/faq/' underline='hover' rel='noopener' target='_blank'>
                  FAQ
                </ListLink>
                <ListLink to='https://xx.network/contact/' underline='hover' rel='noopener' target='_blank'>
                  Contact Us
                </ListLink>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 3, borderColor: 'grey.400' }} />
        <Grid container justifyContent='space-between' spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant='body4' color='white'>
              xx Network does not distribute, offer, solicit sales of, or sell any xx coins in any
              state or jurisdiction in which such a distribution, offer, solicitation or sale
              would be unlawful prior to registration or qualification under the securities laws
              of any such state or jurisdiction. Copyright © 2022 xx labs SEZC |{' '}
              <Link
                href='https://xx.network/privacy-policy'
                color='inherit'
                rel='noopener'
                target='_blank'
              >
                Privacy Policy & Term of Use
              </Link>
            </Typography>
          </Grid>
          <Grid item padding={'1rem 0'}>
            <Socials
              socials={{
                twitter: 'xx_network',
                github: 'xx-labs',
                telegram: 'xxnetwork',
                discord: 'https://discord.xx.network'
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Footer;
