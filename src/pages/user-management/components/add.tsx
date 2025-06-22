import './add.less';

import { useMutation, useQuery } from '@apollo/client';
import type { CascaderProps } from 'antd';
import {
  Button,
  Cascader,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import React, { useState } from 'react';

import { AddUser } from '@/pages/graphql/mutations';
import { GetAllUser, GetPageAllUsers } from '@/pages/graphql/query';

// import ChinaRegionCascader from './ChinaRegionCascader';s
// import { GetAllUser } from '@/pages/graphql/query';

const { Option } = Select;

interface DataType {
  username?: string;
  password?: string;
  realname?: string;
  gender?: number | null;
  age?: number | null;
  telephone?: string | null;
  email?: string | null;
  address?: string | null;
  introduction?: string | null;
}

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

interface Currentpage {
  page: number;
  limit: number;
}
interface Values {
  username?: string;
  password?: string;
  realname?: string;
  gender?: number | null;
  age?: number | null;
  telephone?: string | null;
  email?: string | null;
  address?: string | null;
  introduction?: string | null;
  title?: string;
  description?: string;
  modifier?: string;
  unitName?: string;
}

interface MyComponentProps {
  settotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
  setcurrentpage: React.Dispatch<React.SetStateAction<Currentpage>>;
}

const Add: React.FC<MyComponentProps> = ({
  settotal,
  currentpage,
  settableDate,
}: MyComponentProps) => {
  const residences: CascaderProps<DataNodeType>['options'] = [
    {
      value: '浙江',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: '江苏',
      label: '江苏',
      children: [
        {
          value: '南京',
          label: '南京',
          children: [
            {
              value: '中华门',
              label: '中华门',
            },
          ],
        },
      ],
    },
  ];
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

  const { data: datanumber, refetch: refetchnumber } = useQuery(GetAllUser, {
    onCompleted(data) {
      settotal(data.getAllUsers);
    },
    fetchPolicy: 'cache-and-network',
  });
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery(GetPageAllUsers, {
    variables: { data: { page: 1, limit: currentpage.limit } },
    onCompleted(data) {
      settableDate(data.getPageAllUsers);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const [add] = useMutation(AddUser);

  const onCreate = async (values: Values) => {
    await add({
      variables: {
        data: {
          username: values.username,
          password: values.password,
          realname: values.realname,
          gender: values.gender,
          age: values.age,
          telephone: values.telephone,
          email: values.email,
          introduction: values.introduction,
          unitName: values.unitName,
        },
      },
    }).then(() => {
      refetchnumber();
      settotal(datanumber);
      refetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(data.getPageAllUsers);
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        添加用户
      </Button>
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      <Modal
        className="ant-modal"
        open={open}
        title="创建用户"
        okText="确认"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入您的用户名',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入您的密码',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认您的密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不匹配!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: 'email',
              message: '您输入的不是有效邮箱!',
            },
            {
              required: true,
              message: '请输入您的邮箱!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="realname"
          label="姓名"
          tooltip="您的真实姓名"
          rules={[
            {
              required: true,
              message: '请输入您的真实姓名',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="unitName"
          label="单位名称"
          tooltip="您的单位名称"
          rules={[
            {
              required: true,
              message: '请输入您的单位名称',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="住址"
          rules={[
            {
              type: 'array',
              required: true,
              message: '请检查你的住址',
            },
          ]}
        >
          <Cascader options={residences} />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="电话号"
          rules={[{ required: true, message: '请输入您的电话号!' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="age"
          label="年龄"
          rules={[
            {
              required: true,
              message: '请输入您的年龄!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择您的性别!' }]}
        >
          <Select placeholder="请选择您的性别!">
            <Option value={0}>男</Option>
            <Option value={1}>女</Option>
            <Option value={2}>其他</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="introduction"
          label="简介"
          tooltip="introduction yourself"
          rules={[
            {
              message: '简单介绍下你自己',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('请勾选同意')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            我已经阅读了并<a href="">同意</a>
          </Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};

export default Add;
