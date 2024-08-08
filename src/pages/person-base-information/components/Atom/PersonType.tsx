// import {atom} from 'recoil';

// 定义person数据类型
export interface PersonType {
  id: number;
  account: string;
  name: string;
  gender: string;
  age: number;
  is_enabled: boolean;
}

// 定义修改Person类型
export interface PersonUpdateType {
  account: string;
  newAccount: string;
  newName: string;
  newGender?: string;
  newAge?: number;
  new_is_enabled: boolean;
}

// 定义增加Person类型
export interface PersonCreateType {
  account: string;
  name: string;
  gender?: string;
  age?: number;
  is_enabled: boolean;
}
