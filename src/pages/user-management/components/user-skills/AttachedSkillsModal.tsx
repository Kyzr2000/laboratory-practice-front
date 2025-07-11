import { useState } from 'react';
import { Button, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { User } from '../../types';
import type { Skill } from '@/pages/skill/type';
import { useMutation } from '@apollo/client';
import {
  DETACH_SKILL_FROM_USER,
  DETACH_SKILLS_FROM_USER,
} from '@/pages/skill/graphql/mutations'; // 导入批量解绑 mutation
import confirm from 'antd/es/modal/confirm';

interface AttachedSkillsModalProps {
  user: User;
  attachSkills: Skill[];
  refreshData: () => void;
  refreshSkillsData: () => Promise<void>;
}

const AttachedSkillsModal = ({
  user,
  attachSkills,
  refreshData,
  refreshSkillsData,
}: AttachedSkillsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // 新增选中技能状态
  const [selectedSkillIDs, setSelectedSkillIDs] = useState<string[]>([]);

  const [detachUserFromSkill] = useMutation(DETACH_SKILL_FROM_USER);
  // 新增批量解绑 mutation
  const [detachSkillsFromUser] = useMutation(DETACH_SKILLS_FROM_USER);

  // 新增批量解绑确认函数
  const showBatchDeleteConfirm = () => {
    confirm({
      title: `确定要解除绑定选中的 ${selectedSkillIDs.length} 项技能吗？`,
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定解除绑定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleBatchDetachSkills();
      },
    });
  };

  // 新增批量解绑处理函数
  const handleBatchDetachSkills = () => {
    detachSkillsFromUser({
      variables: {
        userId: parseInt(user.id, 10),
        skillIds: selectedSkillIDs.map((id) => parseInt(id, 10)),
      },
      onCompleted: () => {
        message.success(`成功解绑 ${selectedSkillIDs.length} 项技能`);
        refreshData();
        refreshSkillsData();
        setSelectedSkillIDs([]); // 清空选中项
        // 调整分页逻辑
        if (attachSkills.length % pageSize === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
      onError: (error) => {
        message.error('批量解绑失败: ' + error.message);
      },
    });
  };

  const showDeleteConfirm = (skill: Skill) => {
    confirm({
      title: `确定要解除绑定技能 ${skill.name} 吗？`,
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: '此操作不可恢复，请谨慎操作',
      okText: '确定解除绑定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDetachSkill(user.id, skill.id);
      },
    });
  };

  const handleDetachSkill = (userId: string, skillId: string) => {
    detachUserFromSkill({
      variables: {
        userId: parseInt(userId, 10),
        skillId: parseInt(skillId, 10),
      },
      onCompleted: () => {
        refreshSkillsData();
        // 如果删除后当前页没有数据，则返回上一页
        if (user.skills.length % pageSize === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        message.success('解绑成功');
      },
      onError: (error) => {
        message.error('解绑失败' + error.message);
      },
    });
  };

  // 全选功能
  // 新增：计算当前页的技能ID列表
  const getCurrentPageSkillIds = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return attachSkills.slice(start, end).map((skill) => skill.id);
  };

  // 新增：处理全选/取消全选逻辑
  const handleSelectAll = () => {
    const currentPageIds = getCurrentPageSkillIds();

    // 检查当前页是否已全选
    const isAllSelected = currentPageIds.every((id) => selectedSkillIDs.includes(id));

    if (isAllSelected) {
      // 取消选择当前页所有技能
      setSelectedSkillIDs((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // 选择当前页所有技能
      const newSelected = Array.from(new Set([...selectedSkillIDs, ...currentPageIds]));
      setSelectedSkillIDs(newSelected);
    }
  };

  // 计算当前页是否全选（用于按钮样式）
  const currentPageIds = getCurrentPageSkillIds();
  const isCurrentPageAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedSkillIDs.includes(id));

  const columns: ColumnsType<Skill> = [
    // 新增勾选列
    {
      title: '选择',
      key: 'selection',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedSkillIDs.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedSkillIDs([...selectedSkillIDs, record.id]);
            } else {
              setSelectedSkillIDs(selectedSkillIDs.filter((key) => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
      align: 'center',
      className: 'index-column',
    },
    {
      title: '技能名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      className: 'username-column',
    },
    {
      title: '技能描述',
      align: 'center',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      className: 'realname-column',
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
      <div className="user-skill-table">
        <div className="select-button">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={showBatchDeleteConfirm}
            disabled={selectedSkillIDs.length === 0}
          >
            批量解绑 ({selectedSkillIDs.length})
          </Button>

          <Button
            className={`selectAll-button ${
              isCurrentPageAllSelected ? 'selected-all' : ''
            }`}
            type={isCurrentPageAllSelected ? 'primary' : 'default'}
            onClick={handleSelectAll}
          >
            {isCurrentPageAllSelected ? '取消全选' : '全选'}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={attachSkills || []}
          rowKey="id" // 确保使用唯一标识字段
          scroll={{ x: 'max-content' }}
          className="user-management-table"
          rowClassName="user-table-row"
          style={{ borderRadius: 8 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: attachSkills.length || 0,
            onChange: (page) => {
              setCurrentPage(page);
              setSelectedSkillIDs([]); // 翻页时清空选择
            },
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </div>
    </>
  );
};

export default AttachedSkillsModal;
