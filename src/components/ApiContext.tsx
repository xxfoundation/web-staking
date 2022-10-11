import type { ApiPromise } from '@polkadot/api';

import React from 'react';

export type ApiContextType = {
  api: ApiPromise | undefined;
  connected: boolean;
  ready: boolean;
  error: string | null;
  setGenerate: (generate: boolean) => void;
};

const ApiContext: React.Context<ApiContextType> = React.createContext(
  {} as unknown as ApiContextType
);
const ApiConsumer: React.Consumer<ApiContextType> = ApiContext.Consumer;
const ApiProvider: React.Provider<ApiContextType> = ApiContext.Provider;

export default ApiContext;

export { ApiConsumer, ApiProvider };
