import type { Experience } from '../experience-management/type';
import type { Skill } from '../skill/type';
import type { Unit } from '../unit/types';

export type SearchUserInput = {
  username: string;
  realname: string;
};

export type User = {
  id: string;
  username: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
  unit: Unit;
  experience: Experience[];
  skills: Skill[];
};

export type AddUserInput = {
  username: string;
  password: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
  unitNumber: String | null;
};

export type ChangeUserInput = {
  oldUsername: string;
  username: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
  unit?: {
    unitNumber: string;
    name: string; // 单位名称
  } | null;
};
