import { useState } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import type { SearchUserInput } from '../types';
import AddUserModal from './AddUserModal';

interface UserManagementHeaderProps {
  onSearch: (values: SearchUserInput) => void;
  refreshData: () => void;
  initialValues: SearchUserInput;
}

const UserManagementHeader = ({
  onSearch,
  refreshData,
  initialValues,
}: UserManagementHeaderProps) => {
  const [form] = Form.useForm();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // 防抖搜索
  const handleSearch = (values: SearchUserInput) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    setDebounceTimer(
      setTimeout(() => {
        onSearch(values);
      }, 300),
    );
  };

  const handleReset = () => {
    form.setFieldsValue({ username: '', realname: '' });
    onSearch({ username: '', realname: '' });
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
          <Form.Item name="username">
            <Input autoComplete="off" placeholder="请输入账号" allowClear />
          </Form.Item>

          <Form.Item name="realname">
            <Input autoComplete="off" placeholder="请输入姓名" allowClear />
          </Form.Item>
        </Form>
      </Col>

      <Col>
        <Button icon={<SyncOutlined />} onClick={refreshData} style={{ marginRight: 8 }}>
          刷新
        </Button>

        <Button type="default" onClick={handleReset} style={{ marginRight: 8 }}>
          重置
        </Button>

        <AddUserModal refreshData={refreshData} />
      </Col>
    </Row>
  );
};

export default UserManagementHeader;
