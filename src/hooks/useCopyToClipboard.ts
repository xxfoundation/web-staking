import copy from 'copy-to-clipboard';
import { SnackbarMessage, useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';

type CopyResponse = [
  boolean,
  (toCopy: string, callback?: (value: string) => SnackbarMessage) => void,
  string
];

export default function useCopyClipboard(timeout = 1000): CopyResponse {
  const { enqueueSnackbar } = useSnackbar();
  const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const staticCopy = useCallback(
    (text: string, callback?: (value: string) => SnackbarMessage) => {
      const didCopy = copy(text);
      setCopiedText(text);
      setIsCopied(didCopy);
      if (callback) {
        enqueueSnackbar(callback(text));
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => {
        clearTimeout(hide);
      };
    }
    return undefined;
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy, copiedText];
}
