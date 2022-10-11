
import { useContext } from 'react';

import ApiContext from '../components/ApiContext';

const useApi = () => useContext(ApiContext);

export default useApi;
