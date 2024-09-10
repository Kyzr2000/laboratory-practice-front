// triggerRefreshAtom.ts
import { atom } from 'recoil';

// 定义一个用于触发刷新的原子 如添加用户之后触发刷新
export const triggerRefreshAtom = atom<boolean>({
  key: 'triggerRefreshAtom', // 唯一的键
  default: false, // 初始值
});