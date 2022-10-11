import React from 'react';
import { Container } from '@mui/material';
import Breadcrumb from '../../components/Breadcrumbs';
import SimpleStaker from './SimpleStaker';
import Api from '../../components/Api';

const Staking: React.FC = () => (
  <Container sx={{ my: 5 }}>
    <Breadcrumb />
    <Api>
      <SimpleStaker />
    </Api>
  </Container>
);

export default Staking;
