import { useMutation, useQuery } from '@apollo/client';
import type { CascaderProps } from 'antd';
import {
  Button,
  Form,
  Input,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { CREATE_TEST_DATA, GET_TEST_DATA, GET_TEST_DATA_BY_ACCOUNT } from './gql';
interface AddProps{
    turnOn: (data: any[]) => void;
    turnOff: (data: any[]) => void;
  }
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const AddUser= ({turnOn,turnOff}: any) => {
  const [form] = Form.useForm();
  const [account, setAccount] = useState('');
  const [isVisible, setIsVisible] = useState(false);
    const {data}=useQuery(GET_TEST_DATA_BY_ACCOUNT,
        {variables:{account}});
    const {data:Alldata,refetch}=useQuery(GET_TEST_DATA);
    const [add]=useMutation(CREATE_TEST_DATA);
    const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
        if (!data) {
            add({
                variables:{
                    createTestData:{
                      account:values.account,
                      name:values.name,
                      gender:values.gender,
                      age:Number(values.age),
                      isEnable:values.isEnable
                    }
                }
            });
            alert('新增成功'); 
        } else alert('新增失败,账号被占用'); 
        refetch();
        turnOff();
  };

  useEffect(()=>{
    setIsVisible(turnOn);
  },[turnOn]);

  return ( isVisible && (<Form
    {...formItemLayout}
    form={form}
    name="addNewUser"
    onFinish={onFinish}
    style={{ maxWidth: 600,
        position: 'absolute',
        top: 170,
        left: 650,
        zIndex: 1000,
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '0 0 1000px rgba(0, 0, 0, 0.2)',
    }}
    scrollToFirstError
  >
    <Form.Item
      name="account"
      label="账户"
      rules={[
        {
          required: true,
          message: '请输入账户',
        },
      ]}
    >
      <Input onChange={(e)=>setAccount(e.target.value)} />
    </Form.Item>

    <Form.Item
      name="name"
      label="姓名"
      rules={[{ required: true, message: '请输入姓名!', whitespace: true }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="gender"
      label="性别"
      rules={[
        {
          required: false,
          message: '你的性别是？',
        },
      ]}
      hasFeedback
    >
      <Select placeholder="选择你的性别">
        <Option value="男">男</Option>
        <Option value="女">女</Option>
      </Select>
    </Form.Item>   

    <Form.Item
      name="age"
      label="年龄"
      rules={[{ required: false, message: '请输入你的年龄' }]}
    >
        <Input />
    </Form.Item>

    <Form.Item
      name="isEnable"
      label="是否启用"
      rules={[{ required: false, message: '启用？' }]}
    >
      <Select placeholder="是否启用">
        <Option value={true}>是</Option>
        <Option value={false}>否</Option>
      </Select>
    </Form.Item>

    <Form.Item {...tailFormItemLayout}>
      <Button type="primary" htmlType="submit">
        确认
      </Button>
    </Form.Item>
  </Form>)
   );
};

export default AddUser;