import { useState, useCallback, ChangeEvent } from 'react';

type OnChangeType = (e: ChangeEvent<HTMLInputElement>) => void;

const useInput = (initValue = '') => {
  const [value, setValue] = useState(initValue);
  const [touched, setTouched] = useState(false);

  const handler = useCallback<OnChangeType>((e) => {
    setTouched(true);
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue, touched] as [string, OnChangeType, typeof setValue, boolean];
}; 

export default useInput;
