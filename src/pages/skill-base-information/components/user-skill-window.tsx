
import { useQuery } from '@apollo/client';
import type { TableProps } from 'antd';
import { Modal, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { apolloClient } from '@/apis/client';
import { GET_USER_SKILLS } from '@/pages/graphql/skill';
import type { SimpUserType } from '@/pages/simp-user-base-information/models/simpUserType';

import type { SkillType } from '../models/skillType';
import DeleteUserSkillButton from './user-skill-delete';

interface SkillModalProps {
  visible: boolean;
  onCancel: () => void;
  user: SimpUserType;
  skills: SkillType[];
  onSkillDeleted?: () => void; // 可选的回调函数，用于通知父组件技能已被删除
}


// eslint-disable-next-line max-len
const SkillModal: React.FC<SkillModalProps> = ({ visible, onCancel, user , onSkillDeleted}) => {
  
    // eslint-disable-next-line no-redeclare
    const [skills, setSkills] = useState<SkillType[]>([]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refetchRef = useRef<any>();
    // 使用 useQuery 获取技能数据，并获取 refetch 函数
  const { data, refetch } = useQuery(GET_USER_SKILLS, {
    variables: { userId: user.id },
    client: apolloClient,
    fetchPolicy: 'no-cache',
    
    onCompleted: (data) => {
      setSkills(data.getUserSkills);
    },
    onError: (error) => {
      console.error('Error fetching skills:', error);
    },
    
  });
  console.log(data);

  // 将 refetch 函数存储在一个 ref 中，以便后续使用
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (visible && user.id) {
      refetch(); // 初始加载数据
    }
  }, [visible, user.id, refetch]);

  const handleSkillDeleted = async () => {
    if (refetchRef.current) {
      await refetchRef.current(); // 在技能删除成功后重新获取数据
    }
    if (onSkillDeleted) {
      onSkillDeleted(); // 通知父组件技能已被删除
    }
  };



  // 使用 date-fns 进行日期格式化
  const columns: TableProps<SkillType>['columns'] = [
    {
      title: '技能名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    //   render: (text) => <a>{text}</a>,
    },
    {
      title: '技能描述',
      dataIndex: 'description',
      key: 'description',
    },

    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        // _ 表示当前行的索引，但在这种情况下没有使用。
        // record 表示当前行的数据对象，包含了用户的信息
        render: (_, record) => (
          <Space  size="middle" >
           <DeleteUserSkillButton
            userId={user.id} // 用户 ID
            skillId={record.id} // 技能 ID
            onDeleted={handleSkillDeleted} // 将 onSkillDeleted 回调函数传递给 DeleteUserSkillButton 组件
            
          />
          </Space>
        ),
      },
  ];
  
  return (
    <Modal
      title={`${user.name} 的技能`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800} // 设置 Modal 的宽度
    >
    <Table columns={columns} dataSource={skills} />

      
    </Modal>
  );
};

export default SkillModal;