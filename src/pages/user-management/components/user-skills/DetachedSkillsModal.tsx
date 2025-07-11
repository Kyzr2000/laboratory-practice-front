import { useState } from 'react';
import { Button, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../types';
import type { Skill } from '@/pages/skill/type';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import confirm from 'antd/es/modal/confirm';
import { useMutation } from '@apollo/client';
import {
  ATTACH_SKILL_TO_USER,
  ATTACH_SKILLS_TO_USER,
} from '@/pages/skill/graphql/mutations';

interface DetachedSkillsModalProps {
  user: User;
  detachSkills: Skill[];
  refreshData: () => void;
  refreshSkillsData: () => Promise<void>;
}

const DetachedSkillsModal = ({
  user,
  detachSkills,
  refreshData,
  refreshSkillsData,
}: DetachedSkillsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [attachSkill] = useMutation(ATTACH_SKILL_TO_USER);
  const showAttachConfirm = (skill: Skill) => {
    confirm({
      title: `确定要绑定技能 ${skill.name} 吗？`,
      okText: '确定绑定',
      okType: 'default',
      cancelText: '取消',
      onOk() {
        handleAttachSkill(user.id, skill.id);
      },
    });
  };

  const handleAttachSkill = (userId: string, skillId: string) => {
    attachSkill({
      variables: {
        userId: parseInt(userId, 10),
        skillId: parseInt(skillId, 10),
      },
      onCompleted: () => {
        refreshData();
        refreshSkillsData();
        // 如果删除后当前页没有数据，则返回上一页
        if (user.skills.length % pageSize === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        message.success('绑定成功');
      },
      onError: (error) => {
        message.error('绑定失败' + error.message);
      },
    });
  };

  // 批量处理功能
  const [selectedSkillIDs, setSelectedSkillIDs] = useState<string[]>([]);
  const [attachSkills] = useMutation(ATTACH_SKILLS_TO_USER);

  const showAttachSkillsConfirm = () => {
    confirm({
      title: `确定要绑定选中的 ${selectedSkillIDs.length} 项技能吗？`,
      icon: <ExclamationCircleFilled style={{ color: 'orange' }} />,
      okText: '确定绑定',
      cancelText: '取消',
      onOk() {
        handleAttachSkills();
      },
    });
  };

  const handleAttachSkills = () => {
    attachSkills({
      variables: {
        userId: parseInt(user.id, 10),
        skillIds: selectedSkillIDs.map((id) => parseInt(id, 10)),
      },
      onCompleted: () => {
        message.success(`成功绑定 ${selectedSkillIDs.length} 项技能`);
        refreshData();
        refreshSkillsData();
        setSelectedSkillIDs([]); // 清空选中项
        // 调整分页逻辑
        if (attachSkills.length % pageSize === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
      onError: (error) => {
        message.error('批量绑定失败: ' + error.message);
      },
    });
  };

  // 全选
  const getCurrentPageSkillIds = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return detachSkills.slice(start, end).map((skill) => skill.id);
  };

  const currentPageIds = getCurrentPageSkillIds();
  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedSkillIDs.includes(id));

  const handleSelectAll = () => {
    const currentPageIds = getCurrentPageSkillIds();

    const isAllSelected = currentPageIds.every((id) => selectedSkillIDs.includes(id));

    if (isAllSelected) {
      setSelectedSkillIDs((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedSkillIDs, ...currentPageIds]));
      setSelectedSkillIDs(newSelected);
    }
  };

  const columns: ColumnsType<Skill> = [
    {
      title: '选择',
      key: 'selection',
      width: 60,
      align: 'center',
      render: (record) => (
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
          icon={<PlusOutlined />}
          onClick={() => showAttachConfirm(record)}
          className="delete-button row-button"
        >
          绑定
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
            icon={<PlusOutlined />}
            onClick={showAttachSkillsConfirm}
            disabled={selectedSkillIDs.length === 0}
          >
            批量绑定({selectedSkillIDs.length})
          </Button>

          <Button
            className={`selectAll-button${isAllSelected ? 'selected-all' : ''}`}
            onClick={handleSelectAll}
          >
            {isAllSelected ? '取消全选' : '全选'}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={detachSkills || []}
          rowKey="username"
          scroll={{ x: 'max-content' }}
          className="user-management-table"
          rowClassName="user-table-row"
          style={{ marginTop: 1, borderRadius: 8 }}
          // 添加分页配置
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: detachSkills.length || 0,
            onChange: (page) => {
              setCurrentPage(page);
            },
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </div>
    </>
  );
};

export default DetachedSkillsModal;
