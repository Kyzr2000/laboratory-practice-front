import { Table, Button, Modal, Typography, message, Space } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { useMutation, type ApolloError } from '@apollo/client';

import type { Skill } from '../type';
import { DELETE_SKILL } from '../graphql/mutations';
import EditSkillModal from './EditSkillModal';
import UserListModal from './UserListModal';

const { Text } = Typography;
const { confirm } = Modal;

interface SkillManagementTableProps {
  skills: Skill[];
  loading: boolean;
  error: ApolloError | undefined;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  refreshData: () => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const SkillManagementTable = ({
  skills,
  loading,
  error,
  refreshData,
  pagination,
  onPaginationChange,
}: SkillManagementTableProps) => {
  const [deletSkill] = useMutation(DELETE_SKILL);

  const showDeleteConfirm = (skill: Skill) => {
    confirm({
      title: `确定要删除技能 "${skill.name}" 吗？`,
      icon: <ExclamationCircleFilled />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDelete(skill.id);
      },
    });
  };

  const handleDelete = (id: string) => {
    const beforeDeleteCount = skills.length;
    const currentPage = pagination.current;
    const currentPageSize = pagination.pageSize;

    deletSkill({
      variables: { skillId: parseInt(id, 10) },
      onCompleted: () => {
        // 如果删除的是当前页最后一条数据且不是第一页，则跳转前一页
        if (beforeDeleteCount === 1 && currentPage > 1) {
          onPaginationChange(currentPage - 1, currentPageSize);
        } else {
          refreshData();
        }
        message.success('删除用户成功');
      },
      onError: (error) => {
        message.error('删除用户失败:' + error.message);
      },
    });
  };
  const columns: ColumnsType<Skill> = [
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
      title: '技能名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center',
      className: 'skill-name-column',
    },
    {
      title: '技能描述',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <div className="description-column-content">{description || '——'}</div>
      ),
      width: 250,
      align: 'center',
      className: 'description-column',
    },
    {
      title: '绑定的用户',
      key: 'users',
      render: (_, record) =>
        record.users.length > 0 ? (
          <UserListModal refreshData={refreshData} skill={record} />
        ) : (
          '-'
        ),
      width: 100,
      align: 'center',
      className: 'users-column',
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditSkillModal skill={record} refreshData={refreshData} />

          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
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
      dataSource={skills}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        onChange: onPaginationChange,
        onShowSizeChange: onPaginationChange,
        className: 'custom-pagination',
      }}
      scroll={{ x: 'max-content' }}
      className="skill-management-table"
      rowClassName="skill-table-row"
      style={{
        marginTop: 16,
        borderRadius: 8,
      }}
    />
  );
};
export default SkillManagementTable;
