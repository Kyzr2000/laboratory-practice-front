import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { REGISTER_MUTATION } from '@/apis';

// TypeScript 接口定义，用于描述注册用户输入的形状
interface SignupInput {
  username: string;
  realname: string;
  password: string;
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createUser, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      message.success('用户创建成功');
      form.resetFields(); // 重置表单字段
      navigate('/login'); // 注册成功后导航到登录页面
    },
    onError: (error) => {
      message.error(`用户创建失败: ${error.message}`);
    },
  });

  const onFinish = (values: SignupInput) => {
    createUser({
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
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h1
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        注册
      </h1>
      <Form
        name="register-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign="left"
        style={{ width: 300 }}
        form={form}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="realname"
          rules={[{ required: true, message: 'Please input your realname!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入真实姓名"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<UnlockOutlined />}
            placeholder="请输入密码"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ flex: 1, marginRight: '8px' }}
              loading={loading}
            >
              注册
            </Button>
            <Button
              type="primary"
              htmlType="button"
              style={{ flex: 1, marginLeft: '8px' }}
              loading={loading}
              onClick={() => navigate('/login')}
            >
              已有账号去登录
            </Button>
          </div>
        </Form.Item>
      </Form>
      {/* 在合适的位置显示错误信息 */}
      {error && <p style={{ color: 'red' }}>发生错误：{error.message}</p>}
    </div>
  );
};

export default CreateUser;
