import './Login.scss';

import { useMutation, useQuery } from '@apollo/client';
import {
  LockOpen as LockOpenIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import type { AlertProps } from '@mui/material/Alert';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { userType } from '@/store';

import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/mutations';
import { Departments } from '../graphql/query';
import type { DepartmentData, LoginInput, RegisterInput } from './type';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  const [loginInput, setLoginInput] = useState<LoginInput>({
    username: '',
    password: '',
  });
  const [registerInput, setRegisterInput] = useState<RegisterInput>({
    username: '',
    password: '',
    departmentID: null,
    institutionCode: '',
  });
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { data: departmentData } = useQuery<DepartmentData>(Departments);
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [register, { loading: registerLoading }] = useMutation(SIGNUP_MUTATION);
  const [successOpen, setSuccessOpen] = useState(false);
  const [registerSuccessOpen, setRegisterSuccessOpen] = useState(false);
  const [ErrorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const setUserType = useSetRecoilState(userType);
  // const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (showRegisterForm) {
      setRegisterInput((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setLoginInput((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { data: loginInput },
      });
      // 登录成功的两个token
      if (data) {
        setSuccessOpen(true);
        localStorage.setItem('accessToken', `${data.login.accessToken}`);
        localStorage.setItem('refreshToken', `${data.login.refreshToken}`);
        localStorage.setItem('role', data.login.user.role);
        localStorage.setItem('username', loginInput.username);
        await setUserType(data.login.user.role);
        window.location.href = '/index';
      }
    } catch (error: unknown) {
      setErrorOpen(true);

      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 判断部门和机构码是否匹配
    let departmentIsEnable = false;
    departmentData?.departments.map((item) => {
      if (
        Number(item.id) === registerInput.departmentID &&
        registerInput.institutionCode === item.institutionCode
      )
        departmentIsEnable = true;
    });
    if (departmentIsEnable) {
      try {
        const { data } = await register({
          variables: {
            data: {
              username: registerInput.username,
              password: registerInput.password,
              departmentId: registerInput.departmentID,
            },
          },
        });
        // 这个data是注册成功后返回的两个token
        if (data) {
          console.log(data);
          localStorage.setItem('accessToken', `${data.signup.accessToken}`);
          localStorage.setItem('refreshToken', `${data.signup.refreshToken}`);
          localStorage.setItem('role', 'USER');
          localStorage.setItem('username', registerInput.username);
          await setUserType('USER');
        }
        setSuccessOpen(true);
        setShowRegisterForm(false);
        document.getElementById('my-form')?.classList.remove('register-form');
        document.getElementById('my-form')?.classList.add('login-form');
        setRegisterInput({
          username: '',
          password: '',
          departmentID: null,
          institutionCode: '',
        }); // 清空表单
        setRegisterSuccessOpen(true);
        setTimeout(() => {
          window.location.href = '/index';
        }, 1000);
      } catch (error: unknown) {
        setErrorOpen(true);
        if (error instanceof Error) {
          setErrorMsg(error.message);
        }
      }
    } else {
      setErrorOpen(true);
      setErrorMsg('您的部门和机构码不匹配');
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    document.getElementById('my-form')?.classList.remove('login-form');
    document.getElementById('my-form')?.classList.add('register-form');
  };

  const handleCancelClick = () => {
    setShowRegisterForm(false);
    document.getElementById('my-form')?.classList.remove('register-form');
    document.getElementById('my-form')?.classList.add('login-form');
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setErrorOpen(false);
  };
  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="flex-end"
        className="login-container"
      >
        <Grid item>
          <image className="login-floating" />
        </Grid>
        <Grid item>
          <form
            id="my-form"
            onSubmit={showRegisterForm ? handleRegisterSubmit : handleLoginSubmit}
            className="login-form"
          >
            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <Typography variant="h5" className="login-title">
                多参数心理健康检测仪
              </Typography>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={0}
              >
                <Box mb={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="账号"
                    name="username"
                    value={
                      showRegisterForm ? registerInput.username : loginInput.username
                    }
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Box>
                <Box mb={1}>
                  <TextField
                    inputProps={{ minLength: 8 }}
                    fullWidth
                    size="small"
                    type="password"
                    label="密码"
                    name="password"
                    value={
                      showRegisterForm ? registerInput.password : loginInput.password
                    }
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                  <span className="login-info">
                    <ErrorIcon sx={{ color: 'orange', fontSize: 15 }} />
                    密码至少为8位
                  </span>
                </Box>
              </Grid>

              {!showRegisterForm && (
                <div style={{ marginLeft: 250 }}>
                  <Button color="primary" onClick={handleRegisterClick}>
                    注册新账号
                  </Button>
                </div>
              )}
              {showRegisterForm ? (
                <>
                  <Box mb={1} mt={1}>
                    <Autocomplete
                      onChange={(_event, value) => {
                        console.log(value?.id);
                        if (value?.id === null)
                          setRegisterInput({
                            ...registerInput,
                            departmentID: null,
                          });
                        else
                          setRegisterInput({
                            ...registerInput,
                            departmentID: Number(value?.id),
                          });
                      }}
                      options={departmentData?.departments || []}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label={'部门'}
                          placeholder={'部门'}
                          variant="outlined"
                        />
                      )}
                    />
                  </Box>
                  <Box mb={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="institutionCode"
                      label="机构码"
                      name="institutionCode"
                      value={registerInput.institutionCode}
                      onChange={handleChange}
                      required
                      className="login-input"
                    />
                  </Box>
                  <div>
                    <Grid
                      container
                      justifyContent="space-evenly"
                      alignItems="center"
                      spacing={0}
                    >
                      <Button
                        className="login-button-small"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={registerLoading}
                        startIcon={<PersonAddIcon />}
                      >
                        {registerLoading ? '注册中...' : '注册'}
                      </Button>
                      <Button
                        className="login-button-small"
                        variant="contained"
                        color="secondary"
                        onClick={handleCancelClick}
                      >
                        取消
                      </Button>
                    </Grid>
                  </div>
                </>
              ) : (
                <Button
                  className="login-button"
                  fullWidth
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={loginLoading}
                  startIcon={<LockOpenIcon />}
                >
                  {loginLoading ? '登录中...' : '登录'}
                </Button>
              )}
            </div>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          {registerSuccessOpen ? '注册成功！页面将在一秒后自动跳转' : '登录成功！'}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={ErrorOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
