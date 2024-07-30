import '../components2/style.less';

import { UserAddOutlined } from '@ant-design/icons';
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
            <Button className="button-box1" onClick={showLoading}
                type="primary" icon={<UserAddOutlined className='button-box1-icon' />}
                size={'large'}>
                新增
            </Button>
            <Modal
                title={<h2 style={{ color: '#008000', marginTop: '-0px' }}>添加用户信息</h2>}
                footer={
                    <Button type="primary" onClick={showLoading}
                        style={{ backgroundColor: '#20a89d' }}>
                        刷新
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