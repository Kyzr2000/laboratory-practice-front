import { SearchOutlined } from '@mui/icons-material';
import { Button, Form, Input } from 'antd';
import React from 'react';

import {} from '@/pages/graphql/query';

interface MyComponentProps {
  setname: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Search: React.FC<MyComponentProps> = ({ setname }: MyComponentProps) => {
  const [form] = Form.useForm();
  interface Values {
    name?: string;
  }
  const onFinish = (values: Values) => {
    setname(values.name);
    console.log(values.name);
    console.log(values, form.getFieldValue('name'));
  };

  return (
    <Form layout={'inline'} form={form} onFinish={onFinish}>
      <Form.Item name="name" label="技能名称">
        {/* <Tooltip trigger={['focus']} title={'请输入单位名'} 
        placement="bottomLeft" color={'#08A19F88'}>  */}
        <Input placeholder="请输入技能名称" />
        {/* </Tooltip>  */}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Search;
