import { useMutation } from '@apollo/client';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { GET_PERSONS, UPDATE_PERSON } from '@/pages/graphql/person.graphql';

import { accountAtom, selectState } from './Atom/AccountAtom';
import { currentPageAtom, pageSizeAtom } from './Atom/pageAtom';
import type { PersonType, PersonUpdateType } from './Atom/PersonType';

// Select用于创建下拉框，Option是下拉框中的选项
const { Option } = Select;

// 定义一个layout的常量对象，用于配置表单元素的布局
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

// 定义一个taiLayout的常量对象，用于配置表单尾部的布局
const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};

const UpdateForm: React.FC<{
  // 规定存储记录的类型是PersonType
  record: PersonType;
  // 用于更新一个状态标志，表示某个组件或应用部分是否处于活动状态
  setStatus?: (newStatus: boolean) => void;
  // 用于更新一个加载状态，表示某个操作（如数据加载）是否正在进行中
  setLoading?: (newStatus: boolean) => void;
}> = ({ record, setStatus, setLoading }) => {
  // 利用useForm钩子来创建一个表单实例，Form.useForm()返回一个表单实例的数组，使用解构获取表单第一个元素
  const [form] = Form.useForm();

  const currentPage = useRecoilValue(currentPageAtom);
  const pageSize = useRecoilValue(pageSizeAtom);
  const account = useRecoilValue(accountAtom);

  // 用useMutation钩子来和后端建立联系进行更新，refetchQueries：删除成功后，返回查询全部
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: GET_PERSONS }],
  });

  const isEnabled = useRecoilValue(selectState);

  // 定义了一个onFill方法，将要编辑的记录的属性对应填充到表单内
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onFill = (record: PersonType) => {
    // setFieldValue方法用于设置表单字段的值
    form.setFieldsValue({
      account: record.account,
      newAccount: record.account,
      newName: record.name,
      newGender: record.gender,
      newAge: record.age,
      new_is_enabled: record.is_enabled,
    });
  };
  useEffect(() => {
    onFill(record);
  }, [onFill, record]);
  // onFinish用于处理表单提交
  const onFinish: FormProps<PersonUpdateType>['onFinish'] = (
    values: PersonUpdateType,
  ) => {
    console.log('success:', values);
    values.newAge = Number(values.newAge);
    try {
      updatePerson({
        variables: { personUpdate: values },
        refetchQueries: [
          {
            query: GET_PERSONS,
            variables: {
              page: currentPage,
              pageSize: pageSize,
              account,
              isEnabled:
                isEnabled === 'work' ? true : isEnabled === 'rest' ? false : undefined,
            },
          },
        ],
      });
      showLoading();
    } catch (error) {
      console.log(error);
    }
    // 更新表单状态内容
    if (setStatus) setStatus(false);
  };

  // onFinish用于处理表单提交失败
  const onFinishFailed: FormProps<PersonUpdateType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed', errorInfo);
  };
  // 处理重置按钮
  const onReset = () => {
    form.resetFields();
  };
  // 处理加载状态、
  const showLoading = () => {
    if (setLoading) {
      setLoading(true);
      // 为加载定义一个定时器
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  // 渲染组件到界面
  return (
    <Form
      form={form}
      {...layout}
      name="control-hooks"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: 600 }}
    >
      {/* 状态输入字段 */}
      <Form.Item
        name="new_is_enabled"
        label="状态"
        rules={[{ required: true, message: '请输入状态！' }]}
      >
        <Select placeholder="请选择状态！" allowClear>
          <Option value={true}>工作</Option>
          <Option value={false}>休息</Option>
        </Select>
      </Form.Item>

      {/* 原账户输入字段 */}
      <Form.Item
        name="account"
        label="原账号"
        rules={[{ required: true, message: '请输入账号！' }]}
      >
        <Input />
      </Form.Item>

      {/* 新账户输入字段 */}
      <Form.Item
        name="newAccount"
        label="新账号"
        rules={[{ required: true, message: '请输入账号！' }]}
      >
        <Input />
      </Form.Item>

      {/* 新姓名输入字段 */}
      <Form.Item
        name="newName"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名！' }]}
      >
        <Input />
      </Form.Item>

      {/* 新性别输入字段 */}
      <Form.Item
        name="newGender"
        label="性别"
        rules={[{ required: false, message: '请输入性别！' }]}
      >
        <Select placeholder="请选择性别！" allowClear>
          <Option value="男">男</Option>
          <Option value="女">女</Option>
        </Select>
      </Form.Item>

      {/* 新年龄输入字段 */}
      <Form.Item
        name="newAge"
        label="年龄"
        rules={[{ required: false, message: '请输入年龄！' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space size={'large'}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UpdateForm;
