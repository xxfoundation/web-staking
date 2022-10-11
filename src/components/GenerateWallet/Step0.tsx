import React from 'react';
import {
  Button,
  Stack,
  Typography
} from '@mui/material';

interface Props {
  onFinish: () => void;
}

function Step0 ({ onFinish }: Props): React.ReactElement {
  return (
    <Stack sx={{ margin: '1em' }} spacing={2}>
      <Stack direction='column' spacing={2}>
        <Typography variant='h3' sx={{ alignItems: 'center' }}>
          Welcome to the Sleeve Wallet Generation Tool
        </Typography>
        <Typography variant='body3'>
          Sleeve is the novel Wallet generation algorithm used by xx network.<br></br>
          With Sleeve, a backup quantum secure Wallet is embedded into a standard non quantum secure Wallet.
        </Typography>
        <Typography variant='body3' sx={{ textAlign: 'justify' }}>
          The uniqueness of Sleeve means that during the Wallet generation procedure two recovery phrases are created:
          <ul>
            <li style={{paddingBottom: '1em'}}>The <b>quantum secure recovery phrase</b>: derives the quantum-secure wallet, which is not currently used, but will be necessary in the future in order to rollover existing non quantum secure wallets into quantum secure wallets.</li>
            <li>The <b>standard recovery phrase</b>: currently used to generate standard non quantum secure Wallets. This phrase can be generated from the quantum secure phrase, so keeping the first one safe will always be of utmost importance.</li>
          </ul>
        </Typography>
      </Stack>
      <Typography variant='body2' sx={{ margin: '1em 0 0' }}>
        To learn more about our quantum-ready wallets:{' '}
        <a className='ml-1' href='https://github.com/xx-labs/sleeve'>
          https://github.com/xx-labs/sleeve
        </a>
      </Typography>
      <div style={{ textAlign: 'end' }}>
        <Button onClick={onFinish} variant='contained'>
          Next
        </Button>
      </div>
    </Stack>
  );
}

export default Step0;
