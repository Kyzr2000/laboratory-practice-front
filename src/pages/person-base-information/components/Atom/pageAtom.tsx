import { atom } from 'recoil';

export const currentPageAtom = atom<number>({
  key: 'currentPageAtom',
  default: 1,
});

export const pageSizeAtom = atom<number>({
  key: 'pageSizeAtom',
  default: 10,
});
