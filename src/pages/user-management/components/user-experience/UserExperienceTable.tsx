import { Table, Button, message, Modal, Space, Typography } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { type ColumnsType } from 'antd/es/table';

import { useMutation, type ApolloError } from '@apollo/client';

import { DELETE_EXPERIENCE } from '@/pages/experience-management/graphql/experienceGql';
import EditExperienceModal from '@/pages/experience-management/components/EditExperienceModal';
import type { Experience } from '@/pages/experience-management/type';

const { Text } = Typography;
const { confirm } = Modal;

interface ExperienceManagementTableProps {
  experience: Experience[];
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

const UserExperienceManagementTable = ({
  experience,
  loading,
  error,
  refreshData,
  pagination,
  onPaginationChange,
}: ExperienceManagementTableProps) => {
  const [deleteExperience] = useMutation(DELETE_EXPERIENCE);

  const showDeleteConfirm = (record: Experience) => {
    confirm({
      title: `确定要删除经历 "${record.name}" 吗？`,
      icon: <ExclamationCircleFilled />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDelete(record);
      },
    });
  };

  const handleDelete = (record: Experience) => {
    const beforeDeleteCount = experience.length;
    const currentPage = pagination.current;
    const currentPageSize = pagination.pageSize;

    deleteExperience({
      variables: {
        id: record.id,
        userId: parseInt(record.user?.id, 10),
      },

      onCompleted: () => {
        // 如果删除的是当前页最后一条数据且不是第一页，则跳转前一页
        if (beforeDeleteCount === 1 && currentPage > 1) {
          onPaginationChange(currentPage - 1, currentPageSize);
        } else {
          refreshData();
        }
        message.error('删除经历成功');
      },
      onError: (error) => {
        message.error(`删除经历失败: ${error.message}`);
      },
    });
  };

  // 合并地址信息（添加分隔符）
  const formatAddress = (record: Experience) => {
    const parts = [record.province, record.city, record.district, record.detailAddress];

    return parts.join(' / ');
  };

  const columns: ColumnsType<Experience> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '经历名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '起始时间',
      dataIndex: 'startDate',
      align: 'center',
      key: 'startDate',
      width: 90,
      render: (date: string) => date.substring(0, 10), // 修改这里
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      align: 'center',
      key: 'endDate',
      width: 90,
      render: (date: string) => (date ? date.substring(0, 10) : '——'), // 修改这里
    },

    {
      title: '地址',
      key: 'address',
      width: 200,
      render: (_, record) => <span className="address-fs">{formatAddress(record)}</span>,
      align: 'center',
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditExperienceModal experience={record} refreshData={refreshData} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  if (error) {
    return <Text type="danger">加载经历数据失败: {error.message}</Text>;
  }

  return (
    <Table
      columns={columns}
      dataSource={experience.map((exp) => ({ ...exp, key: exp.id }))}
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
      className="user-management-table"
      rowClassName="user-table-row"
      style={{
        // marginTop: 16,
        borderRadius: 8,
      }}
    />
  );
};

export default UserExperienceManagementTable;
