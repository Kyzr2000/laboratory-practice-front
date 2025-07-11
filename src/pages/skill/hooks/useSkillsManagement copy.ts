import { useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import {
  CREATE_SKILL,
  UPDATE_SKILL,
  DELETE_SKILL,
  DETACH_SKILL_FROM_USER,
  ATTACH_SKILL_TO_USER,
} from '../graphql/mutations';
import { GET_SKILL_BY_ID, GET_SKILLS } from '../graphql/querise';
import type {
  Skill,
  CreateSkillInput,
  UpdateSkillInput,
  SkillsQueryResult,
} from '../type';
import { message } from 'antd';

type PaginationConfig = {
  current: number;
  pageSize: number;
  total: number;
};

type ModalState = {
  user: boolean;
  edit: boolean;
  create: boolean;
};

export const useSkillsManagement = (initialPageSize = 10) => {
  // 核心状态分组管理
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // 模态框状态分组
  const [modals, setModals] = useState<ModalState>({
    user: false,
    edit: false,
    create: false,
  });

  // 防抖处理
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 获取技能列表
  const [getSkills, { loading, error, refetch: refetchSkills }] = useLazyQuery<{
    getSkills: SkillsQueryResult;
  }>(GET_SKILLS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.getSkills) {
        setSkills(data.getSkills.skills || []);
        setPagination((prev) => ({
          ...prev,
          total: data.getSkills.total || 0,
        }));
      }
    },
    onError: (err) => message.error(`获取技能失败: ${err.message}`),
  });

  // 获取单个技能详情
  const [
    getSkillById,
    { data: skillByIdData, loading: skillByIdLoading, refetch: refetchSkillById },
  ] = useLazyQuery(GET_SKILL_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });

  // 数据获取副作用
  useEffect(() => {
    getSkills({
      variables: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: debouncedSearchTerm,
      },
    });
  }, [pagination, debouncedSearchTerm, getSkills]);

  // 技能详情获取
  useEffect(() => {
    if (selectedSkill && modals.edit) {
      getSkillById({
        variables: { skillId: selectedSkill.id },
      });
    }
  }, [selectedSkill, modals.edit, getSkillById]);

  // 操作函数统一使用 useCallback 优化
  const handlePageChange = useCallback((current: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current, pageSize }));
  }, []);

  const openModal = useCallback((type: keyof ModalState, skill?: Skill) => {
    setModals((prev) => ({ ...prev, [type]: true }));
    if (skill) setSelectedSkill(skill);
  }, []);

  const closeModal = useCallback((type: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  }, []);

  // CRUD 操作
  const [createSkill] = useMutation(CREATE_SKILL, {
    onCompleted: () => {
      refetchSkills();
      closeModal('create');
      message.success('技能创建成功');
    },
    onError: (err) => message.error(`创建失败: ${err.message}`),
  });

  const [updateSkill] = useMutation(UPDATE_SKILL, {
    onCompleted: () => {
      refetchSkills();
      closeModal('edit');
      message.success('技能更新成功');
    },
    onError: (err) => message.error(`更新失败: ${err.message}`),
  });

  const [deleteSkill] = useMutation(DELETE_SKILL, {
    onCompleted: () => {
      refetchSkills();
      message.success('技能删除成功');
    },
    onError: (err) => message.error(`删除失败: ${err.message}`),
  });

  const [detachUserFromSkill] = useMutation(DETACH_SKILL_FROM_USER, {
    onCompleted: () => {
      refetchSkills();
      if (selectedSkill) refetchSkillById();
      message.success('用户解绑成功');
    },
    onError: (err) => message.error(`解绑失败: ${err.message}`),
  });

  const [attachUserToSkill] = useMutation(ATTACH_SKILL_TO_USER, {
    onCompleted: () => {
      refetchSkills();
      if (selectedSkill) refetchSkillById();
      message.success('用户绑定成功');
    },
    onError: (err) => message.error(`绑定失败: ${err.message}`),
  });

  // 操作封装
  const handleCreateSkill = useCallback(
    (input: CreateSkillInput) => {
      createSkill({ variables: { input } });
    },
    [createSkill],
  );

  const handleUpdateSkill = useCallback(
    (id: number, input: UpdateSkillInput) => {
      updateSkill({ variables: { skillId: id, input } });
    },
    [updateSkill],
  );

  const handleDeleteSkill = useCallback(
    (id: number) => {
      deleteSkill({ variables: { skillId: id } });
    },
    [deleteSkill],
  );

  const handleDetachUser = useCallback(
    (skillId: number, userId: number) => {
      detachUserFromSkill({ variables: { skillId, userId } });
    },
    [detachUserFromSkill],
  );

  const handleAttachUser = useCallback(
    (skillId: number, userId: number) => {
      attachUserToSkill({ variables: { skillId, userId } });
    },
    [attachUserToSkill],
  );

  return {
    // 状态
    skills,
    pagination,
    searchTerm,
    selectedSkill,
    modals,
    skillDetails: skillByIdData?.getSkillById,

    // 加载状态
    loading,
    error,
    skillDetailsLoading: skillByIdLoading,

    // 操作方法
    setSearchTerm,
    handlePageChange,
    openModal,
    closeModal,
    setSelectedSkill,
    handleCreateSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    handleDetachUser,
    handleAttachUser,
    refetchSkills,
  };
};
