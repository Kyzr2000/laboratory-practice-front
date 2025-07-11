import { useState } from 'react';
import { Button, Card, message, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '@/pages/user-management/types';
import type { Skill } from '../type';
import { DeleteOutlined, ExclamationCircleFilled, LinkOutlined } from '@ant-design/icons';
import confirm from 'antd/es/modal/confirm';
import { useMutation } from '@apollo/client';
import { DETACH_SKILL_FROM_USER } from '../graphql/mutations';

interface UserListModalProps {
  skill: Skill;
  refreshData: () => void;
}

const UserListModal = ({ skill, refreshData }: UserListModalProps) => {
  const [visible, setVisible] = useState(false);
  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const showModal = () => {
    setVisible(true);
    // 重置分页状态每次打开弹窗
    setCurrentPage(1);
  };

  const handleCancel = () => setVisible(false);
  const [detachUserFromSkill] = useMutation(DETACH_SKILL_FROM_USER);

  const showDeleteConfirm = (user: User) => {
    confirm({
      title: `确定要解除绑定用户 ${user.username} 吗？`,
      icon: <ExclamationCircleFilled />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定解除绑定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDetach(user.id, skill.id);
      },
    });
  };

  const handleDetach = (userId: string, skillId: string) => {
    detachUserFromSkill({
      variables: {
        userId: parseInt(userId, 10),
        skillId: parseInt(skillId, 10),
      },
      onCompleted: () => {
        refreshData();
        // 如果删除后当前页没有数据，则返回上一页
        if (skill.users.length % pageSize === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        message.success('解绑成功');
      },
      onError: (error) => {
        message.error('解绑失败' + error.message);
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
      align: 'center',
      className: 'index-column',
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      className: 'username-column',
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realname',
      key: 'realname',
      width: 100,
      className: 'realname-column',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 0 ? '男' : '女'),
      width: 70,
      align: 'center',
      className: 'gender-column',
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record)}
          className="delete-button row-button"
        >
          解除绑定
        </Button>
      ),
      className: 'action-column',
      width: 100,
    },
  ];

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        icon={<LinkOutlined />}
        className="row-button"
      >
        {`用户(${skill.users.length})`}
      </Button>
      <Modal
        title="用户列表"
        open={visible}
        onCancel={handleCancel}
        destroyOnClose // 修复属性名（原destroyOnHidden应为destroyOnClose）
        width="900px"
        footer={null}
      >
        <Card className="user-experience-card">
          <Table
            columns={columns}
            dataSource={skill.users || []}
            rowKey="username"
            scroll={{ x: 'max-content' }}
            className="user-management-table"
            rowClassName="user-table-row"
            style={{ marginTop: 16, borderRadius: 8 }}
            // 添加分页配置
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: skill.users?.length || 0,
              onChange: (page) => {
                setCurrentPage(page);
              },
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>
      </Modal>
    </>
  );
};

export default UserListModal;
