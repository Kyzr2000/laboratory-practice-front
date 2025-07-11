import type { User } from '../user-management/types';

export type Skill = {
  id: string;
  name: string;
  description?: string;
  users: User[];
};

export type SearchSkillInput = {
  skillName: string;
};

export type CreateSkillInput = {
  name: string;
  description?: string;
};

export type UpdateSkillInput = {
  name: string;
  description?: string;
};

export type SkillsQueryResult = {
  skills: Skill[]; // 技能列表
  total: Int; // 总记录数
};
