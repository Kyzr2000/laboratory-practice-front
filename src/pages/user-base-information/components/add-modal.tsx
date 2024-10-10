import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

// import { useState } from 'react';
import { CREATE_USER, GET_DEPS, GET_USERS } from '@/apis';
import type { Dep, User } from '@/pages/user-base-information/type';

import { isEnableAtom, pageSizeAtom, usernameAtom } from './atom/MyUserAtom';

const AddModal: React.FC = () => {
  // const [user, setUser] = useState<User>();
  const [createUser] = useMutation(CREATE_USER);
  const { data } = useQuery(GET_DEPS);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  // 搜索条件
  const isEnableCondition = useRecoilValue(isEnableAtom);
  const usernameCondition = useRecoilValue(usernameAtom);

  // 每页显示条数
  const pageSize = useRecoilValue(pageSizeAtom);

  // 递归函数来构建树形结构
  const transformToTreeData = (deps: Dep[]) => {
    console.log(deps);
    return deps.map((dep) => {
      const node = {
        title: dep.name,
        value: dep.id,
        key: dep.id.toString(),
        children: Array(),
      };

      if (dep.children && dep.children.length > 0) {
        node.children = transformToTreeData(dep.children);
      }

      return node;
    });
  };
  const treeData = data ? transformToTreeData(data.getDeps) : [];

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
    try {
      console.log(userNumber, username, gender, age, isEnable, departmentId);
      await createUser({
        variables: {
          createUser: {
            userNumber,
            username,
            gender,
            age,
            isEnable,
            departmentId,
          },
        },
        refetchQueries: [
          {
            query: GET_USERS,
            variables: {
              pageNum: 1,
              pageSize: pageSize,
              isEnable: isEnableCondition,
              username: usernameCondition,
            },
          },
        ],
      });
      setModalVisible(false);
      console.log('提交完成');
    } catch (error) {
      console.log('Failed to create user:', error);
    }
  };

  return (
    <>
      <Button type="default" style={{ width: 71, height: 32 }} onClick={handleOpenModal}>
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
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="账号"
                name="userNumber"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="姓名"
                name="username"
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
                  <Select.Option value={1}>男</Select.Option>
                  <Select.Option value={0}>女</Select.Option>
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
              <Form.Item label="是否启用" name="isEnable">
                <Select>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门" name="departmentId">
                <TreeSelect
                  treeData={treeData}
                  placeholder="请选择部门"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}></Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddModal;
