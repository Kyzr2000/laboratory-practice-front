import { useState } from 'react';
import { Button, Card, Modal } from 'antd';

import { useExperienceManagement } from '@/pages/experience-management/hooks/useExperience';
import UserExperienceManagementTable from './UserExperienceTable';
import ExperienceManagementHeader from './ExperienceHeader';
import type { User } from '../../types';
import './user-experience.css';
import { LinkOutlined } from '@ant-design/icons';

interface UserExperienceProps {
  user: User;
}

const UserExperience = ({ user }: UserExperienceProps) => {
  const {
    experience,
    loading,
    error,
    refreshData,
    pagination,
    handleSearch,
    handlePaginationChange,
    searchParams,
  } = useExperienceManagement();
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    handleSearch({
      name: '',
      username: user.username,
    });
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);
  return (
    <>
      <Button
        type="link"
        icon={<LinkOutlined />}
        onClick={showModal}
        disabled={loading}
        className="row-button"
      >
        经历
      </Button>
      <Modal
        open={visible}
        onCancel={handleCancel}
        destroyOnHidden
        width="900px"
        footer={null}
      >
        <Card className="user-experience-card">
          <ExperienceManagementHeader
            onSearch={handleSearch}
            refreshData={refreshData}
            initialValues={searchParams}
            user={user}
          />

          <div style={{ marginTop: 15.4, flex: 1 }} className="user-experience-model">
            <UserExperienceManagementTable
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
      </Modal>
    </>
  );
};

export default UserExperience;
