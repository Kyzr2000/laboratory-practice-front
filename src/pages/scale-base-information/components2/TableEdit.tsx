import './style.less';

import { EditFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react';

import type { PeopleType } from './Atom/InterfaceState';
import EditModalForm from './EditModalForm';

const TableEdit: React.FC<{record: PeopleType}> = ({ record }) => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    return (
    <>
            <Space>
                <Button
                    type="primary"
                    className="button-box"
                    icon={<EditFilled />}
                    size={'small'}
                    onClick={() => {
                        showModal();
                    }}
                >
                    编 辑
                </Button>
            </Space>

            <Modal
                open={open}
                title={<h2>编辑用户信息</h2>}
                okText="确认"
                footer={[<Button key="submit" type="primary" onClick={handleOk}>
                    确认
                </Button>]}
                cancelText="取消"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <EditModalForm record={ record } />
            </Modal>
        </>
    );
};

export default TableEdit;