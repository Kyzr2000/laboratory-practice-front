import { useMutation } from '@apollo/client';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select, Space } from 'antd';
import React from 'react';

// import { useRecoilValue } from 'recoil';
import { CREATE_PERSON, GET_PEOPLE } from '@/pages/graphql/people.graphql';

import type { PeopleAddType } from './Atom/InterfaceState';
// import type { OptionItemType } from './Atom/InterfaceState';
// import { OptionsState } from './Atom/OptionsState';

const { Option } = Select;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 5, span: 16 },
};

const AddModalForm: React.FC<{
    setStatus?: (newStatus: boolean) => void;
    setLoading?: (newStatus: boolean) => void
}>
    = ({ setStatus, setLoading }) => {
        const [form] = Form.useForm();
        // const OptionsStateList = useRecoilValue(OptionsState);
        // const OptionsStateList1 = OptionsStateList.slice(1);

        const [createPerson] = useMutation(CREATE_PERSON, {
            refetchQueries: [{ query: GET_PEOPLE }]
        });

        // const onGenderChange = (value: string) => {
        //     switch (value) {
        //         case 'male':
        //             break;
        //         case 'female':
        //             break;
        //         default:
        //     }
        // };

        const onFinish: FormProps<PeopleAddType>['onFinish'] = (values: PeopleAddType) => {
            console.log('Success:', values);
            values.age = Number(values.age);
            try {
                createPerson({ variables: { personInput: values } });
                showLoading();
            } catch (err) {
                console.log(err);
            }
            if (setStatus) setStatus(false);
        };

        const onFinishFailed: FormProps<PeopleAddType>['onFinishFailed'] = (errorInfo) => {
            console.log('Failed', errorInfo);
        };

        const onReset = () => {
            form.resetFields();
        };

        // const onFill = () => {
        //     form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
        // };

        const showLoading = () => {
            if (setLoading) {
                setLoading(true);

                // Simple loading mock. You should add cleanup logic in real world.
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        return (
            <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600 }}
                
            >

                {/* 状态输入字段 */}
                <Form.Item name="is_enabled" label="状态"
                    rules={[{ required: true, message: '请输入状态！' }]}>
                    {/* <Select
                        placeholder="请选择您的状态！"
                        onChange={onGenderChange}
                        allowClear
                    >
                        {OptionsStateList1.map((item: OptionItemType, index) => {
                            return <option key={index} value={item.value}>{item.value}</option>;
                        })}
                    </Select> */}
                    <Input placeholder='请输入您的状态！' allowClear   />
                </Form.Item>

                {/* 账户输入字段 */}
                <Form.Item name="account" label="账号"
                    rules={[{ required: true, message: '请输入账号！' }]}>
                    <Input />
                </Form.Item>

                {/* 姓名输入字段 */}
                <Form.Item name="name" label="姓名"
                    rules={[{ required: true, message: '请输入姓名！' }]}>
                    <Input />
                </Form.Item>

                {/* 性别输入字段 */}
                <Form.Item name="gender" label="性别"
                    rules={[{ required: false, message: '请输入性别！' }]}>
                    <Select
                        placeholder="请选择您的性别！"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                </Form.Item>

                {/* 年龄输入字段 */}
                <Form.Item name="age" label="年龄" rules={[{ required: false, message: '请输入年龄！' }]}>
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.gender !== currentValues.gender}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('gender') === 'other' ? (
                            <Form.Item name="customizeGender"
                                label="Customize Gender" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item> */}

                <Form.Item {...tailLayout}>
                    <Space size={'large'}>
                        <Button type="primary" htmlType="submit"
                            style={{ backgroundColor: '#20a89d' }}>
                            提交
                        </Button>
                        <Button htmlType="button" onClick={onReset}
                            style={{ backgroundColor: '#20a89d', color:'white' }}>
                            重置
                        </Button>
                        {/* <Button type="link" htmlType="button" onClick={onFill}>
                            Fill form
                        </Button> */}
                    </Space>
                </Form.Item>
            </Form>
        );
    };

export default AddModalForm;