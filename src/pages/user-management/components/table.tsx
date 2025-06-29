// import { useQuery } from '@apollo/client';
import './table.less';

import { useMutation, useQuery } from '@apollo/client';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react';

import { DeleteUser, UpdateUser1 } from '@/pages/graphql/mutations';
import {
  GetUserByUsernameOrName,
  GetUserByUsernameOrNameNumber,
} from '@/pages/graphql/query';

import AddSkill from './addSkill';

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
  unit?: Unit | null;
  userSkills?: userSkills | null;
  getSkills?: getSkills[];
}
interface userSkills {
  userId: number;
  skillId?: number;
}
interface getSkills {
  id: number;
  name?: string;
  description?: string;
}
interface Unit {
  name?: string;
  id?: number;
  uuid?: string;
  createdAt?: string;
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
  unitName?: string;
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
  const [form] = Form.useForm();
  const [formusername, setformusername] = useState<string>();
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Values>();

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
          unitName: values.unitName,
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
  // 延迟设置表单值确保Form组件已挂载
  useEffect(() => {
    if (open && currentRecord) {
      // 延迟设置表单值确保Form组件已挂载
      setTimeout(() => {
        form.setFieldsValue(currentRecord);
      }, 10);
    }
  }, [open, currentRecord, form]);
  //

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },

    {
      title: '姓名',
      dataIndex: 'realname',
      key: 'realname',
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: '电话号',
      dataIndex: 'telephone',
      key: 'telephone',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      key: 'introduction',
      align: 'center',
    },
    {
      title: '技能',
      align: 'center',
      render: (record) => (
        <Space size="middle">
          <Button
            type="primary"
            variant="outlined"
            color="primary"
            style={{ fontSize: 16 }}
            onClick={() => showModal(record)}
          >
            绑定的技能
          </Button>
        </Space>
      ),
      key: 'userSkills',
    },
    {
      title: '单位',
      render: (_, record) => record.unit?.name || '未关联单位',
      key: 'unit',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            variant="outlined"
            color="primary"
            style={{ width: 85 }}
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setformusername(record.username);
              setCurrentRecord({ ...record, unitName: record.unit?.name });
              // form.setFieldsValue({ ...record});
            }}
          >
            修改
          </Button>

          <Popconfirm
            title="确认删除?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteuser(record.username)}
          >
            <Button style={{ width: 85 }} danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [...tableDate];
  // 技能
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<DataType>();

  const showModal = (record: DataType) => {
    setCurrentRow(record);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        title="技能"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <AddSkill
          currentRow={currentRow}
          currentpage={currentpage}
          username={username}
          realname={realname}
          settableDate={settableDate}
          showModal={showModal}
        />
      </Modal>
      <Modal
        open={open}
        title="更改信息"
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
            initialValues={{ ...currentRecord }}
            clearOnDestroy
            onFinish={(values) => onUpdata(values)}
          >
            {dom}
          </Form>
        )}
      >
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
          name="unitName"
          label="单位名称"
          tooltip="您的单位名称"
          rules={[
            {
              required: true,
              message: '请输入您的单位名称',
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
      </Modal>
    </>
  );
};

export default TableDate;
