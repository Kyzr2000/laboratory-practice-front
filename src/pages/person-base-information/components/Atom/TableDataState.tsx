import { atom } from 'recoil';

import type { PersonType } from './PersonType';

export const TableDataState = atom<PersonType[]>({
  key: 'TableDataState',
  default: [],
});
