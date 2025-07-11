import { useCallback, useEffect, useState } from 'react';
import type { SearchSkillInput, Skill } from '../type';
import { useLazyQuery } from '@apollo/client';
import { GET_SKILLS } from '../graphql/querise';

export const useSkillsManagement = () => {
  // 状态管理
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<SearchSkillInput>({
    skillName: '',
  });

  const [getSkills, { loading, error, data, refetch }] = useLazyQuery(GET_SKILLS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      skillName: searchParams.skillName,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
  });

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    if (data?.getSkills) {
      setSkills(data.getSkills.skills || []);
      setPagination((prev) => ({
        ...prev,
        total: data.getSkills.total || 0,
      }));
    }
  }, [data]);

  const handleSearch = useCallback(
    (values: SearchSkillInput) => {
      setSearchParams(values);
      setPagination((prev) => ({ ...prev, current: 1 }));
      refetch({
        skillName: values.skillName,
        page: 1,
        pageSize: pagination.pageSize,
      });
    },
    [pagination.pageSize, refetch],
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination({ current: page, pageSize, total: pagination.total });
      refetch({
        skillName: searchParams.skillName,
        page,
        pageSize,
      });
    },
    [pagination.total, refetch, searchParams],
  );

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);
  return {
    skills,
    loading,
    error,
    pagination,
    handleSearch,
    handlePaginationChange,
    refreshData,
    searchParams,
    setSearchParams,
  };
};
