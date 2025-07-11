import { useState } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import AddExperienceModal from './AddExperienceModal';

import type { SearchExperienceInput } from '@/pages/experience-management/type';
import type { User } from '../../types';

interface ExperienceManagementHeaderProps {
  onSearch: (values: SearchExperienceInput) => void;
  refreshData: () => void;
  initialValues: SearchExperienceInput;
  user: User;
}

const ExperienceManagementHeader = ({
  onSearch,
  refreshData,
  initialValues,
  user,
}: ExperienceManagementHeaderProps) => {
  const [form] = Form.useForm();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (values: SearchExperienceInput) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(
      setTimeout(() => {
        onSearch(values);
      }, 500),
    );
  };

  return (
    <Row gutter={16} align="middle">
      <Col flex="auto">
        <Form
          form={form}
          layout="inline"
          initialValues={initialValues}
          onValuesChange={(_, values) => handleSearch(values)}
        >
          <Form.Item name="name">
            <Input autoComplete="off" placeholder="请输入经历名称" allowClear />
          </Form.Item>

          <Form.Item name="username">
            <Input autoComplete="off" placeholder="请输入用户名" allowClear disabled />
          </Form.Item>
        </Form>
      </Col>

      <Col className="action-buttons">
        <Button icon={<SyncOutlined />} onClick={refreshData} className="refresh-button">
          刷新
        </Button>

        <AddExperienceModal user={user} refreshData={refreshData} />
      </Col>
    </Row>
  );
};
export default ExperienceManagementHeader;
