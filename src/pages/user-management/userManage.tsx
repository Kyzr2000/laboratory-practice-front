import './css/user-management.scss';

import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

import { USER_ADD, USER_DELETE, USER_UPDATE, USERS_QUERY } from '../../apis'; // 确保路径正确

interface User {
  id: string;
  username: string;
  realname: string;
  gender: string;
  age: number;
  isEnable: boolean;
  password: string;
  role: string; // 新增
  isAdmin: boolean; // 新增
}

interface UsersQueryData {
  getAllUsers: {
    users: User[];
    total: number;
  };
}

interface MutationResponse {
  success: boolean;
  message: string;
  user?: User;
}

const UserManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { loading, error, data, refetch } = useQuery<UsersQueryData>(USERS_QUERY);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({ username: '', realname: '' });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [form] = Form.useForm();
  const RoleOptions = {
    ADMIN: 'ADMIN',
    DIRECTOR: 'DIRECTOR',
    DOCTOR: 'DOCTOR',
    USER: 'USER',
  };

  const [addUser] = useMutation<MutationResponse>(USER_ADD, {
    onCompleted: (data) => {
      setIsModalVisible(false);
      message.success(data.message);
      refetch();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateUser] = useMutation<MutationResponse>(USER_UPDATE, {
    onCompleted: (data) => {
      setIsModalVisible(false);
      message.success(data.message);
      refetch();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [deleteUser] = useMutation<MutationResponse>(USER_DELETE, {
    onCompleted: (data) => {
      message.success(data.message);
      refetch();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const newValue = e.target.value;
    setSearch((prev) => ({ ...prev, [type]: newValue }));
  };

  const handleSearch = () => {
    if (!search.username.trim() && !search.realname.trim()) {
      setFilteredUsers(data?.getAllUsers.users || []);
    } else {
      const filtered = data?.getAllUsers.users.filter((user) => {
        return (
          (search.username
            ? user.username.toLowerCase().includes(search.username.toLowerCase())
            : true) &&
          (search.realname
            ? user.realname.toLowerCase().includes(search.realname.toLowerCase())
            : true)
        );
      });
      setFilteredUsers(filtered || []);
    }
  };

  const showModal = (user: User | null = null) => {
    setIsModalVisible(true);
    setIsEditMode(!!user);
    setCurrentUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode && !currentUser?.id) {
          message.error('无法更新用户信息，因为没有选中的用户或用户ID未定义。');
          return;
        }
        if (isEditMode && !values.password) {
          delete values.password;
        }
        const updatedValues = {
          ...values,
          id: isEditMode ? currentUser?.id : undefined,
        };
        if (isEditMode) {
          updateUser({ variables: { updateUserData: updatedValues } });
        } else {
          addUser({ variables: { data: updatedValues } });
        }
      })
      .catch(() => {
        message.error('表单验证失败，请检查输入！');
      });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个用户吗？',
      onOk: () => {
        deleteUser({ variables: { id: parseInt(id, 10) } });
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center', // 添加这一行
      width: 100,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center', // 添加这一行
      width: 100,
    },
    {
      title: '真实姓名',
      dataIndex: 'realname',
      key: 'realname',
      align: 'center', // 添加这一行
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center', // 添加这一行
      width: 100,
      render: (gender) => (gender === 1 ? '男' : '女'),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      align: 'center', // 添加这一行
      width: 100,
    },
    {
      title: '启用状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      align: 'center', // 添加这一行
      width: 100,
      render: (isEnable) => (isEnable ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center', // 添加这一行
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data || !data.getAllUsers) return <p>No data found</p>;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            className="search-input"
            placeholder="根据用户名搜索"
            value={search.username}
            onChange={(e) => handleInputChange(e, 'username')}
          />
        </Col>
        <Col span={6}>
          <Input
            className="search-input"
            placeholder="根据真实姓名搜索"
            value={search.realname}
            onChange={(e) => handleInputChange(e, 'realname')}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={() => handleSearch()} className="search-button">
            搜索
          </Button>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => showModal()}
            className="custom-add-user-btn" // 添加自定义类名
          >
            + 新增用户
          </Button>
        </Col>
      </Row>
      <Table
        className="custom-table"
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredUsers.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
      />
      <Modal
        title={isEditMode ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        // style={{ zIndex: 99999999999999 }}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo);
            message.error('表单验证失败，请检查输入！');
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              // 如果是新增模式，则密码为必填项；如果是编辑模式，则密码为可选项
              { required: !isEditMode, message: '请输入密码!' },
            ]}
          >
            <Input.Password
              placeholder={isEditMode ? '如需修改密码，请输入新密码' : '请输入密码'}
            />
          </Form.Item>
          <Form.Item
            name="realname"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别!' }]}
          >
            <Select>
              <Select.Option value="1">男</Select.Option>
              <Select.Option value="2">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄!', type: 'number' }]}
            normalize={(value) => {
              return parseInt(value, 10);
            }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Select>
              {Object.entries(RoleOptions).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isAdmin" label="是否为管理员" valuePropName="checked">
            <Checkbox>是</Checkbox>
          </Form.Item>
          <Form.Item name="isEnable" label="是否启用" valuePropName="checked">
            <Checkbox>启用</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
