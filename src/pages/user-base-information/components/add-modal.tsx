import { useMutation } from '@apollo/client';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';

// import { useState } from 'react';
import { CREATE_USER } from '@/apis';
import type { User } from '@/pages/user-base-information/type';

const AddModal: React.FC = () => {
  // const [user, setUser] = useState<User>();
  const [submit] = useMutation(CREATE_USER);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  // 打开模态框时重置表单
  const handleOpenModal = () => {
    form.resetFields(); // 重置表单字段值
    setModalVisible(true);
  };

  // 表单提交
  const handleSubmit = async ({
    userNumber,
    username,
    gender,
    age,
    isEnable,
    departmentId,
  }: User) => {
    await submit({
      variables: {
        data: {
          userNumber,
          username,
          gender,
          age,
          isEnable,
          departmentId,
          id: 99,
        },
      },
    });
    console.log('提交完成');
  };

  return (
    <>

        <Button
          type="default"
          style={{ width: 71, height: 32 }}
          onClick={handleOpenModal}
        >
          新增
        </Button>


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
        width={600}
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
              <Form.Item
                label="账号"
                name="account"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="性别" name="gender">
                <Select>
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="年龄"
                name="age"
                rules={[
                  { required: true, message: '请输入年龄' },
                  { type: 'number', message: '年龄必须是数字' },
                ]}
              >
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
      </Modal>
    </>
  );
};

export default AddModal;
