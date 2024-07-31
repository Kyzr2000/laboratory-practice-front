import { useMutation } from '@apollo/client';
import { Form, Input, InputNumber, message, Modal, Radio } from 'antd';
import type { Rule } from 'antd/lib/form';
import { useEffect } from 'react';

import { UpdateUser } from '@/pages/graphql/mutations';
interface DataType {
  id: number;
  username: string;
  realname: string;
  gender: number;
  age: number;
  isEnable: boolean;
}
export default function Update_user({
  open,
  userdate,
  onSuccess,
  onCancle,
}: {
  open: boolean;
  userdate: DataType;
  onSuccess: () => void;
  onCancle: () => void;
}) {
  const nameRules: Rule[] = [
    { required: true, message: '不能为空' },
    { min: 2, type: 'string' },
  ];
  const ageRules: Rule[] = [
    { required: true, message: '不能为空' },
    { min: 1, type: 'number', message: '最小一岁' },
  ];
  const [updateUser] = useMutation(UpdateUser);
  const { Item } = Form;
  const { Group } = Radio;
  const option = [
    { label: '男', value: 1 },
    { label: '女', value: 0 },
  ];
  const option1 = [
    { label: '是', value: true },
    { label: '否', value: false },
  ];
  const [form] = Form.useForm();
  async function onOk() {
    try {
      const values = await form.validateFields();
      console.log(values);
      updateUser({
        variables: {
          userId: userdate.id - 0,
          data: {
            realname: values.realname,
            username: values.username,
            gender: values.gender,
            age: values.age,
            isEnable: values.isEnable,
            role: 'USER',
          },
        },
      })
        .then((result) => {
          console.log('User update:', result);
          // 在这里处理删除成功的情况，比如更新UI或导航
          message.success('更新成功');
          onSuccess && onSuccess();
        })
        .catch((error) => {
          console.error('Error updateUser:', error);
          // 在这里处理错误情况
          message.success('更新失败');
        });
    } catch (error) {
      console.error('验证失败:', error);
    }
  }
  useEffect(() => {
    form.setFieldsValue(userdate);
  }, [userdate, form]);
  return (
    <Modal open={open} title="编辑信息" onOk={onOk} onCancel={onCancle}>
      <Form
        form={form}
        layout="horizontal"
        wrapperCol={{ span: 32 }}
        labelCol={{ span: 4 }}
        style={{ maxWidth: '500px' }}
      >
        <Item label="编号" name="id">
          <Input readOnly></Input>
        </Item>
        <Item label="账户" name="username">
          <Input readOnly></Input>
        </Item>
        <Item label="姓名" name="realname" rules={nameRules}>
          <Input></Input>
        </Item>
        <Item label="性别" name="gender">
          <Group options={option} optionType="button"></Group>
        </Item>
        <Item label="是否启用" name="isEnable">
          <Group options={option1} optionType="button"></Group>
        </Item>
        <Item label="年龄" name="age" rules={ageRules}>
          <InputNumber></InputNumber>
        </Item>
      </Form>
    </Modal>
  );
}
