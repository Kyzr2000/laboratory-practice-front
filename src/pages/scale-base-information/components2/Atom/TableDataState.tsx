import { atom } from 'recoil';

import type { PeopleType } from './InterfaceState';

export const TableDataState = atom<PeopleType[]>({
    key: 'TableDataState',
    default: [],
});