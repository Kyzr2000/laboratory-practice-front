// UserSkillsList.tsx
import { useState } from 'react';
import { Button, Card, message, Modal, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import type { Skill } from '@/pages/skill/type';
import { useLazyQuery } from '@apollo/client';
import AttachedSkillsModal from './AttachedSkillsModal';
import DetachedSkillsModal from './DetachedSkillsModal';
import { GET_SKILLS_FILTER } from '@/pages/skill/graphql/querise';
import { DisconnectOutlined, LinkOutlined, SwapOutlined } from '@ant-design/icons';

interface UserSkillsListProps {
  user: User;
  refreshData: () => void;
}

const UserSkillsList = ({ user, refreshData }: UserSkillsListProps) => {
  const [visible, setVisible] = useState(false);
  const [attachSkills, setAttachSkills] = useState<Skill[]>([]);
  const [detachSkills, setDetachSkills] = useState<Skill[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 从URL参数获取当前激活的卡片类型
  const queryParams = new URLSearchParams(location.search);
  const activeCard = queryParams.get('skillCard') || 'attached';

  const [getSkillsFilter] = useLazyQuery(GET_SKILLS_FILTER, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: parseInt(user.id, 10),
    },
    onCompleted: (data) => {
      if (data?.getSkillsFilter) {
        setAttachSkills(data.getSkillsFilter.attachSkills);
        setDetachSkills(data.getSkillsFilter.detachSkills);
      }
    },
    onError: (err) => message.error('获取技能失败:' + err),
  });

  // 新增刷新技能列表函数
  const refreshSkillsData = async () => {
    try {
      await getSkillsFilter();
    } catch (error) {
      message.error('刷新技能列表失败');
    }
  };

  const showModal = async () => {
    setVisible(true);
    await getSkillsFilter();
    // 设置默认URL参数
    navigate('?skillCard=attached', { replace: true });
  };

  const handleCancel = () => {
    setVisible(false);
    // 关闭时清除URL参数
    navigate(location.pathname, { replace: true });
  };

  // 切换卡片类型
  const switchCard = (cardType: string) => {
    navigate(`?skillCard=${cardType}`, { replace: true });
  };

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        className="row-button"
        icon={<LinkOutlined />}
      >
        <span>{`技能(${user.skills.length})`}</span>
      </Button>
      <Modal
        title="技能列表"
        open={visible}
        onCancel={handleCancel}
        width="900px"
        footer={null}
        destroyOnClose
      >
        {/* 已绑定技能卡片 */}
        {activeCard === 'attached' && (
          <div className="user-skill-card">
            <Card
              title={
                <div className="card-title">
                  <Space>
                    <LinkOutlined style={{ color: '#52c41a' }} />
                    <span>已绑定的技能</span>
                    <span className="text-gray-500 text-sm">
                      ({attachSkills.length}项)
                    </span>
                  </Space>
                  <Button
                    type="primary"
                    onClick={() => switchCard('detached')}
                    icon={<SwapOutlined />}
                    className="flex items-center"
                  >
                    查看未绑定技能
                  </Button>
                </div>
              }
              className="user-experience-card"
            >
              <AttachedSkillsModal
                refreshData={refreshData}
                refreshSkillsData={refreshSkillsData} // 传递刷新函数
                user={user}
                attachSkills={attachSkills}
              />
            </Card>
          </div>
        )}

        {/* 未绑定技能卡片 */}
        {activeCard === 'detached' && (
          <div className="user-skill-card">
            <Card
              title={
                <div className="card-title">
                  <Space>
                    <DisconnectOutlined style={{ color: '#faad14' }} />
                    <span>未绑定的技能</span>
                    <span className="text-gray-500 text-sm">
                      ({detachSkills.length}项)
                    </span>
                  </Space>
                  <Button
                    type="primary"
                    onClick={() => switchCard('attached')}
                    icon={<SwapOutlined />}
                    className="flex items-center"
                  >
                    查看已绑定技能
                  </Button>
                </div>
              }
              className="user-experience-card"
            >
              <DetachedSkillsModal
                refreshData={refreshData}
                refreshSkillsData={refreshSkillsData} // 传递刷新函数
                user={user}
                detachSkills={detachSkills}
              />
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserSkillsList;
