import type { WithChildren } from '../../types';
import type { SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';

import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PaperWrap from '../../components/PaperWrap';
import { Box, Tabs, Tab, TabProps, Typography, Stack } from '@mui/material';
import { BN_ZERO } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import ActionSelection from './panels/StakingOptionsPanel';
import ConnectWallet from './panels/ConnectWalletPanel';
import WalletSelection from './panels/WalletSelectionPanel';
import AmountSelection from './panels/AmountPanel';
import APYPanel from './panels/APYPanel';
import FinishPanel from './panels/FinishPanel';
import NavButtons, { NavProps } from './utils/NavButtons';
import useAccounts from '../../hooks/useAccounts';
import { getStakingBalances, StakingBalances } from '../../simple-staking/actions';
import NonStakePanel from './panels/NonStakePanel';
import useApi from '../../hooks/useApi';
import Loading from '../../components/Loading';
import { theme } from '../../theme';
import { KeyringPair } from '@polkadot/keyring/types';

type PanelProps = WithChildren &
  NavProps & {
    currentStep: number;
    step: number;
  };

const Panel: FC<PanelProps> = ({ children, currentStep, step, ...navProps }) => {
  return (
    <Box
      sx={{ flexGrow: 1, width: { xs: '100%' } }}
      role='tabpanel'
      hidden={step !== currentStep}
      id={`vertical-tabpanel-${step}`}
      aria-labelledby={`vertical-tab-${step}`}
    >
      {step === currentStep && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
          {children}
          {step < 5 && <NavButtons {...navProps} />}
        </Box>
      )}
    </Box>
  );
};

const makeTabProps =
  (validSteps: Record<number, boolean>, currentStep: number) =>
  (index: number): TabProps => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
      disabled: currentStep !== index,
      sx:
        currentStep !== index && validSteps[index]
          ? {
              px: { sm: 3, md: 5 },
              borderRight: 0,
              borderColor: theme.palette.primary.main,
              color: `${theme.palette.primary.main} !important`,
              fontWeight: 'normal',
              backgroundColor: 'background.paper'
            }
          : {
              px: { sm: 3, md: 5 },
              backgroundColor: 'grey.100',
              '&.Mui-selected': {
                fontWeight: 'bolder',
                backgroundColor: 'background.paper',
                borderColor: 'grey.200',
                borderWidth: '1px',
                borderStyle: 'solid'
              }
            }
    };
  };

const MAX_STEPS = 6;
export type StakingOptions = '' | 'change' | 'stake' | 'unstake' | 'redeem';

const SimpleStaker = () => {
  const accounts = useAccounts();
  const { api } = useApi();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [injected, setInjected] = useState(false);
  const [selectedStakingOption, setSelectedStakingOption] = useState<StakingOptions>('stake');
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(BN_ZERO);
  const [amountIsValid, setAmountIsValid] = useState(false);
  const [password, setPassword] = useState<string>();
  const [stakingBalances, setStakingBalances] = useState<StakingBalances>();
  const [transaction, setTransaction] =
    useState<Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>>();
  const [blockHash, setBlockHash] = useState<string>();
  const [error, setError] = useState<string>();
  const [executingTransaction, setExecutingTransaction] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const executeScroll = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    executeScroll();
  }, [executeScroll, step]);

  const reset = useCallback(() => {
    setSelectedAccount('');
    setInjected(false);
    setSelectedStakingOption('stake');
    setAmount(BN_ZERO);
    setStep(0);
    setAmountIsValid(false);
    setPassword(undefined);
    setStakingBalances(undefined);
    setTransaction(undefined);
    setError(undefined);
    setBlockHash(undefined);
  }, []);

  useEffect(() => {
    if (api && selectedAccount) {
      getStakingBalances(api, selectedAccount)
        .then((balances) => {
          setStakingBalances(balances);
          setSelectedStakingOption(balances.available.eqn(0) ? (balances.onlyStash ? '' : 'change') : 'stake');
        })
        .catch(() => console.error('[Simple Staker] Unable to Get Staking Balances'));
    }
  }, [api, selectedAccount]);

  useEffect(() => {
    if (selectedAccount && !accounts.allAccounts.includes(selectedAccount)) {
      setSelectedAccount('');
      setInjected(false);
    }
  }, [accounts.allAccounts, selectedAccount]);

  const validSteps = useMemo<Record<number, boolean>>(
    () => ({
      0: true,
      1: accounts.hasAccounts,
      2: !!selectedAccount,
      3: accounts.hasAccounts && !!selectedAccount && !!selectedStakingOption,
      4: amountIsValid,
      5: !!password,
    }),
    [accounts.hasAccounts, amountIsValid, password, selectedAccount, selectedStakingOption]
  );

  const next = useCallback(() => {
    setStep((v) => Math.min(MAX_STEPS - 1, v + 1));
  }, []);

  const back = useCallback(() => {
    setStep((v) => {
      const prev = Math.max(0, v - 1);
      if (prev === 1 || prev === 2) {
        setSelectedStakingOption(stakingBalances?.available.eqn(0) ? (stakingBalances?.onlyStash ? '' : 'change') : 'stake');
        setAmount(BN_ZERO);
        setAmountIsValid(false);
      }
      return prev;
    });
  }, [stakingBalances]);

  const onStepChange = useCallback(
    (evt: React.SyntheticEvent, value: number) => {
      const i = Number(value);
      if (validSteps[i]) {
        setStep(i);
      }
    },
    [validSteps]
  );

  const onSelectedAccount = useCallback(
    (account: string) => {
      setSelectedAccount(account);
      const pair = keyring.getPair(account);
      const { meta: { isInjected } } = pair;
      setInjected(isInjected as boolean);
    },
    [setSelectedAccount, setInjected]
  );

  const signAndFinish = useCallback(async () => {
    next();
    if (transaction) {
      setExecutingTransaction(true);
      try {
        const pair = keyring.getPair(selectedAccount);
        const { meta: { source } } = pair;
        const options: Partial<SignerOptions> = {};
        let pairOrAddress: KeyringPair | string = pair;
        if (!injected) {
          pair.decodePkcs8(password);
        } else {
          const injectedSigner = await web3FromSource(source as string);
          options.signer = injectedSigner.signer;
          pairOrAddress = selectedAccount;
        }
        const tx = await transaction;

        // 1. Sign transaction
        await tx.signAsync(pairOrAddress, options)

        setExecutingTransaction(false);
        setPassword(undefined);

        // 2. Send transaction and follow status
        tx.send(({ status }) => {
          if (status.isInBlock) {
            console.warn(`tx included in ${status.asInBlock}`);
            setBlockHash(status.asInBlock.toString());
          }
        });
      } catch(err) {
        setError((err as string).toString());
        setPassword(undefined);
        setExecutingTransaction(false);
      };
    }
  }, [next, password, injected, selectedAccount, transaction]);

  const panelProps = useCallback(
    (index: number, confirmStep?: boolean): PanelProps => ({
      confirmStep,
      onNext: next,
      canNext: !!validSteps[index + 1],
      onBack: index > 0 ? back : undefined,
      canBack: !!validSteps[index - 1],
      step: index,
      currentStep: step
    }),
    [back, next, step, validSteps]
  );

  const panelPropsSigning = useCallback(
    (index: number, confirmStep?: boolean): PanelProps => ({
      confirmStep,
      onNext: signAndFinish,
      canNext: !!validSteps[index + 1],
      onBack: index > 0 ? back : undefined,
      canBack: !!validSteps[index - 1],
      step: index,
      currentStep: step
    }),
    [back, signAndFinish, step, validSteps]
  );

  const tabProps = useMemo(() => makeTabProps(validSteps, step), [step, validSteps]);

  return (
    <Stack sx={{px: '24px'}}>
      <div ref={scrollRef} />
      <Typography variant='h1' sx={{ pb: 5 }}>
        Simple Staking
      </Typography>
      <PaperWrap sx={{ p: { xs: 0, sm: 0, md: 0 }, overflow: 'hidden' }}>
        <Stack direction='row' sx={{ bgcolor: 'background.paper' }}>
          <Tabs
            orientation='vertical'
            value={step}
            aria-label='Simple Staking Stepper'
            onChange={onStepChange}
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              display: { xs: 'none', sm: 'flex' },
              flex: '0 0 fit-content'
            }}
          >
            <Tab label='Connect Wallet' {...tabProps(0)} />
            <Tab label='Select Wallet' {...tabProps(1)} />
            <Tab label='Staking Options' {...tabProps(2)} />
            {selectedStakingOption === 'redeem' && (
              <Tab label='Redeem' {...tabProps(3)} />
            )}
            {selectedStakingOption === 'change' && (
              <Tab label='Change' {...tabProps(3)} />
            )}
            {(selectedStakingOption !== '' && selectedStakingOption !== 'redeem' && selectedStakingOption !== 'change') && (
              <Tab label='Input Amount' {...tabProps(3)} />
            )}
            {(selectedStakingOption === 'stake' || selectedStakingOption === 'change') && (!stakingBalances?.onlyStash ? (
              <Tab label='Nominate' {...tabProps(4)} />
            ) : (
              <Tab label='APY' {...tabProps(4)} />
            ))}
            {selectedStakingOption !== '' && selectedStakingOption !== 'stake' && selectedStakingOption !== 'change' && (
              <Tab label='Sign and Submit' {...tabProps(4)} />
            )}
            {selectedStakingOption !== '' &&
              <Tab label='Finish' {...tabProps(5)} disabled={step !== 5} />
            }
          </Tabs>
          <Panel {...panelProps(0)}>
            <ConnectWallet />
          </Panel>
          <Panel {...panelProps(1)}>
            <WalletSelection onSelect={onSelectedAccount} selected={selectedAccount} />
          </Panel>
          <Panel {...panelProps(2)}>
            <Loading loading={!stakingBalances}>
              {stakingBalances && (
                <ActionSelection
                  balances={stakingBalances}
                  selected={selectedStakingOption}
                  onSelect={setSelectedStakingOption}
                />
              )}
            </Loading>
          </Panel>
          <Panel {...panelProps(3)}>
            <AmountSelection
              amount={amount}
              balances={stakingBalances}
              option={selectedStakingOption}
              setAmount={setAmount}
              setAmountIsValid={setAmountIsValid}
              setBalances={setStakingBalances}
            />
          </Panel>
          {(selectedStakingOption === 'stake' || selectedStakingOption === 'change') ? (
            <Panel {...panelPropsSigning(4, true)}>
              <APYPanel
                account={selectedAccount}
                injected={injected}
                amount={amount}
                stakingBalances={stakingBalances}
                setTransaction={setTransaction}
                setPassword={setPassword}
              />
            </Panel>
          ) : (
            <Panel {...panelPropsSigning(4, true)}>
              <NonStakePanel
                account={selectedAccount}
                amount={amount}
                injected={injected}
                stakingOption={selectedStakingOption}
                stakingBalances={stakingBalances}
                setTransaction={setTransaction}
                setPassword={setPassword}
              />
            </Panel>
          )}
          <Panel {...panelProps(5)}>
            <FinishPanel
              account={selectedAccount}
              amount={amount}
              error={error}
              loading={executingTransaction}
              option={selectedStakingOption as StakingOptions}
              blockHash={blockHash}
              reset={reset}
            />
          </Panel>
        </Stack>
      </PaperWrap>
    </Stack>
  );
};

export default SimpleStaker;
