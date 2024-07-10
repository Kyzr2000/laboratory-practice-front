import { useEffect, useState } from "react";
import { Input, Button, message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import "./css/login.scss";
import { useMutation } from "@apollo/client";
import type { UserLoginReturn, UserLoginInput } from "./type";
import { LOGIN, GET_USERINFO } from "@/apis";

interface LoginFormType {
  username: string;
  password: string;
  code?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [loginInput] = useState<LoginFormType>({
    username: "",
    password: "",
  });

  const [getUserInfo] = useMutation(GET_USERINFO, {
    onCompleted({getUserInfo}) {
      console.log(getUserInfo);
      if (getUserInfo.id) {
        localStorage.setItem('role',getUserInfo.role);
        localStorage.setItem('username',getUserInfo.username);
        navigate("/index");
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
  
  useEffect(() => {
    if (accessToken && accessToken !== "") {
      getUserInfo({
        variables: {
          accessToken,
        },
      });
    }
  },[accessToken,getUserInfo]);
 

  function toRegister() {
    navigate("/register");
  }

  const [executLogin] = useMutation<UserLoginReturn, UserLoginInput>(
    LOGIN,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data.login.accessToken) {
          localStorage.setItem("accessToken", data.login.accessToken);
          localStorage.setItem("refreshToken", data.login.refreshToken);
          getUserInfo({
            variables: {
              accessToken: data.login.accessToken,
            },
          });
        }
      },
      onError(error) {
        message.error(error.message);
      },
    }
  );

  const onFinish = (values: LoginFormType) => {
    const { username, password, code } = values;
    console.log(username + password + code);
    executLogin({
      variables: {
        data: {
          username: username,
          password: password,
        },
      },
    });
  };


  const [form] = Form.useForm<LoginFormType>();
  useEffect(() => {
    form.setFieldsValue(loginInput);
  }, [form, loginInput]);

  return (
    <div className="login-page clearfix">
      <div className="login-card">
        <div className="login-title">登录</div>

        <Form
          className="form-box"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              className="input-bar"
              type="text"
              placeholder="请输入用户名"
            ></Input>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                validator(_, value) {
                  const trimmedValue = value ? value.trim() : "";
                  if (trimmedValue.length < 8) {
                    return Promise.reject(new Error("密码长度不小于8！"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              className="input-bar"
              type="password"
              placeholder="请输入密码"
              
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 16,
            }}
          >
            <Button htmlType="submit" className="login-button">
              登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
            </Button>
          </Form.Item>
          <div className="bottom-link">
            <div className="to-register" onClick={toRegister}>
              注册
            </div>
            <div className="no-password">忘记密码</div>
          </div>
          <div className="bottom-text">
            登录即代表您同意《用户协议》和《隐私协议》
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
