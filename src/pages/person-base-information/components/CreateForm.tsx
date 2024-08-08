import './style.less';

import { useMutation } from '@apollo/client';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select, Space } from 'antd';
import { useRecoilValue } from 'recoil';

import { CREATE_PERSON, GET_PERSONS } from '@/pages/graphql/person.graphql';

import { selectState } from './Atom/AccountAtom';
import { currentPageAtom, pageSizeAtom } from './Atom/pageAtom';
import type { PersonCreateType } from './Atom/PersonType';

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

const CreateForm: React.FC<{
  setStatus?: (newStatus: boolean) => void;
  setLoading?: (newStatus: boolean) => void;
}> = ({ setStatus, setLoading }) => {
  const [form] = Form.useForm();
  const currentPage = useRecoilValue(currentPageAtom);
  const pageSize = useRecoilValue(pageSizeAtom);
  console.log(currentPage);
  console.log(pageSize);

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: GET_PERSONS }],
  });

  const isEnabled = useRecoilValue(selectState);
  console.log(isEnabled);

  // const currentPage = useRecoilValue(currentPageAtom);
  // const pageSize = useRecoilValue(pageSizeAtom);

  const onFinish: FormProps<PersonCreateType>['onFinish'] = (
    values: PersonCreateType,
  ) => {
    console.log('success:', values);
    values.age = Number(values.age);
    console.log(values.age);
    try {
      createPerson({
        variables: { personInput: values },
        refetchQueries: [
          {
            query: GET_PERSONS,
            variables: {
              page: currentPage,
              pageSize: pageSize,
              account: '',
              isEnabled:
                isEnabled === 'work' ? true : isEnabled === 'rest' ? false : undefined,
            },
          },
        ],
      });
      showLoading();
    } catch (error) {
      alert(error);
      console.log(error);
    }
    // 更新表单状态内容
    if (setStatus) setStatus(false);
  };
  const onFinishFailed: FormProps<PersonCreateType>['onFinishFailed'] = (errorInfo) => {
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
        name="is_enabled"
        label="状态"
        rules={[{ required: true, message: '请输入状态！' }]}
      >
        <Select placeholder="请选择状态！" allowClear>
          <Option value={true}>工作</Option>
          <Option value={false}>休息</Option>
        </Select>
      </Form.Item>

      {/* 新账户输入字段 */}
      <Form.Item
        name="account"
        label="账号"
        rules={[{ required: true, message: '请输入账号！' }]}
      >
        <Input />
      </Form.Item>

      {/* 姓名输入字段 */}
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名！' }]}
      >
        <Input />
      </Form.Item>

      {/* 性别输入字段 */}
      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: false, message: '请输入性别！' }]}
      >
        <Select placeholder="请选择性别！" allowClear>
          <Option value="男">男</Option>
          <Option value="女">女</Option>
        </Select>
      </Form.Item>

      {/* 年龄输入字段 */}
      <Form.Item
        name="age"
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
          <Button htmlType="button" onClick={onReset} className="button-box3">
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateForm;
