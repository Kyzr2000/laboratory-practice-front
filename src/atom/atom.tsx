import { atom } from 'recoil';

export const currentAtom = atom<number>({
  key: 'currentAtom',
  default: 1
});
export const pageSizeAtom = atom<number>({
  key: 'pageSizeAtom',
  default: 10
});

export const unitName = atom<string>({
  key: 'unitName',
  default: ''
});