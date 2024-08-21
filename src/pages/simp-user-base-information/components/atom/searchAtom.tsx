import { atom } from "recoil";

// 定义当前页面的数据 `atom`
export const accountAtom = atom<string>({
    key: 'accountAtom',
    default: '',
  });
  
  // 定义总记录数 `atom`
  export const nameAtom = atom<string>({
    key: 'nameAtom',
    default: '',
  });