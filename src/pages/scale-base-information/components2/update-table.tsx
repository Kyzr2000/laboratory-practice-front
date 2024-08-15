import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { GET_UNIT } from './add-import2';
import { ModalVisible } from './atom/ModalVisible';
import type { DataType } from './atom/UsersManagement';
import { currentAtom, pageSizeAtom, selectState, userAtom } from './atom/UsersManagement';
import { GET_MANAGEMENT } from './table-select';
const { Option } = Select;



const UPDATE_MANAGEMENT = gql`
  mutation UpdateManagement($id: Int!,$update: UpdateManagementDTO!) {
    updateUsers(id: $id, updateUsers: $update) {
      id
      account
      name
      gender
      age
      is_enabled
    }
  }
`;



export const UpdateTable: React.FC = () => {

    const [modalVisible, setModalVisible] = useRecoilState(ModalVisible);

    const [updateUser] = useMutation(UPDATE_MANAGEMENT);

    const userByid = useRecoilValue(userAtom);
    const [form] = Form.useForm();

    // 使用Recoil获取selectState的值，用于判断功能是否启用
    const isEnabled = useRecoilValue(selectState);
    // 使用Recoil获取currentAtom的值，用于获取当前状态
    const current = useRecoilValue(currentAtom);
    // 使用Recoil获取pageSizeAtom的值，用于获取页面大小
    const pageSize = useRecoilValue(pageSizeAtom);

    const { data, loading, error, refetch } = useQuery(GET_UNIT);


    useEffect(() => {
        if (modalVisible) {
            form.setFieldsValue({
                account: userByid.account,
                name: userByid.name,
                sex: userByid.gender,
                is_enabled: userByid.is_enabled,
                age: userByid.age,
            });
        }
    }, [modalVisible, userByid, form]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;


    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = async ({ account, name, gender, age, is_enabled, unitId }: DataType) => {
        if (userByid.id) {
            const userAge = Number(age);
            await updateUser({
                variables: {
                    id: userByid.id, update: {
                        account, name, gender, age: userAge,
                        is_enabled, unit_id: unitId
                    }
                },
                refetchQueries: [{
                    query: GET_MANAGEMENT,
                    variables: {
                        page: current, pageSize, account, isEnabled: isEnabled
                            === 'start' ? true : isEnabled === 'end' ? false : undefined
                    }
                }],
            });


        }
        setModalVisible(false);
        refetch();
    };

    return (
        <>
            <Modal
                title="修改用户信息"
                open={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        OK
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    initialValues={{
                        account: userByid.account,
                        name: userByid.name,
                        gender: userByid.gender,
                        is_enabled: userByid.is_enabled,
                        age: userByid.age,
                        unitId: userByid.unit_name

                    }}
                    onFinish={handleSubmit}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="账号" name="account"
                                rules={[{ required: true, message: '请输入账号' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="姓名"
                                name="name"
                                rules={[{ required: true, message: '请输入姓名' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="性别" name="gender">
                                <Select>
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="年龄"
                                name="age"
                                rules={[{ required: true, message: '请输入年龄' },
                                { type: 'number', message: '年龄必须是数字' }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="是否启用" name="is_enabled">
                                <Select>
                                    <Option value={true}>是</Option>
                                    <Option value={false}>否</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="公司"
                                name="unitId"
                                rules={[{ required: true, message: '请选择公司' }]}
                            >
                                <Select>
                                    {data?.getUnit.map((item: DataType) => (
                                        // 遍历单位数据，为每个单位生成一个选项
                                        <Select.Option key={item.id}
                                            value={item.id}>{item.unit_name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );



};