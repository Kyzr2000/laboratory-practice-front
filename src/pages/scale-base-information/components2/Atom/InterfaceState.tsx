import { atom } from 'recoil';
// 定义Options数据类型
export interface OptionItemType {
    value: string,
    label: string
}

// 定义People数据类型
export interface PeopleType {
    id: number;
    account: string;
    name: string;
    gender: string;
    age: number;
    is_enabled: string;
}

// 定义姓名数据类型
export interface NameType {
    text: string;
    value: string;
}

// 定义输入框原子
export const InputState = atom<string>({
    key: 'InputValue',
    default: ''
});

// 定义增加People类型
export interface PeopleAddType {
    account: string;
    name: string;
    gender?: string;
    age?: number;
    is_enabled: string;
}

// 定义修改People类型
export interface PeopleUpdateType {
    account: string;
    newAccount: string;
    newName: string;
    newGender?: string;
    newAge?: number;
    new_is_enabled: string;
}