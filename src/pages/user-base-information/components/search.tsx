import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { usernameAtom, userNumberAtom } from './atom/MyUserAtom';

const Search: React.FC = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [buttonState, setButtonState] = useState(true);
  const setUserNumber = useSetRecoilState(userNumberAtom);
  const setUsername = useSetRecoilState(usernameAtom);

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = () => {
    const { userNumber, username } = form.getFieldsValue();
    console.log(userNumber, username);
    setUserNumber(userNumber);
    setUsername(username);
  };

  const inputChange = (): void => {
    const { userNumber, username } = form.getFieldsValue();
    if (userNumber !== '' || username !== '') {
      setButtonState(false);
    }
    if (
      (userNumber === '' || userNumber === undefined) &&
      (username === '' || username === undefined)
    ) {
      setButtonState(true);
    }
  };

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item name="userNumber" rules={[{ required: false, message: '请输入账号' }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入账号"
          onChange={inputChange}
        />
      </Form.Item>
      <Form.Item name="username" rules={[{ required: false, message: '请输入姓名' }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入姓名"
          onChange={inputChange}
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button type="primary" htmlType="submit" disabled={buttonState}>
            查询
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default Search;
