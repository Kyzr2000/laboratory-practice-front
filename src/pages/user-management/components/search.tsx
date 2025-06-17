import { Button, Form, Input } from 'antd';
import React from 'react';

import {} from '@/pages/graphql/query';

interface MyComponentProps {
  setusername: React.Dispatch<React.SetStateAction<string | undefined>>;
  setrealname: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Search: React.FC<MyComponentProps> = ({
  setusername,
  setrealname,
}: MyComponentProps) => {
  const [form] = Form.useForm();
  interface Values {
    username?: string;
    realname?: string;
  }
  const onFinish = (values: Values) => {
    setusername(values.username);
    setrealname(values.realname);
  };

  return (
    <Form layout={'inline'} form={form} onFinish={onFinish}>
      <Form.Item label="用户名" name="username">
        <Input
          placeholder="请输入用户名"
          // onChange={(e) => {
          //   setusername(e.target.value);
          // }}
        />
      </Form.Item>
      <Form.Item label="姓名" name="realname">
        <Input
          placeholder="请输入姓名"
          // onChange={(e) => {
          //   setrealname(e.target.value);
          // }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Search;
