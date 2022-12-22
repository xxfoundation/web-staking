import { Button, TextField, styled, Typography, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

const NUM_CONFIRMATIONS = 5;

interface MnemonicGridProps {
  mnemonic: string[];
  indexes: number[];
  onValid: () => void;
  cancel: () => void;
}

const getRandomSet = (array: number[], n: number): number[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};

const MnemonicGrid = ({
  cancel,
  indexes,
  mnemonic,
  onValid
}: MnemonicGridProps): React.ReactElement => {
  const [words, setWords] = useState<string[]>(indexes.map(() => ''));

  const onSetWord = useCallback(
    (index: number) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      const copy = words.slice();
      copy[index] = evt.target.value;
      setWords(copy);
    },
    [words]
  );

  const isValid = useMemo(() => {
    const valid = indexes.every((elem, index) => mnemonic.indexOf(words[index]) === elem);
    return valid && words.length == indexes.length;
  }, [indexes, mnemonic, words]);

  const result = useMemo(
    () => (
      <>
        {indexes.map((idx, index) => {
          return (
            <TextField
              key={idx}
              onChange={onSetWord(index)}
              sx={{ m: 1 }}
              size='small'
              label={`Word #${idx + 1}`}
              variant='outlined'
            />
          );
        })}
      </>
    ),
    [indexes, onSetWord]
  );

  return (
    <>
      {result}
      <Stack direction='row' justifyContent='space-between'>
        <Button onClick={cancel} variant='outlined'>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={onValid} variant='contained'>
          Next
        </Button>
      </Stack>
    </>
  );
};

interface Props {
  mnemonics: string[];
  cancel: () => void;
  onFinish: () => void;
}

function Step2({ cancel, mnemonics, onFinish }: Props): React.ReactElement {
  const [onStage2, setOnStage2] = useState<boolean>(false);
  const standard = mnemonics[0].split(' ').map((elem) => elem);
  const quantum = mnemonics[1].split(' ').map((elem) => elem);
  const [standardIndexes] = useState(
    getRandomSet(Array.from(Array(standard.length).keys()), NUM_CONFIRMATIONS)
  );
  const [quantumIndexes] = useState(
    getRandomSet(Array.from(Array(quantum.length).keys()), NUM_CONFIRMATIONS)
  );

  const onSetReady = useCallback(() => {
    setOnStage2(true);
  }, []);

  return (
    <Stack sx={{ margin: '1em' }} spacing={2}>
      <Typography variant='h2' sx={{fontSize: {xs: '22px', md: '30px'}, textAlign: {xs: 'center', md: 'left'}}}>Confirm Mnemonics</Typography>
      {!onStage2 && (
        <Stack spacing={2}>
          <Typography variant='h3'>
            <b>QUANTUM</b> mnemonic
          </Typography>
          <MnemonicGrid
            cancel={cancel}
            indexes={quantumIndexes}
            mnemonic={quantum}
            onValid={onSetReady}
          />
        </Stack>
      )}
      {onStage2 && (
        <Stack spacing={2}>
          <Typography variant='h3'>
            <b>STANDARD</b> mnemonic
          </Typography>
          <MnemonicGrid
            cancel={cancel}
            indexes={standardIndexes}
            mnemonic={standard}
            onValid={onFinish}
          />
        </Stack>
      )}
    </Stack>
  );
}

export default styled(Step2)`
  .quantum {
    font-size: 20px;
    color: var(--highlight);
  }

  .standard {
    font-size: 20px;
    color: forestgreen;
  }
`;
