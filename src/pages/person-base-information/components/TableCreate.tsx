import { Button, Modal, Space } from 'antd';
import { useState } from 'react';

import CreateForm from './CreateForm';

const TableCreate: React.FC = () => {
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
          className="button-box2"
          size={'large'}
          style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}
          // 点击新增用户按钮，则触发showModal点击事件
          onClick={() => {
            showModal();
          }}
        >
          新增用户
        </Button>
      </Space>
      <Modal
        open={open}
        title={<h3 style={{ color: '#008000', textAlign: 'center' }}> 添加新用户</h3>}
        okText="确认"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{ backgroundColor: '#20a89d' }}
          >
            确认
          </Button>,
        ]}
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CreateForm />
      </Modal>
    </>
  );
};

export default TableCreate;
