import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentAtom, pageSizeAtom } from '@/atom/atom';

import { type DataType, selectState } from './atom/UsersManagement';
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

export const GET_UNIT = gql`
  query GetUnit {
    getUnit {
      id
      unit_code
      unit_name
      created_at
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

  const { data, loading, error, refetch } = useQuery(GET_UNIT);


  const handleSubmit = async ({ account, age, gender, is_enabled, name, unitId }: DataType) => {
    const newAge = Number(age);
    if (account) {

      await createUser({
        variables: { creat: { account, name, age: newAge, gender, is_enabled, unit_id: unitId } },
        refetchQueries: [{
          query: GET_MANAGEMENT,
          variables: {
            page: current, pageSize, account: '', isEnabled: isEnabled ===
              'start' ? true : isEnabled === 'end' ? false : undefined,
          }
        }],
      });
    } setModalVisible(false);
    refetch();
  };

  // 打开模态框时重置表单
  const handleOpenModal = () => {
    form.resetFields();  // 重置表单字段值
    setModalVisible(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // 根据数据获取第一个单位的ID，如果数据为空则为undefined
  const initialCompanyId = data.getUnit.length > 0 ? data.getUnit[0].id : undefined;


  return (
    <>
      <Space wrap size="middle" style={{ margin: '20px' }}>
        <Button type="default" style={{ width: 100, height: 40 }}
          onClick={handleOpenModal}>
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
            <Col span={12}>
              <Form.Item label="公司"
                name="unitId"
                rules={[{ required: true, message: '请选择公司' }]}
                initialValue={initialCompanyId}
              >
                <Select>
                  {data?.getUnit.map((item: DataType) => (
                    // 遍历单位数据，为每个单位生成一个选项
                    <Select.Option key={item.id} value={item.id}>{item.unit_name}</Select.Option>
                  ))}
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