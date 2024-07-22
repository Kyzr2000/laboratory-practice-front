import { EditFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';

import AddModalForm from './AddModalForm';

const AddModal: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleStatusChange = (newStatus: boolean) => {
        setOpen(newStatus);
    };

    const handleLoadingChange = (newLoading: boolean) => {
        setLoading(newLoading);
    };

    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <Button className="button-box" onClick={showLoading}
                type="primary" icon={<EditFilled />} size={'large'}>
                新增用户
            </Button>
            <Modal
                title={<h2>添加用户信息</h2>}
                footer={
                    <Button type="primary" onClick={showLoading}>
                        Reload
                    </Button>
                }
                loading={loading}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <AddModalForm setStatus={handleStatusChange} setLoading={handleLoadingChange} />
            </Modal>
        </>
    );
};

export default AddModal;