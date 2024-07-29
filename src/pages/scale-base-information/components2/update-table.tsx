import { gql, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { ModalVisible } from './atom/ModalVisible';
import { userAtom } from './atom/UsersManagement';
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

interface DataType {
    account: string
    name: string;
    gender: string;
    age: number;
    is_enabled: boolean
}

export const UpdateTable: React.FC = () => {

    const [modalVisible, setModalVisible] = useRecoilState(ModalVisible);

    const [updateUser] = useMutation(UPDATE_MANAGEMENT);

    const userByid = useRecoilValue(userAtom);
    const [form] = Form.useForm();

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

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = async ({ account, name, gender, age, is_enabled }: DataType) => {
        if (userByid.id) {
            const userAge = Number(age);
            await updateUser({
                variables: {
                    id: userByid.id, update: {
                        account, name, gender, age: userAge,
                        is_enabled
                    }
                },
                refetchQueries: [{ query: GET_MANAGEMENT }]
            });


        }
        setModalVisible(false);
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
                        age: userByid.age

                    }}
                    onFinish={handleSubmit}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="账号" name="account">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="姓名" name="name">
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
                            <Form.Item label="年龄" name="age">
                                <Input />
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
                    </Row>
                </Form>
            </Modal>
        </>
    );



};