import { atom } from 'recoil';

import type { SimpUserType } from '../../models/simpUserType';

export const currentPageAtom = atom<number>({
  key: 'currentPageAtom',
  default: 1,
});

export const pageSizeAtom = atom<number>({
  key: 'pageSizeAtom',
  default: 10,
});

// 定义当前页面的数据 `atom`
export const simpUsersAtom = atom<SimpUserType[]>({
  key: 'simpUsersAtom',
  default: [],
});

// 定义总记录数 `atom`
export const totalRecordsAtom = atom<number>({
  key: 'totalRecordsAtom',
  default: 0,
});

