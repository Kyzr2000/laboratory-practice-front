import { Card } from 'antd';
import { useUserManagement } from './hooks/useUserManagement';
import UserManagementTable from './components/UsermanagementTable';
import UserManagementHeader from './components/UserManagementHeader';

const UserManagement = () => {
  const {
    users,
    loading,
    error,
    pagination,
    handleSearch,
    handlePaginationChange,
    refreshData,
    searchParams,
  } = useUserManagement();

  return (
    <Card
      title="用户管理"
      bordered={false}
      style={{ minHeight: '80vh', position: 'relative' }}
    >
      <UserManagementHeader
        onSearch={handleSearch}
        refreshData={refreshData}
        initialValues={searchParams}
      />

      <div style={{ marginTop: 20 }}>
        <UserManagementTable
          users={users}
          loading={loading}
          error={error}
          refreshData={refreshData}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </Card>
  );
};

export default UserManagement;
