export type SearchUserInput = {
  username: string;
  realname: string;
};

export type User = {
  username: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
};

export type AddInput = {
  username: string;
  password: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
};

export type ChangeInput = {
  username: string;
  password: string;
  realname: string;
  gender: number | null;
  age: number | null;
  isEnable: boolean;
};
