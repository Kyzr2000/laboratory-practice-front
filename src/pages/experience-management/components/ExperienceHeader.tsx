import { useState } from 'react';

import { Button, Col, Form, Input, Row } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import AddExperienceModal from './AddExperienceModal';
import type { SearchExperienceInput } from '../type';

interface ExperienceManagementHeaderProps {
  onSearch: (values: SearchExperienceInput) => void;
  refreshData: () => void;
  initialValues: SearchExperienceInput;
}

const ExperienceManagementHeader = ({
  onSearch,
  refreshData,
  initialValues,
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

  const handleReset = () => {
    form.setFieldsValue({
      name: '',
      username: '',
    });
    onSearch({ name: '', username: '' });
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
            <Input autoComplete="off" placeholder="请输入用户名" allowClear />
          </Form.Item>
        </Form>
      </Col>

      <Col className="action-buttons">
        <Button icon={<SyncOutlined />} onClick={refreshData} className="refresh-button">
          刷新
        </Button>

        <Button type="default" onClick={handleReset} className="reset-button">
          重置
        </Button>

        <AddExperienceModal refreshData={refreshData} />
      </Col>
    </Row>
  );
};
export default ExperienceManagementHeader;
