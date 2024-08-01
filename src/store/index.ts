import { atom } from 'recoil';
const role = localStorage.getItem('role') || '';
const username = localStorage.getItem('username') || '';
console.log('role', role);
console.log('username', username);
export const userType = atom({
  key: 'userType',
  default: role,
});

export const USERNAME = atom({
  key: 'USERNAME',
  default: username,
});

// 用户管理模块
export const usernameState = atom<string>({
  key: 'usernameState',
  default: '',
});

export const isShowState = atom<boolean>({
  key: 'isShowState',
  default: false,
});

export const nicknameState = atom<string>({
  key: 'nicknameState',
  default: '',
});

export const genderState = atom<string>({
  key: 'genderState',
  default: '',
});

export const ageState = atom<number | null>({
  key: 'ageState',
  default: null,
});

export const activateState = atom<boolean>({
  key: 'activateState',
  default: false,
});
