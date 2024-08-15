
import { atom } from 'recoil';

export interface DataType {
    id: number;
    account: string
    name: string;
    gender: string;
    age: number;
    is_enabled: boolean
    unitId: number
    unit_name: string
}

export const userAtom = atom<DataType>({
    key: 'userAtom',
    default: {
        id: -1,
        account: '',
        name: '',
        gender: '',
        age: -1,
        is_enabled: true,
        unitId: -1,
        unit_name: ''
    }
});

export const accountAtom = atom<string>({
    key: 'accountAtom',
    default: ''
});

export const usersAtom = atom<DataType[]>({
    key: 'usersAtom',
    default: []
});

export const selectState = atom<string>({
    key: 'selectState',
    default: 'All'
});

export const currentAtom = atom<number>({
    key: 'currentAtom',
    default: 1
});
export const pageSizeAtom = atom<number>({
    key: 'pageSizeAtom',
    default: 10
});