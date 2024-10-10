import { atom } from 'recoil';

import type { User } from '../../type';

export const userAtom = atom<User>({
  key: 'userAtom',
  default: {
    id: -1,
    userNumber: '',
    username: '',
    gender: -1,
    age: -1,
    isEnable: true,
    departmentId: -1,
  },
});

export const usersAtom = atom<User[]>({
  key: 'usersAtom',
  default: [],
});

export const currentAtom = atom<number>({
  key: 'currentAtom',
  default: 1,
});

export const userNumberAtom = atom<string>({
  key: 'userNumberAtom',
  default: '',
});

export const usernameAtom = atom<string>({
  key: 'usernameAtom',
  default: '',
});

export const isEnableAtom = atom<boolean>({
  key: 'isEnableAtom',
  default: undefined,
});

export const pageSizeAtom = atom<number>({
  key: 'pageSizeAtom',
  default: 10,
});
