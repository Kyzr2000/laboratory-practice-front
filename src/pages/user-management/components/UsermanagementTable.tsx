import { Table, Button, Tag, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { useMutation } from '@apollo/client';
import type { ApolloError } from '@apollo/client';

import type { User } from '../types';
import { DELETE_USER } from '../api/userMutations';
import EditUserModal from './EditUserModal';

const { Text } = Typography;

interface UserManagementTableProps {
  users: User[];
  loading: boolean;
  error: ApolloError | undefined;
  refreshData: () => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
}

const UserManagementTable = ({
  users,
  loading,
  error,
  refreshData,
  pagination,
  onPaginationChange,
}: UserManagementTableProps) => {
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDelete = (username: string) => {
    deleteUser({
      variables: { username },
      onCompleted: () => {
        refreshData();
      },
      onError: (error) => {
        console.error('删除用户失败:', error.message);
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 0 ? '男' : '女'),
      width: 80,
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (isEnable) => (
        <Tag color={isEnable ? 'success' : 'error'}>{isEnable ? '启用' : '禁用'}</Tag>
      ),
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EditUserModal user={record} refreshData={refreshData} />

          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              if (window.confirm(`确定要删除用户 ${record.username} 吗？`)) {
                handleDelete(record.username);
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return <Text type="danger">加载用户数据失败: {error.message}</Text>;
  }

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="username"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        onChange: onPaginationChange,
        onShowSizeChange: onPaginationChange,
      }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default UserManagementTable;
