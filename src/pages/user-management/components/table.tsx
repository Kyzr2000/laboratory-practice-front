// import { useQuery } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import type { CascaderProps, TableProps } from 'antd';
import {
  Button,
  Cascader,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from 'antd';
import React, { useState } from 'react';

import { DeleteUser, UpdateUser1 } from '@/pages/graphql/mutations';
import {
  GetUserByUsernameOrName,
  GetUserByUsernameOrNameNumber,
} from '@/pages/graphql/query';

// import { GetUserByUsernameOrName } from '@/pages/graphql/query';
const { Option } = Select;
interface DataType {
  id?: number;
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
interface Currentpage {
  page: number;
  limit: number;
}

interface MyComponentProps {
  realname: string | undefined;
  username: string | undefined;
  total: number | undefined;
  settotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  tableDate: DataType[];
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
  setcurrentpage: React.Dispatch<React.SetStateAction<Currentpage>>;
}
interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

interface Values {
  username?: string;
  password?: string;
  realname?: string;
  gender?: number | null;
  age?: number | null;
  telephone?: string | null;
  email?: string | null;
  introduction?: string | null;
  title?: string;
  description?: string;
  modifier?: string;
}

const TableDate: React.FC<MyComponentProps> = ({
  realname,
  username,
  total,
  settotal,
  currentpage,
  setcurrentpage,
  tableDate,
  settableDate,
}: MyComponentProps) => {
  const {
    data: searchdata,
    refetch: searchrefetch,
    loading,
  } = useQuery(GetUserByUsernameOrName, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        username: username || undefined,
        realname: realname || undefined,
      },
    },
    onCompleted(data) {
      settableDate(data.getUserByUsernameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { data: num, refetch: refnum } = useQuery(GetUserByUsernameOrNameNumber, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        username: username || undefined,
        realname: realname || undefined,
      },
    },
    onCompleted(data) {
      settotal(data.getUserByUsernameOrNameNumber);
    },
    // fetchPolicy: "cache-and-network",
  });
  const [deleteUser] = useMutation(DeleteUser);
  // 删除的回调
  const deleteuser = async (username: string | undefined) => {
    await deleteUser({ variables: { data: username } });

    refnum();
    settotal(num);
    searchrefetch({
      variables: { data: { page: currentpage.page, limit: currentpage.limit } },
    });
    settableDate(searchdata.getUserByUsernameOrName);
  };

  // 修改
  // 表单的xuanze
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
  const [form] = Form.useForm();
  const [formusername, setformusername] = useState<string>();
  const [open, setOpen] = useState(false);

  // 表单的电话
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const [updateUser1] = useMutation(UpdateUser1);
  // 更新的回调
  const onUpdata = (values: Values) => {
    updateUser1({
      variables: {
        data: {
          username: formusername,
          gender: values.gender,
          age: values.age,
          telephone: values.telephone,
          email: values.email,
          introduction: values.introduction,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(searchdata.getUserByUsernameOrName);

    setOpen(false);
    refnum();
  };
  //

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },

    {
      title: 'realname',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      title: 'age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'telephone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'introduction',
      dataIndex: 'introduction',
      key: 'introduction',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Sure to Update?"
            onConfirm={() => {
              setOpen(true);
              setformusername(record.username);
            }}
          >
            <Button>Update </Button>
          </Popconfirm>

          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteuser(record.username)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newReversedArray = [...tableDate];
  const data: DataType[] = [...newReversedArray];

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: currentpage.page,
          pageSize: currentpage.limit,
          total: total,
          onChange(page, pageSize) {
            setcurrentpage({ page, limit: pageSize });
          },
        }}
      />
      <Modal
        open={open}
        title="Update a new collection"
        okText="Update"
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
            onFinish={(values) => onUpdata(values)}
          >
            {dom}
          </Form>
        )}
      >
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
      </Modal>
    </>
  );
};

export default TableDate;
