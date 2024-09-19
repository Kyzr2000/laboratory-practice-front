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
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { DELETE_USER, GET_USERS, UPDATE_USER } from '@/apis';

import type { User } from '../type';
import { userAtom, usernameAtom, userNumberAtom, usersAtom } from './atom/MyUserAtom';

const BaseInformationTable: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useRecoilState(usersAtom);
  const [total, setTotal] = useState(1);
  const setUser = useSetRecoilState(userAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(1);

  // 页码控制
  const [currentPage, setCurrentPage] = useState(1);

  // 搜索条件
  const userNumberCondition = useRecoilValue(userNumberAtom);
  const usernameCondition = useRecoilValue(usernameAtom);

  const { loading, error, data } = useQuery(GET_USERS, {
    variables: {
      page: currentPage,
      userNumber: userNumberCondition,
      username: usernameCondition,
    },
  });
  const [deleteUser] = useMutation(DELETE_USER);
  const [updUser] = useMutation(UPDATE_USER);

  const delUser = async ({ id }: User) => {
    console.log('删除执行了');
    console.log(userNumberCondition, usernameCondition);
    if (id) {
      let newId = Number(id);
      await deleteUser({
        variables: {
          id: newId,
        },
        refetchQueries: [
          {
            query: GET_USERS,
            variables: {
              page: currentPage,
              userNumber: userNumberCondition,
              username: usernameCondition,
            },
          },
        ],
      });
    }
  };

  const handleOpenModal = (record: User) => {
    console.log(record.id);
    setUserId(Number(record.id));
    form.resetFields(); // 重置表单字段值
    setModalVisible(true);
    form.setFieldsValue(record);

    setUser(record);
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
      console.log(userId, userNumber, username, gender, age, isEnable, departmentId);
      await updUser({
        variables: {
          id: userId,
          updateUser: {
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
              page: currentPage,
              userNumber: userNumberCondition,
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

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '账号',
      dataIndex: 'userNumber',
      key: 'userNumber',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => <span>{text === 0 ? '女' : '男'}</span>,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '部门',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text) => <a>{text ? '启用' : '禁用'}</a>,
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleOpenModal(record)}
            style={{ backgroundColor: 'green', borderColor: 'green' }}
          >
            编辑
          </Button>
          <Button type="primary" onClick={() => delUser(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (data) {
      setUsers(data.getUsers.users);
      setTotal(data.getUsers.total);
    }
  }, [data, setUsers]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <>
      <Modal
        title="编辑用户信息"
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
              <Form.Item
                label="部门"
                name="departmentId"
                rules={[
                  { required: true, message: '请输入部门ID' },
                  { type: 'number', message: '部门必须是数字' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={users}
        pagination={{
          current: currentPage,
          pageSize: 3,
          total: total,
          onChange: handlePaginationChange,
        }}
      />
    </>
  );
};

export default BaseInformationTable;
