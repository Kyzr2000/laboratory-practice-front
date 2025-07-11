import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import type { Experience, SearchExperienceInput } from '../type';
import { FIND_EXPERIENCE } from '../graphql/experienceGql';

export const useExperienceManagement = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [searchParams, setSearchParams] = useState<SearchExperienceInput>({
    name: '',
    username: '',
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [getExperience, { loading, error, data, refetch }] = useLazyQuery(
    FIND_EXPERIENCE,
    {
      fetchPolicy: 'network-only',
      variables: {
        searchInput: searchParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    },
  );

  // 使用 useCallback 包裹 fetchData 函数
  useEffect(() => {
    getExperience();
  }, [getExperience]);

  useEffect(() => {
    if (data?.findExperience) {
      setExperience(data.findExperience.experience || []);
      setPagination((prev) => ({
        ...prev,
        total: data.findExperience.total || 0,
      }));
    }
  }, [data]);

  const handleSearch = useCallback(
    (values: SearchExperienceInput) => {
      setSearchParams(values);
      setPagination((prev) => ({ ...prev, current: 1 }));
      refetch({
        searchInput: values,
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
        searchInput: searchParams,
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
    experience,
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
