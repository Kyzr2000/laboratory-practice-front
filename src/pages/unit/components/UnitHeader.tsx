import { useState } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import type { FindUnitsInput } from '../types';
import CreateUnitModal from './AddUnit';

interface UnitManagementHeaderProps {
  onSearch: (values: FindUnitsInput) => void;
  refreshData: () => void;
  initialValues: FindUnitsInput;
}

const UnitManagementHeader = ({
  onSearch,
  refreshData,
  initialValues,
}: UnitManagementHeaderProps) => {
  const [form] = Form.useForm();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // 防抖搜索
  const handleSearch = (values: FindUnitsInput) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    setDebounceTimer(
      setTimeout(() => {
        onSearch(values);
      }, 300),
    );
  };

  const handleReset = () => {
    form.setFieldsValue({ unitNumber: '', name: '' });
    onSearch({ unitNumber: '', name: '' });
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
          <Form.Item name="unitNumber">
            <Input autoComplete="off" placeholder="请输入单位编号" allowClear />
          </Form.Item>

          <Form.Item name="name">
            <Input autoComplete="off" placeholder="请输入单位名称" allowClear />
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

        <CreateUnitModal refreshData={refreshData} />
      </Col>
    </Row>
  );
};

export default UnitManagementHeader;
