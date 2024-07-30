import { gql, useLazyQuery, useMutation } from '@apollo/client';
import type { FormProps } from 'antd';
import { Button, Col, Form, Input, message, Modal, Radio } from 'antd';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { table1 } from './recoil';

const CREATE: React.FC = () => {
  const CREATE = gql`
    mutation CreateUser($createuser: CreateUser!) {
      CreateUser(createuser: $createuser) {
        id
        username
        password
        name
        gender
        age
        use
      }
    }
  `;
  const QUERYUSERNAME = gql`
    query FindUserName($username: String!) {
      FindUserName(username: $username) {
        username
      }
    }
  `;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('男');
  const [age, setAge] = useState('');
  const [use, setUse] = useState('是');
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const [createuser] = useMutation(CREATE);
  const [findusername] = useLazyQuery(QUERYUSERNAME, { fetchPolicy: 'no-cache' });
  const [state, setState] = useRecoilState(table1);
  const handleShow = () => {
    setShow(true);
  };
  const handleCancel = () => {
    setShow(false);
    form.resetFields();
  };
  const onFinish: FormProps['onFinish'] = async () => {
    const { data } = await findusername({ variables: { username: username } });
    if (data && data.FindUserName.username) {
      message.error('该账户已被注册');
      form.resetFields();
    } else {
      createuser({
        variables: {
          createuser: {
            username: username,
            password: password,
            name: name,
            gender: gender,
            age: age,
            use: use,
          },
        },
      });
      form.resetFields();
      message.success('注册成功');
      setShow(false);
      setState(state + 1);
    }
  };

  const onFinishFailed: FormProps['onFinishFailed'] = () => {};
  const handleOk = () => {
    form.submit();
  };

  return (
    <>
      <Col span={2}>
        <Button
          type="primary"
          onClick={handleShow}
          className="Primary"
          style={{ backgroundColor: '#0497a8', color: 'white' }}
        >
          新增用户
        </Button>
      </Col>
      <Modal
        open={show}
        centered={true}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
      >
        <Form
          form={form}
          name="create"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item></Form.Item>
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入你的账号' }]}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入你的密码' }]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入你的名字' }]}
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value={'男'}>男</Radio>
              <Radio value={'女'}>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="年龄"
            name="年龄"
            rules={[{ required: true, message: '请输入你的年龄' }]}
          >
            <Input onChange={(e) => setAge(e.target.value)} />
          </Form.Item>

          <Form.Item label="是否启用" name="use" rules={[{ required: true }]}>
            <Radio.Group onChange={(e) => setUse(e.target.value)} value={use}>
              <Radio value={'是'}>是</Radio>
              <Radio value={'否'}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CREATE;
