import { Table, Button, Tag, Space, Typography, Modal, message } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { useMutation } from '@apollo/client';
import type { ApolloError } from '@apollo/client';

import { DELETE_USER } from '../graphql/userMutations';
import EditUserModal from './EditUserModal';
import type { User } from '../types';
import UserExperience from './user-experience/UserExperience';
import UserSkillsList from './user-skills/UserSkillsList';

const { Text } = Typography;
const { confirm } = Modal;

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

  const showDeleteConfirm = (username: string) => {
    confirm({
      title: `确定要删除用户 ${username} 吗？`,
      icon: <ExclamationCircleFilled />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDelete(username);
      },
    });
  };

  const handleDelete = (username: string) => {
    const beforeDeleteCount = users.length;
    const currentPage = pagination.current;
    const currentPageSize = pagination.pageSize;

    deleteUser({
      variables: { username },
      onCompleted: () => {
        // 如果删除的是当前页最后一条数据且不是第一页，则跳转前一页
        if (beforeDeleteCount === 1 && currentPage > 1) {
          onPaginationChange(currentPage - 1, currentPageSize);
        } else {
          refreshData();
        }
      },
      onError: (error) => {
        message.error('删除用户失败' + error.message);
      },
    });

    // ------------------------------------------------------
    // 跳转到前一页
    // 获取要删除的用户在当前页数据中的索引
    // const deleteIndex = users.findIndex((user) => user.username === username);
    // const currentPage = pagination.current;
    // const currentPageSize = pagination.pageSize;
    // deleteUser({
    //   variables: { username },
    //   onCompleted: () => {
    //     // 如果删除的是当前页第一条数据且不在第一页，则跳转前一页
    //     if (deleteIndex === 0 && currentPage > 1) {
    //       onPaginationChange(currentPage - 1, currentPageSize);
    //     } else {
    //       refreshData();
    //     }
    //     message.success('删除成功');
    //   },
    //   onError: () => {
    //     message.error('删除用户失败:');
    //   },
    // });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 70,
      align: 'center',
      className: 'index-column',
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      className: 'username-column',
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realname',
      key: 'realname',
      width: 100,
      className: 'realname-column',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 0 ? '男' : '女'),
      width: 70,
      align: 'center',
      className: 'gender-column',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      align: 'center',
      className: 'age-column',
    },
    {
      title: '单位',
      dataIndex: ['unit', 'name'], // 使用路径访问嵌套属性
      key: 'unitName',
      width: 120,
      render: (_, record: User) => <span>{record.unit?.name || '——'}</span>,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (isEnable) => (
        <Tag color={isEnable ? 'success' : 'error'} className="status-tag">
          {isEnable ? '启用' : '禁用'}
        </Tag>
      ),
      width: 100,
      align: 'center',
      className: 'status-column',
    },
    {
      title: '经历',
      key: 'actions',
      align: 'center',
      render: (_, record) => <UserExperience user={record} />,
      className: 'action-column',
      width: 80,
    },
    {
      title: '技能',
      key: 'actions',
      align: 'center',
      render: (_, record) => <UserSkillsList refreshData={refreshData} user={record} />,
      className: 'action-column',
      width: 80,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditUserModal user={record} refreshData={refreshData} />

          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.username)}
            className="delete-button row-button"
          >
            删除
          </Button>
        </Space>
      ),
      className: 'action-column',
      width: 100,
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
        // hideOnSinglePage: true,
        className: 'custom-pagination',
      }}
      scroll={{ x: 'max-content' }}
      className="user-management-table"
      rowClassName="user-table-row"
      style={{
        marginTop: 16,
        borderRadius: 8,
      }}
    />
  );
};

export default UserManagementTable;
