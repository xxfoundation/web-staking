import { AccountRoles, GetDisplayIdentity, GET_DISPLAY_IDENTITY } from '../../../schemas/accounts.schema';
import { useQuery } from '@apollo/client';
import React, { FC } from 'react';
import { BN } from '@polkadot/util';
import _ from 'lodash';

import Address from '../../../components/Hash/XXNetworkAddress';
import Loading from '../../../components/Loading';

type Props = {
  account: string;
  balance?: BN;
  targetBlank?: boolean;
};

const AccountDisplay: FC<Props> = ({ account, balance, targetBlank = false }) => {
  const {data, loading} = useQuery<GetDisplayIdentity>(GET_DISPLAY_IDENTITY, { variables: { account }});
  const display = data?.roles && data?.roles.length && data?.roles[0].account?.identity?.display || undefined;
  const rolesAux = data?.roles && data?.roles[0];
  const roles: Partial<AccountRoles> = _.omit(rolesAux, 'account');
  const loadingQuery = loading;

  return loadingQuery ? (
    <Loading size='xs'/>
  ) : (
    balance ? 
    <Address roles={roles} truncated='mdDown' targetBlank={targetBlank} value={account} name={display} 
        disableUrl={balance.eqn(0)}
        disableAvatar={balance.eqn(0)} />
    : <Address roles={roles}  truncated='mdDown' targetBlank={targetBlank} value={account} name={display} />
  );
};

export default AccountDisplay;