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
      value: 'zhejiang',
      label: 'Zhejiang',
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
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
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
        open={open}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
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
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your Username',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="realname"
          label="Realname"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: 'Please input your realname!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Please select your habitual residence!',
            },
          ]}
        >
          <Cascader options={residences} />
        </Form.Item>

        <Form.Item
          name="telephone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              required: true,
              message: 'Please input your age',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Select placeholder="select your gender">
            <Option value={0}>Male</Option>
            <Option value={1}>Female</Option>
            <Option value={2}>Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="introduction"
          label="Introduction"
          tooltip="introduction yourself"
          rules={[
            {
              message: 'introduction yourself',
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
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};

export default Add;
