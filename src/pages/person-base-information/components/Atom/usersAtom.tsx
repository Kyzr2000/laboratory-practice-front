import { atom } from 'recoil';

import type { PersonType } from './PersonType';

export const usersAtom = atom<PersonType[]>({
  key: 'usersAtom',
  default: [],
});
