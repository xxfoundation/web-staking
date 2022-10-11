import React, { useCallback, useState } from 'react';
import { bip39Generate, generateSleeve, waitReady } from '@polkadot/wasm-crypto';
import {
  Alert,
  AlertColor,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography
} from '@mui/material';

import PaperStyled from '../PaperWrap';
import useNavOnline from '../../hooks/useNavOnline';

const displayText = (text: string): JSX.Element => <Typography variant='body4'>{text}</Typography>;

interface ElementProps {
  className: AlertColor;
  header: string;
  value: string;
  body?: string;
}

const Element = ({ body, className, header, value }: ElementProps): JSX.Element => (
  <PaperStyled sx={{ margin: '0.5em 0' }}>
    <Stack spacing={2}>
      <Typography variant='h3'>{header}</Typography>
      {body && <Typography variant='body2'>{body}</Typography>}
      <div style={{ display: 'flex', flexFlow: 'wrap' }}>
        {value &&
          value.split(' ').map((elem, index) => {
            return (
              <Alert
                icon={index + 1}
                key={index}
                severity={className}
                sx={{ margin: '0.25em', alignItems: 'center' }}
              >
                {elem}
              </Alert>
            );
          })}
      </div>
    </Stack>
  </PaperStyled>
);

interface Props {
  setMnemonics: (mnemonics: string[]) => void;
  cancel: () => void;
  onFinish: () => void;
}

function Step1 ({ cancel, onFinish, setMnemonics }: Props): React.ReactElement {
  const { isOnline } = useNavOnline();
  const [ackOnlineRisk, setAckOnlineRisk] = useState<boolean>(false);
  const [ackBrowserRisk, setIAckBrowserRisk] = useState<boolean>(false);
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [standardMnemonic, setStandardMnemonic] = useState<string>('');
  const [quantumMnemonic, setQuantumMnemonic] = useState<string>('');
  const isStepValid = !!standardMnemonic && !!quantumMnemonic && isMnemonicSaved;

  const toggleMnemonicSaved = useCallback(
    () => setIsMnemonicSaved(!isMnemonicSaved),
    [isMnemonicSaved]
  );

  const toggleOnlineCheckbox = useCallback(() => setAckOnlineRisk(!ackOnlineRisk), [ackOnlineRisk]);
  const toggleBrowserCheckbox = useCallback(
    () => setIAckBrowserRisk(!ackBrowserRisk),
    [ackBrowserRisk]
  );


  const generateWallet = useCallback(async () => {
    // first wait until the WASM has been loaded (async init)
    await waitReady();

    // generate quantum seed
    const quantum: string = bip39Generate(24);

    // generate standard seed
    const standard = generateSleeve(quantum);

    setQuantumMnemonic(quantum);
    setStandardMnemonic(standard);
    setMnemonics([standard, quantum]);
  }, [setMnemonics]);

  return (
    <Stack sx={{ margin: '1em' }} spacing={2}>
      <Stack direction='row' sx={{ margin: '0.5em 1.25em 0' }} spacing={1.75}>
        {isOnline ? <span>&#128994;</span> : <span>&#128308;</span>}
        <Typography variant='body2' sx={{ alignItems: 'center' }}> 
          You are {isOnline ? 'Online' : 'Offline'}!
        </Typography>
      </Stack>
      <Alert severity='warning'>
        We advise you to turn off your internet connection and bluetooth until the end of the wallet
        generation process. This process runs completely on your browser, which means there is no
        need for internet connectivity. Furthermore, do not proceed if you think your browser might
        be compromised with malicious software.
      </Alert>
      <div style={{ margin: '0.5em' }}>
        <FormControlLabel
          control={<Checkbox checked={ackOnlineRisk} onChange={toggleOnlineCheckbox} />}
          label={
            <Typography variant='body3' sx={{ lineHeight: '1.25' }}>
              I acknowledge that I have turned off internet connectivity, or that I understand the
              risks of remaining connected.
            </Typography>
          }
        />
        <FormControlLabel
          control={<Checkbox checked={ackBrowserRisk} onChange={toggleBrowserCheckbox} />}
          label={
            <Typography variant='body3' sx={{ lineHeight: '1.25' }}>
              I acknowledge that I am accessing this web page through a non compromised browser.
            </Typography>
          }
        />
      </div>
      <Button
        disabled={!ackOnlineRisk || !ackBrowserRisk}
        onClick={generateWallet}
        variant='contained'
      >
        Generate New Wallet
      </Button>
      {quantumMnemonic && (
        <Element
          body='This recovery phrase will only be used when the xx network consensus adopts quantum-secure signatures. Your standard recovery phrase is generated from this one.'
          className='info'
          header='Quantum Mnemonic'
          value={quantumMnemonic}
        />
      )}
      {standardMnemonic && (
        <Element
          body='This recovery phrase is used like any other cryptocurrency recovery phrase. If you lose your wallet or you want to setup a hardware wallet, you can recreate it using this recovery phrase.'
          className='success'
          header='Standard Mnemonic'
          value={standardMnemonic}
        />
      )}
      <div style={{ margin: '2em 1em 1em' }}>
        <Typography variant='body2' sx={{ fontWeight: 'bolder' }}>
          NOT RECOMMENDED
        </Typography>
        <ul style={{ margin: '0' }}>
          <li>{displayText('Taking a screenshot or photo of this information')}</li>
          <li>{displayText('Saving the information in an unencrypted text document')}</li>
          <li>
            {displayText(
              'Sharing this information with any person or application you do not trust with your coins'
            )}
          </li>
        </ul>
        <Typography variant='body2' sx={{ fontWeight: 'bolder', marginTop: '1em' }}>
          RECOMMENDED
        </Typography>
        <ul style={{ margin: '0' }}>
          <li>
            {displayText(
              'Writing down on paper both recovery phrases, with the correct label, and indexes'
            )}
          </li>
          <li>
            {displayText('Keeping this information somewhere that is safe from theft and damage')}
          </li>
          <li>{displayText('Using a hardware wallet')}</li>
        </ul>
      </div>
      {standardMnemonic && quantumMnemonic && (
        <div style={{ textAlign: 'right' }}>
          <FormControlLabel
            control={<Checkbox checked={isMnemonicSaved} onChange={toggleMnemonicSaved} />}
            label={
              <Typography variant='body3' sx={{ lineHeight: '1.25' }}>
                I have saved both my mnemonics safely and named them correctly!
              </Typography>
            }
          />
        </div>
      )}
      <Stack direction='row' justifyContent='space-between'>
        <Button onClick={cancel} variant='outlined'>
          Back
        </Button>
        <Button disabled={!isStepValid} onClick={onFinish} variant='contained'>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

export default Step1;
