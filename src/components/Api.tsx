import '../augment-types';

import type { WithChildren } from '../types';

import React, { FC, useEffect, useCallback, useMemo, useState } from 'react';
import { keyring } from '@polkadot/ui-keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { objectSpread } from '@polkadot/util';
import { TypeRegistry } from '@polkadot/types/create';
import { Box, Typography } from '@mui/material';

import ApiContext, { ApiContextType } from './ApiContext';
import Error from '../components/Error';
import Loading from '../components/Loading';
import derives from '../custom-derives';

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

function isKeyringLoaded () {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

async function getInjectedAccounts (injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(({ address, meta }, whenCreated): InjectedAccountExt => ({
      address,
      meta: objectSpread({}, meta, {
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated
      })
    }));
  } catch (error) {
    console.error('web3Accounts', error);

    return [];
  }
}

async function load(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<void> {
  const injectedAccounts = await getInjectedAccounts(injectedPromise);
  const accounts = injectedAccounts.map(({ address, meta }) => {
    return {
      address,
      meta: {
        genesisHash: api.genesisHash.toString(),
        name: meta.name,
        source: meta.source,
        whenCreated: meta.whenCreated,
      }
    }
  });
  if (!isKeyringLoaded()) {
    keyring.loadAll({
      genesisHash: api.genesisHash,
      ss58Format: 55
    }, accounts);
  }
}

const registry = new TypeRegistry();

const Api: FC<WithChildren> = ({ children }) => {
  const [error, setApiError] = useState<null | string>(null);
  const [api, setApi] = useState<ApiPromise>();
  const [connected, setConnected] = useState(false);
  const [ready, setIsReady] = useState(false);
  const [generate, setGenerate] = useState(false);

  const onError = useCallback(
    (err: unknown): void => {
      console.error(err);

      setApiError((err as Error).message);
    },
    [setApiError]
  );

  useEffect(() => {
    if (!api) {
      const provider = new WsProvider(process.env.REACT_APP_API_URL);
      setApi(
        new ApiPromise({
          derives,
          provider,
          registry
        })
      );
    }
  }, [api]);

  useEffect(() => {
    if (api) {
      api.on('disconnected', () => setConnected(false));
      api.on('connected', () => setConnected(true));
      api.on('error', onError);
      api.on('ready', () => {
        const injectedPromise = web3Enable('xx network Simple Staking');

        injectedPromise
          .catch(console.error);

        load(api, injectedPromise)
          .catch(onError);

        setIsReady(true);
      });
    }
  }, [api, onError]);

  const context = useMemo<ApiContextType>(
    () => ({
      api,
      connected,
      ready,
      error,
      setGenerate
    }),
    [api, connected, error, ready, setGenerate]
  );

  if (error && !generate) {
    return (
      <Box sx={{ p: 5, py: 10, textAlign: 'center' }}>
        <Error
          variant='body1'
          sx={{ fontSize: 24, pb: 5 }}
          message='Service currently unavailable. Please check your internet connectivity.'
        />
      </Box>
    );
  }

  if (!ready && !generate) {
    return (
      <Box sx={{ p: 5, py: 20 }}>
        <Loading size='md' />
        <Typography variant='body1' sx={{ textAlign: 'center', marginTop: '1em' }}>
          Connecting to the API, please wait.
        </Typography>
      </Box>
    );
  }

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export default Api;
