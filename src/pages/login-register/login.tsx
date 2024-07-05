import { useEffect, useState } from "react";
import { Input, Button, message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import './css/login.scss';
import { userStore } from "@/store";
import { useRecoilState } from "recoil";
import { gql, useLazyQuery } from "@apollo/client";
import type { UserLoginReturn, UserLoginInput } from "./type";

interface LoginFormType {
  username: string;
  password: string;
  code?: string;
}

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!, $code: String!) {
    login(username: $username, password: $password, code: $code) {
      res
      message
      user {
        username
      }
    }       
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [, setUserData] = useRecoilState(userStore);
  // const [imageUrl, setImageUrl] = useState("http://localhost:9999/user/code");
  const [loginInput] = useState<LoginFormType>({
    username: "",
    password: "",
  });
  function toRegister() {
    navigate("/register");
  }

  const [executLogin] = useLazyQuery<UserLoginReturn, UserLoginInput>(
    LOGIN_QUERY,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data.login.res === "success") {
          setUserData({
            id: data.login.user.id,
            username: data.login.user.username,
            role: data.login.user.role,
          });
          navigate("/main/about");
        } else {
          message.error(data.login.message);
        }
      },
    }
  );

  const onFinish = (values: LoginFormType) => {
    const { username, password, code } = values;
    console.log(username + password + code);
    executLogin({
      variables: {
        username: username,
        password: password,
        code: code,
      },
    });
  };

  // const resetCode = () => {
  //   // 通过添加时间戳来改变图片的URL，确保每次点击时都会重新请求图片
  //   const newImageUrl = `${imageUrl}?timestamp=${Date.now()}`;
  //   setImageUrl(newImageUrl);
  // };

  const [form] = Form.useForm<LoginFormType>();
  useEffect(() => {
    form.setFieldsValue(loginInput);
  }, [form, loginInput]);

  return (
    <div className="login clearfix">
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
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              className="input-bar"
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          {/* 验证码 */}
          {/* <Row>
            <Col span={16}>
              <Form.Item
                name="code"
                rules={[
                  {
                    // required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input
                  className="input-bar-code"
                  type="text"
                  placeholder="请输入验证码"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <img
                className="code-img"
                src={imageUrl}
                alt=""
                onClick={resetCode}
              />
            </Col>
          </Row> */}

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
