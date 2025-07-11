import { Card } from 'antd';
import { useSkillsManagement } from './hooks/useSkillsManagement';
import SkillManagementTable from './components/SkillsTable';

import './skillManagement.css';
import SkillManagementHeader from './components/SkillsHeader';

const SkillManagement = () => {
  const {
    skills,
    loading,
    error,
    pagination,
    handleSearch,
    handlePaginationChange,
    refreshData,
    searchParams,
  } = useSkillsManagement();

  return (
    <Card title="技能管理" className="skill-management-card">
      <SkillManagementHeader
        onSearch={handleSearch}
        refreshData={refreshData}
        initialValues={searchParams}
      />

      <div style={{ marginTop: 20, flex: 1 }}>
        <SkillManagementTable
          skills={skills}
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

export default SkillManagement;
