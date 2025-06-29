import { SearchOutlined } from '@mui/icons-material';
import { Button, Form, Input } from 'antd';
import React from 'react';

import {} from '@/pages/graphql/query';

interface MyComponentProps {
  setplaceName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Search: React.FC<MyComponentProps> = ({ setplaceName }: MyComponentProps) => {
  const [form] = Form.useForm();
  interface Values {
    placeName?: string;
  }
  const onFinish = (values: Values) => {
    setplaceName(values.placeName);
    console.log(values.placeName);
    console.log(values, form.getFieldValue('unitname'));
  };

  return (
    <Form layout={'inline'} form={form} onFinish={onFinish}>
      <Form.Item name="placeName" label="工作地点">
        {/* <Tooltip trigger={['focus']} title={'请输入单位名'} 
        placement="bottomLeft" color={'#08A19F88'}>  */}
        <Input placeholder="请输入工作地点" />
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
