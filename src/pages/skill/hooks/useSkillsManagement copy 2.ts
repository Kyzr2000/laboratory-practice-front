import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useLazyQuery } from '@apollo/client';

import { GET_SKILL_BY_ID, GET_SKILLS } from '../graphql/querise';

import type {
  // CreateSkillInput,
  Skill,
  SkillsQueryResult,
  // UpdateSkillInput,
} from '../type';

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  const [searchParams, setSearchParams] = useState('');
  const [debouncedSearchParams, setDebouncedSearchParams] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [modals, setModals] = useState<ModalState>({
    user: false,
    edit: false,
    create: false,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchParams(searchParams);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchParams]);

  const [getSkills, { data: skillsData, loading, error, refetch: refetchSkills }] =
    useLazyQuery<{
      getSkills: SkillsQueryResult;
    }>(GET_SKILLS, {
      fetchPolicy: 'cache-and-network',
      variables: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        skillName: debouncedSearchParams,
      },
      onCompleted: (data) => {
        if (data?.getSkills) {
          setSkills(data.getSkills.skills || []);
          setPagination((prev) => ({
            ...prev,
            total: data.getSkills.total,
          }));
        }
      },
      onError: (err) => message.error(`获取技能失败: ${err.message}`),
    });

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    if (skillsData?.getSkills) {
      setSkills(skillsData.getSkills.skills || []);
      setPagination((prev) => ({
        ...prev,
        total: skillsData.getSkills.total || 0,
      }));
    }
  }, [skillsData]);
  useEffect(() => {});

  const [
    getSkillById,
    { data: skillByIdData, loading: skillByIdLoading, refetch: refetchSkillById },
  ] = useLazyQuery(GET_SKILL_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (selectedSkill && modals.edit) {
      getSkillById({
        variables: { skillId: selectedSkill.id },
      });
    }
  }, [selectedSkill, modals.edit, getSkillById]);

  // const handlePageChange = useCallback((current: number, pageSize: number) => {
  //   setPagination((prev) => ({ ...prev, current, pageSize }));
  // }, []);

  // const openModal = useCallback((type: keyof ModalState, skill?: Skill) => {
  //   setModals((prev) => ({ ...prev, [type]: true }));
  //   if (skill) setSelectedSkill(skill);
  // }, []);

  // const closeModal = useCallback((type: keyof ModalState) => {
  //   setModals((prev) => ({ ...prev, [type]: false }));
  // }, []);

  // const [createSkill] = useMutation(CREATE_SKILL, {
  //   onCompleted: () => {
  //     refetchSkills();
  //     closeModal('create');
  //     message.success('技能创建成功');
  //   },
  //   onError: (err) => message.error(`创建失败: ${err.message}`),
  // });

  // const [updateSkill] = useMutation(UPDATE_SKILL, {
  //   onCompleted: () => {
  //     refetchSkills();
  //     closeModal('edit');
  //     message.success('技能更新成功');
  //   },
  //   onError: (err) => message.error(`更新失败: ${err.message}`),
  // });

  // const [deleteSkill] = useMutation(DELETE_SKILL, {
  //   onCompleted: () => {
  //     refetchSkills();
  //     message.success('技能删除成功');
  //   },
  //   onError: (err) => message.error(`删除失败: ${err.message}`),
  // });

  // const [detachUserFromSkill] = useMutation(DETACH_SKILL_FROM_USER, {
  //   onCompleted: () => {
  //     refetchSkills();
  //     if (selectedSkill) refetchSkillById();
  //     message.success('用户解绑成功');
  //   },
  //   onError: (err) => message.error(`解绑失败: ${err.message}`),
  // });

  // const [attachUserToSkill] = useMutation(ATTACH_SKILL_TO_USER, {
  //   onCompleted: () => {
  //     refetchSkills();
  //     if (selectedSkill) refetchSkillById();
  //     message.success('用户绑定成功');
  //   },
  //   onError: (err) => message.error(`绑定失败: ${err.message}`),
  // });

  // const handleCreateSkill = useCallback(
  //   (input: CreateSkillInput) => {
  //     createSkill({ variables: input });
  //   },
  //   [createSkill]
  // );

  // const handleUpdateSkill = useCallback(
  //   (id: number, input: UpdateSkillInput) => {
  //     updateSkill({ variables: { skillId: id, input } });
  //   },
  //   [updateSkill]
  // );

  // const handleDeleteSkill = useCallback(
  //   (id: number) => {
  //     deleteSkill({ variables: { skillId: id } });
  //   },
  //   [deleteSkill]
  // );

  // const handleDetachUser = useCallback(
  //   (skillId: number, userId: number) => {
  //     detachUserFromSkill({ variables: { skillId, userId } });
  //   },
  //   [detachUserFromSkill]
  // );

  // const handleAttachUser = useCallback(
  //   (skillId: number, userId: number) => {
  //     attachUserToSkill({ variables: { skillId, userId } });
  //   },
  //   [attachUserToSkill]
  // );

  return {
    skills,
    pagination,
    searchParams,
    selectedSkill,
    modals,
    skillDetails: skillByIdData?.getSkillById,

    loading,
    error,
    skillDetailsLoading: skillByIdLoading,

    setSearchParams,
    setModals,
    // handlePageChange,
    // openModal,
    // closeModal,
    setSelectedSkill,
    // handleCreateSkill,
    // handleUpdateSkill,
    // handleDeleteSkill,
    // handleDetachUser,
    // handleAttachUser,
    refetchSkills,

    // 测试代码
    refetchSkillById,
  };
};
