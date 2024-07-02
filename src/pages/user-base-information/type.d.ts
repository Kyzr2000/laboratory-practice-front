//用户
export type User = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  uuid?: string;
  // 用户名
  username?: string;
  // 密码
  password?: string;
  // 真实姓名
  realname?: string;
  // 是否启用
  isEnable?: boolean | null;
  // 是否是管理员用户
  isAdmin?: boolean | null;
  // 性别
  gender?: number | null;
  // 年龄
  age?: number | null;
  // 手机号
  telephone?: string | null;
  // 是否已婚
  marital?: number | null;
  // 邮箱
  email?: string | null;
  // 工号
  job_number?: number | null;
  // 国籍
  nationality?: string | null;
  // 工作年份
  working_year?: number | null;
  // 地址
  address?: string | null;
  // 资质
  qualification?: string | null;
  // 个人介绍
  introduction?: string | null;
  // 名
  firstname?: string | null;
  // 姓
  lastname?: string | null;
  // 角色
  role?: string;
};

export type BaseUserTableData = {
  id: number;
  realname: string;
  username: string;
  gender: string;
  age: number;
  isEnable: boolean;
};

export type UpdateUserData = {
  realname: string | null;
  username: string | null;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
  email: string | null;
  address: string | null;
  introduction: string | null;
  password: string | null;
  role: Role | null;
};

export type UpdateUserInput = {
  data: {
    realname: string | null;
    username: string | null;
    gender: number | null;
    age: number | null;
    isEnable: boolean;
    email: string | null;
    address: string | null;
    introduction: string | null;
    password: string | null;
    role: Role | null;
  };
  userId: number | null;
};

export type UserOperateResponse = {
  updateUser ?: {
    user: User | null;
    message: string;
    result: string;
  };
  delUser ?: {
    user: User | null;
    message: string;
    result: string;
  }
};

export type UserInformationBase = {
  getUserDetail: UpdateUserData
}

export type TableData = {
  userTotalCount: number;
  getUserBaseInformationList: User[];
};

export type QueryData = {
  data: {
    currentPage: number;
    pageNumber: number;
    realname?: string;
    username?: string;
    role?: string;
  };
};

export const Role = {
  ADMIN: 'ADMIN',
  DIRECTIOR: 'DIRECTIOR',
  DOCTOR: 'DOCTOR',
  USER: 'USER',
};
