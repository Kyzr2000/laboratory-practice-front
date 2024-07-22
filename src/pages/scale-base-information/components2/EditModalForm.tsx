import { useMutation } from '@apollo/client';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select, Space } from 'antd';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { GET_PEOPLE, UPDATE_PERSON } from '@/pages/graphql/people.graphql';

import type { PeopleUpdateType } from './Atom/InterfaceState';
import type { OptionItemType } from './Atom/InterfaceState';
import type { PeopleType } from './Atom/InterfaceState';
import { OptionsState } from './Atom/OptionsState';

const { Option } = Select;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 5, span: 16 },
};

const EditModalForm: React.FC<{
    record: PeopleType;
    setStatus?: (newStatus: boolean) => void;
    setLoading?: (newStatus: boolean) => void
}>
    = ({ record, setStatus, setLoading }) => {
        const [form] = Form.useForm();
        const OptionsStateList = useRecoilValue(OptionsState);
        const OptionsStateList1 = OptionsStateList.slice(1);

        const [updatePerson] = useMutation(UPDATE_PERSON, {
            refetchQueries: [{ query: GET_PEOPLE }]
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const onFill = (record: PeopleType) => {
            form.setFieldsValue({
                account: record.account,
                newAccount: record.account,
                newName: record.name,
                newGender: record.gender,
                newAge: record.age,
                new_is_enabled: record.is_enabled
            });
        };

        useEffect(() => {
            onFill(record);
        }, [onFill, record]);

        const onGenderChange = (value: string) => {
            switch (value) {
                case 'male':
                    break;
                case 'female':
                    break;
                default:
            }
        };

        const onFinish: FormProps<PeopleUpdateType>['onFinish'] = (values: PeopleUpdateType) => {
            console.log('Success:', values);
            values.newAge = Number(values.newAge);
            try {
                updatePerson({ variables: { input: values } });
                showLoading();
            } catch (err) {
                console.log(err);
            }
            if (setStatus) setStatus(false);
        };

        const onFinishFailed: FormProps<PeopleUpdateType>['onFinishFailed'] = (errorInfo) => {
            console.log('Failed', errorInfo);
        };

        const onReset = () => {
            form.resetFields();
        };

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
                <Form.Item name="new_is_enabled" label="状态"
                    rules={[{ required: true, message: '请输入状态！' }]}>
                    <Select
                        placeholder="Select a status and change input text above"
                        onChange={onGenderChange}
                        allowClear
                    >
                        {OptionsStateList1.map((item: OptionItemType, index) => {
                            return <option key={index} value={item.value}>{item.value}</option>;
                        })}
                    </Select>
                </Form.Item>

                {/* 原账户输入字段 */}
                <Form.Item name="account" label="原账号"
                    rules={[{ required: true, message: '请输入账号！' }]}>
                    <Input defaultValue={record.account} readOnly/>
                </Form.Item>

                {/* 新账户输入字段 */}
                <Form.Item name="newAccount" label="新账号"
                    rules={[{ required: true, message: '请输入账号！' }]}>
                    <Input />
                </Form.Item>

                {/* 新姓名输入字段 */}
                <Form.Item name="newName" label="姓名"
                    rules={[{ required: true, message: '请输入姓名！' }]}>
                    <Input />
                </Form.Item>

                {/* 新性别输入字段 */}
                <Form.Item name="newGender" label="性别"
                    rules={[{ required: false, message: '请输入性别！' }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                    </Select>
                </Form.Item>

                {/* 新年龄输入字段 */}
                <Form.Item name="newAge" label="年龄"
                    rules={[{ required: false, message: '请输入年龄！' }]}>
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
                        <Button type="primary" htmlType="submit" >
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                        {/* <Button type="link" htmlType="button" onClick={onFill}>
                            Fill form
                        </Button> */}
                    </Space>
                </Form.Item>
            </Form>
        );
    };

export default EditModalForm;