import { Card } from 'antd';

import './experience.css';
import { useExperienceManagement } from './hooks/useExperience';
import ExperienceManagementTable from './components/ExperienceTable';
import ExperienceManagementHeader from './components/ExperienceHeader';

const ExperienceManagement = () => {
  const {
    experience,
    loading,
    error,
    refreshData,
    pagination,
    handleSearch,
    searchParams,
    handlePaginationChange,
  } = useExperienceManagement();

  return (
    <Card title="经历管理" className="experience-management-card">
      <ExperienceManagementHeader
        onSearch={handleSearch}
        refreshData={refreshData}
        initialValues={searchParams}
      />

      <div style={{ marginTop: 20, flex: 1 }}>
        <ExperienceManagementTable
          experience={experience}
          loading={loading}
          error={error}
          refreshData={refreshData}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onPaginationChange={handlePaginationChange}
        />{' '}
      </div>
    </Card>
  );
};

export default ExperienceManagement;
