import { atom } from 'recoil';

// 定义当前页面的数据 `atom`
export const unitCodeAtom = atom<string>({
key: 'unitCodeAtom',
default: '',
});

// 定义总记录数 `atom`
export const unitNameAtom = atom<string>({
key: 'unitNameAtom',
default: '',
});