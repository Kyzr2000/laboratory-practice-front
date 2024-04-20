import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import type { User } from '../../../interface/USER';
import { UpdateUser } from '../../graphql/mutations';
import { GET_ALL_USERS, GET_USER_ACCOUNT } from '../../graphql/query';
import { columnsState, NowPage, tmpUserData } from './user-table';

function UpdateUserButton(user: User) {
  const [username] = useState(user.username);
  const setDataSource = useSetRecoilState(columnsState);
  const pages = useRecoilValue(NowPage);
  const tmpUser = useRecoilValue(tmpUserData);
  const { data } = useQuery(GET_USER_ACCOUNT, {
    skip: !username,
    variables: { username: username },
    fetchPolicy: 'network-only',
  });
  const [getUsers, { data: data1 }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only',
  });
  const [update] = useMutation(UpdateUser);

  const OnClicked = () => {
    setVisible(true);
  };

  const [visible, setVisible] = useState(false);
  const handleFormSubmmitClicked = async (values: User) => {
    console.log(values);
    const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
    if (data.getUsername !== null) {
      console.log(timeStamp);
      await update({
        variables: {
          username: username,
          data: {
            realname: String(values.realname),
            age: Number(values.age),
            isEnable: values.isEnable,
            gender: values.gender,
            updatedAt: timeStamp,
          },
        },
      });
      await RefreshPages();
      setVisible(false);
    }
  };

  setDataSource;

  const RefreshPages = async () => {
    try {
      let pageNumber = pages - 1;
      await getUsers({
        variables: {
          pages: pageNumber,
          username: tmpUser[0].username,
          realname: tmpUser[0].realname,
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data1) {
      console.log(data1);
      setDataSource(data1.getAllUsers);
    }
  }, [data1, setDataSource]);

  const handleFormCancle = () => {
    setVisible(false);
  };

  return (
    <>
      <Button onClick={OnClicked}>编辑</Button>
      <Modal
        title="UpdateModal"
        visible={visible}
        onCancel={handleFormCancle}
        footer={null}
      >
        <Form onFinish={handleFormSubmmitClicked}>
          <Form.Item
            name="username"
            label="账号"
            rules={[{ required: true, message: '请输入账号!' }]}
            initialValue={user.username}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="realname"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
            initialValue={user.realname}
          >
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择用户性别!' }]}
            initialValue={user.gender}
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
            initialValue={user.age}
          >
            <Input placeholder="请输入用户年龄"></Input>
          </Form.Item>
          <Form.Item
            name="isEnable"
            label="是否启用"
            rules={[{ required: true, message: '请选择账号是否启用!' }]}
            initialValue={user.isEnable}
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

export default UpdateUserButton;
