import { atom } from 'recoil';

import type { UnitType } from '../../models/unitType';
export const currentPageAtom = atom<number>({
  key: 'currentPageAtom',
  default: 1,
});

export const pageSizeAtom = atom<number>({
  key: 'pageSizeAtom',
  default: 10,
});

// 定义当前页面的数据 `atom`
export const unitsAtom = atom<UnitType[]>({
    key: 'unitsAtom',
    default: [],
  });

// 定义总记录数 `atom`
export const totalRecordsAtom = atom<number>({
    key: 'totalRecordsAtom',
    default: 0,
  });
  



