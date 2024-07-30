import { atom } from 'recoil';

export const table1 = atom({
  key: 'table1',
  default: 0,
});

// 定义一个新的全局状态来存储搜索结果
export const searchResultsState = atom({
  key: 'searchResultsState',
  default: [],
});
export const table2 = atom({
  key: 'table2',
  default: 0,
});
