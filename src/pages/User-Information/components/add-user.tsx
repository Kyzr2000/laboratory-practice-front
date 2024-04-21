import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import type { User } from '../../../interface/USER';
import { ADD_USER } from '../../graphql/mutations';
import { GET_ALL_USERS, GET_USER_ACCOUNT, GET_USER_COUNT } from '../../graphql/query';
import { columnsState, NowPage, tmpUserData, TotalCount } from './user-table';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function AddUser() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState<string | null>();
  const setDataSource = useSetRecoilState(columnsState);
  const setUserCount = useSetRecoilState(TotalCount);
  const pages = useRecoilValue(NowPage);
  const tmpUser = useRecoilValue(tmpUserData);

  const [add] = useMutation(ADD_USER);
  const [getUsers, { data: data1 }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only',
  });
  const [getUserCount, { data: data2 }] = useLazyQuery(GET_USER_COUNT, {
    fetchPolicy: 'no-cache',
  });
  const [getUser, { data: data }] = useLazyQuery(GET_USER_ACCOUNT, {
    fetchPolicy: 'network-only',
  });

  const [form] = useForm();

  const handleButtonClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleFormSubmit = async (values: User) => {
    console.log('正在创建用户');
    console.log(values);
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    console.log(uuid());
    console.log(typeof username);
    getUser({ variables: { username: username } });
    if (data && data.getUserAccount !== null) {
      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      await add({
        variables: {
          createUserInput: {
            username: values.username,
            realname: values.realname,
            gender: values.gender,
            age: Number(values.age),
            isEnable: values.isEnable,
            password: '123456',
            role: 'USER',
            uuid: uuid(),
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        },
      });
      console.log('用户创建成功');
      setVisible(false);
    } else {
      console.log('用户名已经存在', data);
      alert('用户已经存在');
    }
    RefreshPage(); // 等待RefreshPage函数执行完毕
  };

  const RefreshPage = async () => {
    try {
      let pageNumber = pages - 1;
      getUsers({
        variables: {
          pages: pageNumber,
          username: tmpUser[0].username,
          realname: tmpUser[0].realname,
        }
      });
      getUserCount({
        variables: {
          username: tmpUser[0].username,
          realname: tmpUser[0].realname,
        },
      });
      if (data1 && data2) {
        setVisible(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data1 && data2) {
      console.log(data1);
      console.log(data2);
      setDataSource(data1.getAllUsers);
      setUserCount(data2.getAllUserCount);
    }
  }, [data1, data2, setDataSource, setUserCount]);

  return (
    <>
      <Button onClick={handleButtonClick}>新增用户</Button>
      <Modal title="Form" visible={visible} onCancel={handleCancel} footer={null}>
        <Form onFinish={handleFormSubmit} form={form}>
          <Form.Item
            name="username"
            label="账号"
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input
              placeholder="请输入账号"
              onChange={(e) => {
                const username = e.target.value;
                setUsername(username);
              }}
            />
          </Form.Item>
          <Form.Item
            name="realname"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择用户性别!' }]}
          >
            <Select placeholder="请输入用户性别">
              <Select.Option value={1}>男</Select.Option>
              <Select.Option value={2}>女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入用户年龄!' }]}
          >
            <Input placeholder="请输入用户年龄"></Input>
          </Form.Item>
          <Form.Item
            name="isEnable"
            label="是否启用"
            rules={[{ required: true, message: '请选择账号是否启用!' }]}
          >
            <Select placeholder="请选择是否启用该账号">
              <Select.Option value={true}>启用</Select.Option>
              <Select.Option value={false}>不启用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddUser;
