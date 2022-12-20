// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';

import useIsMountedRef from './useIsMountedRef';

export interface UseAccounts {
  allAccounts: string[];
  areAccountsLoaded: boolean
  hasAccounts: boolean;
  isAccount: (address?: string | null) => boolean;
}

const EMPTY: UseAccounts = { allAccounts: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false };

function extractAccounts (accounts: SubjectInfo = {}): UseAccounts {
  const allAccounts = Object.keys(accounts);
  const hasAccounts = allAccounts.length !== 0;
  const isAccount = (address?: string | null) => !!address && allAccounts.includes(address);

  return { allAccounts, areAccountsLoaded: true, hasAccounts, isAccount };
}

const useAccounts = (): UseAccounts => {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>(EMPTY);

  useEffect((): () => void => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      mountedRef.current && setState(extractAccounts(accounts))
    );

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return state;
}

export default useAccounts;
