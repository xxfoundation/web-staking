import type { Props as HashProps } from './index';

import React from 'react';
import Hash from './index';
import { toDashboardNodeUrl } from '../../utils';

type Props = HashProps

const CmixAddress: React.FC<Props> = (props) => {
  if (!props.value) {return (<>N/A</>)}
  return (<Hash {...props} url={toDashboardNodeUrl(props.value)} />)
};

export default CmixAddress;
