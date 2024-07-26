import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_MUTATION } from '@/apis';

// 定义登录操作的响应类型
interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      // 添加其他需要的用户字段
    };
  };
}

// 定义 Form 表单字段的类型
interface LoginFormFields {
  username: string;
  password: string;
}

const ValidateUser: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormFields>();
  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // 登录成功的操作
      if (data.login) {
        message.success('登录成功');
        form.resetFields();
        // 登录成功后跳转到首页
        navigate('/index');
      }
    },
    onError: (error) => {
      message.error(`登录失败: ${error.message}`);
    },
  });

  const onFinish = (values: LoginFormFields) => {
    login({
      variables: {
        data: values,
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1
        className="login"
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        登录
      </h1>
      <Form
        name="login-form"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign="left"
        style={{ width: 300 }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
          label=""
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          label=""
        >
          <Input.Password prefix={<UnlockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ValidateUser;
