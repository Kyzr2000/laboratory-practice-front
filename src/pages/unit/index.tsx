import Card from 'antd/es/card/Card';

import UnitTable from './components/UnitTable';
import { useUnitManagement } from './hooks/useUnitManagement';
import UnitManagementHeader from './components/UnitHeader';
import './unitManagement.css';
const UnitManagement = () => {
  const {
    units,
    loading,
    error,
    pagination,
    refreshData,
    handlePaginationChange,
    searchParams,
    handleSearch,
  } = useUnitManagement();
  return (
    <Card title="单位管理" className="units-management-card">
      <UnitManagementHeader
        onSearch={handleSearch}
        refreshData={refreshData}
        initialValues={searchParams}
      />
      <UnitTable
        units={units || []}
        loading={loading}
        error={error}
        refreshData={refreshData}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
    </Card>
  );
};
export default UnitManagement;
