import { atom } from 'recoil';

// 定义一个用于触发刷新的原子 每次这个原子改变 触发刷新请求
export const triggerRefreshGlobalAtom = atom<boolean>({
  key: 'triggerRefreshGlobalAtom', // 唯一的键
  default: false, // 初始值
});
