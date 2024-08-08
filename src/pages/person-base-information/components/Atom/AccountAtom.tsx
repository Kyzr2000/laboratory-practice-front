import { atom } from 'recoil';

// 定义账号原子，根据账号进行搜索
export const accountAtom = atom<string>({
  key: 'accountAtom',
  default: '',
});

// 定义筛选框原子
export const selectState = atom<string>({
  key: 'selectState',
  default: 'All',
});
