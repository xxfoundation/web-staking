import base64url from 'base64url';

export const arrayCompare = <T = unknown>(arr1?: Array<T>, arr2?: Array<T>) => {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1?.length !== arr2?.length) {
    return false;
  }
     
  return arr1?.every((item, i) => item === arr2?.[i]);
};

export const makeid = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const shortString = (str: string, offset = 4, replaceStr = '...') =>
  str
    ? str.slice(0, offset + 2).concat(replaceStr, str.slice(str.length - offset, str.length))
    : '';

export const stripNonDigits = <T>(value: T) => typeof value === 'string' ? (value.replace(/\D+/g, '') || '0') : value;

export const nFormatter = (num: number, precision = 0) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];

  const item = lookup.slice().reverse().find((i) =>  num >= i.value);
  const fixed  = item ? (num / item.value).toFixed(precision) : num.toFixed(precision);
  const symbol = item?.symbol ? ` ${item.symbol}` : '';
  return `${fixed}${symbol}`
}

export const toDashboardNodeUrl = (addr: string) => `https://dashboard.xx.network/nodes/${base64url.fromBase64(addr)}`;

export * from './validators';

