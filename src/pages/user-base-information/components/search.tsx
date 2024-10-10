import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { isEnableAtom, usernameAtom, userNumberAtom } from './atom/MyUserAtom';

const Search: React.FC = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const setUserNumber = useSetRecoilState(userNumberAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setIsEnable = useSetRecoilState(isEnableAtom);

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = () => {
    const { userNumber, username, isEnable } = form.getFieldsValue();
    console.log(userNumber, username);
    setUserNumber(userNumber);
    setUsername(username);
    setIsEnable(isEnable);
  };

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: false, message: '请输入姓名' }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入姓名"
        />
      </Form.Item>

      <Form.Item name="isEnable" rules={[{ required: false }]}>
        <Select
          placeholder="请选择启用状态"
          options={[
            { value: true, label: '启用' },
            { value: false, label: '禁用' },
          ]}
          allowClear
        ></Select>
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => (
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default Search;
