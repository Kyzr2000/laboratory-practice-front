export type UserLoginReturn = {
  login: {
    accessToken: string;
    refreshToken: string;
  };
};

export type UserLoginInput = {
  data: {
    username: username;
    password: password;
    code?: code;
  };
};
