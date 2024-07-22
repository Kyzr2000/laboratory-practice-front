import './style.less';

import { DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Modal, Space } from 'antd';

import { DELETE_PERSON, GET_PEOPLE } from '@/pages/graphql/people.graphql';

import type { PeopleType } from './Atom/InterfaceState';


const TableDelete: React.FC<{ record: PeopleType }> = ({ record }) => {
    const [modal, contextHolder] = Modal.useModal();

    const confirm = () => {

        modal.confirm({
            title: <h2><ExclamationCircleOutlined style={{ color: 'red' }} /> 删除用户信息</h2>,
            icon: <ExclamationCircleOutlined style={{ display: 'none' }} />,
            content: <h3>您确定要删除用户({record.account})的信息吗?</h3>,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                handleDeletePerson(record);
            }
        });
    };

    const [deletePerson] = useMutation(DELETE_PERSON, {
        refetchQueries: [{ query: GET_PEOPLE }]
    });

    const handleDeletePerson = async (record: PeopleType) => {
        try {
            await deletePerson({ variables: { account: record.account } });
            
        } catch (error) {
            console.error(`Error deleting person:${error}`);
        }
    };

    return (
        <>
            <Space>
                {/* <LocalizedModal /> */}
                <Button className="button-box" type='primary' onClick={confirm}
                    icon={<DeleteFilled />} size={'small'} danger>删 除</Button>
            </Space>
            {contextHolder}
        </>
    );
};

export default TableDelete;