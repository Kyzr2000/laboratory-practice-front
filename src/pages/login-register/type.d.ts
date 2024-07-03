export type UserLoginReturn = {
  login: {
    res: string;
    message: string;
    user: {
      id: null;
      username: string;
      role: string;
    };
  };
};

export type UserLoginInput = {
  username: username;
  password: password;
  code?: code;
};
