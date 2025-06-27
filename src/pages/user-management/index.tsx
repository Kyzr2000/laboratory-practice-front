import { Card } from 'antd';
import { useUserManagement } from './hooks/useUserManagement';
import UserManagementHeader from './components/UserManagementHeader';
import UserManagementTable from './components/UsermanagementTable';
import './userManagement.css';
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
    <Card title="用户管理" className="user-management-card">
      <UserManagementHeader
        onSearch={handleSearch}
        refreshData={refreshData}
        initialValues={searchParams}
      />

      <div style={{ marginTop: 20, flex: 1 }}>
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
