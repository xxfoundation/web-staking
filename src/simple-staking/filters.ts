import { ElectedWithReturn } from './selection';

export const COMMISSION_FILTER = Number(process.env.REACT_APP_COMMISSION_FILTER ?? '100');
export const FILTER_STATIC_LIST_URL = process.env.REACT_APP_FILTER_STATIC_LIST_URL ?? '';

export const fetchStaticList = async (): Promise<string[]> => {
  if (!FILTER_STATIC_LIST_URL) {
    return [];
  }
  try {
    const response = await fetch(FILTER_STATIC_LIST_URL);
    const text = await response.text();
    return text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  } catch (error) {
    console.error(`Error fetching static list: ${error}`);
    return [];
  }
}

export type ValidatorFilter = (validator: ElectedWithReturn) => boolean;
export const validatorFilterExcludedList = (list: string[]): ValidatorFilter => (validator: ElectedWithReturn) => !list.includes(validator.validatorId);

export const validatorFilterAllowedList = (list: string[]): ValidatorFilter => (validator: ElectedWithReturn) => list.includes(validator.validatorId);
