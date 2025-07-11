import { Button, message, Modal, Space, Table, Typography } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMutation, type ApolloError } from '@apollo/client';
import type { Unit } from '../types';
import { DELETE_UNIT } from '../graphql/unitGql';
import EditUnitModel from './EditUnit';

const { Text } = Typography;
const { confirm } = Modal;

interface UnitTableProps {
  units: Unit[]; // 明确声明为 Unit[] 而不是 Unit[] | undefined
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

const UnitTable = ({
  units,
  loading,
  error,
  refreshData,
  pagination,
  onPaginationChange,
}: UnitTableProps) => {
  const [deleteUnit] = useMutation(DELETE_UNIT); // 修复变量名，改为 deleteUnit

  const showDeleteConfirm = (unitNumber: string) => {
    // 直接从传入的 units 数组中查找单位信息
    const unit = units.find((u) => u.unitNumber === unitNumber);

    if (!unit) return; // 如果找不到单位，直接返回

    confirm({
      title: `确定要删除单位 ${unit.name} 编号 ${unitNumber} 吗？`,
      icon: <ExclamationCircleFilled />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDelete(unitNumber);
      },
    });
  };

  const handleDelete = (unitNumber: string) => {
    const beforeDeleteCount = units.length;
    const currentPage = pagination.current;
    const currentPageSize = pagination.pageSize;

    deleteUnit({
      variables: { unitNumber },
      onCompleted: () => {
        if (beforeDeleteCount === 1 && currentPage > 1) {
          onPaginationChange(currentPage - 1, currentPageSize);
        } else {
          refreshData();
        }
      },
      onError: (error) => {
        message.error('删除单位失败:' + error.message);
      },
    });
  };

  const columns: ColumnsType<Unit> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: 'center',
      className: 'index-column',
    },
    {
      title: '单位编号',
      dataIndex: 'unitNumber',
      key: 'unitNumber',
      align: 'center',
      width: 120,
      className: 'unitNumber-column',
    },
    {
      title: '单位名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 120,
      className: 'name-column',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      key: 'createdAt',
      width: 130,
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      align: 'center',
      key: 'updatedAt',
      width: 130,
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditUnitModel unit={record} refreshData={refreshData} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.unitNumber)}
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
    return <Text type="danger">加载单位数据失败: {error.message}</Text>;
  }

  return (
    <Table
      columns={columns}
      dataSource={units}
      rowKey="unitNumber" // 使用 unitNumber 作为唯一键
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
      className="unit-management-table"
      rowClassName="unit-table-row"
      style={{
        marginTop: 16,
        borderRadius: 8,
      }}
    />
  );
};

export default UnitTable;
