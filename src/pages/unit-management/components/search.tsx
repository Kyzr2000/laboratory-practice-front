import { Button, Form, Input } from 'antd';
import React from 'react';

import {} from '@/pages/graphql/query';

interface MyComponentProps {
  setname: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Search: React.FC<MyComponentProps> = ({ setname }: MyComponentProps) => {
  const [form] = Form.useForm();
  interface Values {
    unitname?: string;
  }
  const onFinish = (values: Values) => {
    setname(values.unitname);
    console.log(values.unitname);
    console.log(values, form.getFieldValue('unitname'));
  };

  return (
    <Form layout={'inline'} form={form} onFinish={onFinish}>
      <Form.Item name="unitname">
        {/* <Tooltip trigger={['focus']} title={'请输入单位名'} 
        placement="bottomLeft" color={'#08A19F88'}>  */}
        <Input placeholder="请输入单位名" />
        {/* </Tooltip>  */}
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
