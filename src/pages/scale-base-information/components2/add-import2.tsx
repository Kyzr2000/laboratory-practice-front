import { gql, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentAtom, type DataType, pageSizeAtom, selectState } from './atom/UsersManagement';
import { GET_MANAGEMENT } from './table-select';



const CREATE_USER = gql`

  mutation CreateUser($creat:CreateManagementDTO!){
    createUser(createUser:$creat){
    id
    account
    name
    gender
    age
    is_enabled
    }
  }
`;

const AddAndImport2: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const current = useRecoilValue(currentAtom);
  const pageSize = useRecoilValue(pageSizeAtom);

  const [createUser] = useMutation(CREATE_USER);

  const isEnabled = useRecoilValue(selectState);

  const handleSubmit = async ({ account, age, gender, is_enabled, name }: DataType) => {
    const newAge = Number(age);
    if (account) {

      await createUser({
        variables: { creat: { account, name, age: newAge, gender, is_enabled } },
        refetchQueries: [{
          query: GET_MANAGEMENT,
          variables: {
            page: current, pageSize, account: '', isEnabled: isEnabled ===
              'start' ? true : isEnabled === 'end' ? false : undefined,
          }
        }],
      });
    }
    setModalVisible(false);
  };

  return (
    <>
      <Space wrap size="middle" style={{ margin: '20px' }}>
        <Button type="default" style={{ width: 100, height: 40 }}
          onClick={() => setModalVisible(true)}>
          新增
        </Button>
      </Space>

      <Modal
        title="增加用户信息"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            OK
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onFinish={handleSubmit}
          initialValues={{ gender: '男', is_enabled: true }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="账号" name="account" rules={[{ required: true, message: '请输入账号' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="性别" name="gender"
              >
                <Select>
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' },
              { type: 'number', message: '年龄必须是数字' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="是否启用" name="is_enabled">
                <Select>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >
    </>
  );
};

export default AddAndImport2;