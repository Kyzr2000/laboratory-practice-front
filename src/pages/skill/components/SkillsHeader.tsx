import { SyncOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useState } from 'react';
import type { SearchSkillInput } from '../type';
import CreateSkillModal from './CreateSkillModal';

interface SkillManagementHeaderProps {
  onSearch: (values: SearchSkillInput) => void;
  refreshData: () => void;
  initialValues: SearchSkillInput;
}
const SkillManagementHeader = ({
  onSearch,
  refreshData,
  initialValues,
}: SkillManagementHeaderProps) => {
  const [form] = Form.useForm();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // 防抖搜索
  const handleSearch = (values: SearchSkillInput) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    setDebounceTimer(
      setTimeout(() => {
        onSearch(values);
      }, 300),
    );
  };

  const handleReset = () => {
    form.setFieldsValue({ skillName: '' });
    onSearch({ skillName: '' });
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
          <Form.Item name="skillName">
            <Input autoComplete="off" placeholder="请输入技能名称" allowClear />
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

        <CreateSkillModal refreshData={refreshData} />
      </Col>
    </Row>
  );
};

export default SkillManagementHeader;
