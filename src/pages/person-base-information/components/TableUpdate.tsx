import './style.less';

import { Button, Modal, Space } from 'antd';
import { useState } from 'react';

import type { PersonType } from './Atom/PersonType';
import UpdateForm from './UpdateForm';

const TableUpdate: React.FC<{ record: PersonType }> = ({ record }) => {
  // useState(false):定义模态框的弹出，默认不弹出
  const [open, setOpen] = useState(false);
  // 定义一个showModal方法，用于打开模态框
  const showModal = () => {
    // 当调用 showModal 函数时，将 open 状态设置为 true，从而显示模态框。
    setOpen(true);
  };
  // 定义一个handleOk方法，用于处理确认操作
  const handleOk = () => {
    // 当用户点击确认按钮时，将 open 状态设置为 false，从而关闭模态框。
    setOpen(false);
  };
  // 定义一个handleCancel方法，用于处理取消操作
  const handleCancel = () => {
    // 当用户点击取消按钮时，将 open 状态设置为 false，从而关闭模态框。
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button
          type="primary"
          className="button-box1"
          size="small"
          onClick={() => {
            showModal();
          }}
        >
          更新
        </Button>
      </Space>
      <Modal
        open={open}
        title={<h3>更新用户信息</h3>}
        okText="确认"
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确认
          </Button>,
        ]}
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <UpdateForm record={record} />
      </Modal>
    </>
  );
};

// 渲染组件到页面
export default TableUpdate;
