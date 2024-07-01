import './css/update-user-modal.scss';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  Switch,
  message,
  Button,
} from 'antd';

import type {
  UpdateUserData,
  UserOperateResponse,
  UpdateUserInput,
  UserInformationBase,
} from '../type';
import { UPDATE_USER_INFORMATION, GET_USER_DETAIL } from '@/apis';
// import { GET_USER_BASE_INFORMATION_LIST } from '@/apis';

const Role  = {
  ADMIN: 'ADMIN',
  DIRECTIOR: 'DIRECTIOR',
  DOCTOR: 'DOCTOR',
  USER: 'USER',
};

const initUserUpdateData: UpdateUserData = {
  realname: null,
  username: null,
  gender: null,
  age: null,
  isEnable: false,
  email: null,
  address: null,
  introduction: null,
  password: null,
  role: Role.ADMIN,
};

const { TextArea } = Input;

type PropsConfig = {
  open: boolean;
  setUpdateUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setIsQuerying: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateUserModal = ({
  open,
  setUpdateUserOpen,
  userId,
  setUserId,
  setIsQuerying,
}: PropsConfig) => {
  const [updateUserData, setUpdateUserData] = useState<UpdateUserData>({
    ...initUserUpdateData
  });

  const { loading: loading2, refetch: getUserInformationById } =
    useQuery<UserInformationBase>(GET_USER_DETAIL, {
      skip: userId === null, // 如果userId为null，则跳过查询
      onCompleted(data) {
        console.log(data.getUserDetail);
        setUpdateUserData(data.getUserDetail);
      },
      onError(error) {
        console.log(error);
      },
    });

  let title = '';
  if (userId) {
    title = '更改用户信息';
  } else {
    title = '添加用户';
  }

  useEffect(() => {
    if (userId) {
      getUserInformationById({
        data: userId,
      });
    }
  }, [getUserInformationById, userId]);

  const [updateUser, { loading }] = useMutation<
    UserOperateResponse,
    UpdateUserInput
  >(UPDATE_USER_INFORMATION, {
    onCompleted(data) {
      console.log(data);
      if (data.updateUser.result === 'success') {
        message.success(data.updateUser.message);
        setIsQuerying(true); // 重新查询一些用户列表
        hideModal();
      } else {
        message.error(data.updateUser.message);
      }
    },
    onError(error) {
      console.log(error);
      message.error('更新用户出现异常错误!!!');
    },
  });

  const hideModal = () => {
    setUpdateUserOpen(false);
    setUpdateUserData({
      ...initUserUpdateData
    });
    setUserId(null);
  };

  const submitUser = () => {
    console.log({
      data: {
        ...updateUserData,
      },
      userId: userId,
    });
    updateUser({
      variables: {
        data: {
          ...updateUserData,
        },
        userId: userId,
      },
    });
  };

  const [form] = Form.useForm<UpdateUserData>();
  useEffect(() => {
    form.setFieldsValue(updateUserData);
  }, [form,updateUserData]);
  return (
    <>
      <Modal
        className='update-user-modal'
        title={title}
        open={open}
        onCancel={hideModal}
        zIndex={1999}
        okButtonProps={{ loading }}
        loading={loading2}
        style={{ marginTop: '80px' }}
        footer={false}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout='horizontal'
          onFinish={submitUser}
          form={form}
          validateTrigger='onBlur'
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label='用户名'
                name='username'
                rules={[
                  {
                    validator(_, value) {
                      const trimmedValue = value ? value.trim() : '';
                      if (trimmedValue.length === 0) {
                        return Promise.reject(new Error('Required'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  disabled={userId !== null}
                  onChange={(e) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      username:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                      password:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='真实姓名'
                name='realname'
                rules={[
                  {
                    validator(_, value) {
                      const trimmedValue = value ? value.trim() : '';
                      if (trimmedValue.length === 0) {
                        return Promise.reject(new Error('Required'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      realname:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='性别' name='gender'>
                <Select
                  onSelect={(value) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      gender: value,
                    }));
                  }}
                >
                  <Select.Option value={1}>男</Select.Option>
                  <Select.Option value={2}>女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='年龄' name='age'>
                <InputNumber
                  min={0}
                  value={updateUserData.age}
                  onChange={(number) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      age: number,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='邮箱' name='email'>
                <Input
                  value={updateUserData.email ? updateUserData.email : ''}
                  onChange={(e) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      email:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='地址' name='address'>
                <Input
                  value={updateUserData.address ? updateUserData.address : ''}
                  onChange={(e) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      address:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='角色' name='role'>
                <Select
                  value={updateUserData.role}
                  onSelect={(value) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      role: value,
                    }));
                  }}
                >
                  <Select.Option value='USER'>USER</Select.Option>
                  <Select.Option value='ADMIN'>ADMIN</Select.Option>
                  <Select.Option value='DOCTOR'>DOCTOR</Select.Option>
                  <Select.Option value='DIRECTIOR'>DIRECTIOR</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='密码'>
                <Input
                  disabled={true}
                  value={
                    userId !== null
                      ? '不能对密码进行更改！'
                      : '默认密码为用户名！'
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='个人介绍' name='introduction'>
                <TextArea
                  rows={3}
                  value={
                    updateUserData.introduction as unknown as
                      | string
                      | number
                      | bigint
                      | readonly string[]
                      | undefined
                  }
                  onChange={(e) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      introduction:
                        e.target.value.trim().length === 0
                          ? null
                          : e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='是否启用'
                valuePropName='checked'
                name='isEnable'
              >
                <Switch
                  value={updateUserData.isEnable}
                  onChange={(value) => {
                    setUpdateUserData((prevState) => ({
                      ...prevState,
                      isEnable: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ textAlign: 'right', marginBottom: '0px' }}
          >
            <Button
              htmlType='button'
              style={{ marginRight: '20px' }}
              className='update-user-button'
              onClick={hideModal}
            >
              取&nbsp;&nbsp;消
            </Button>
            <Button
              htmlType='submit'
              type='primary'
              className='update-user-button'
              loading={loading || loading2}
            >
              确&nbsp;&nbsp;认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUserModal;
