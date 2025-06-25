import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_USER } from '../api/userQueries';
import type { SearchUserInput, User } from '../types';

export const useUserManagement = () => {
  // 用户状态
  const [users, setUsers] = useState<User[]>([]);
  const [searchParams, setSearchParams] = useState<SearchUserInput>({
    username: '',
    realname: '',
  });
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [getUsers, { loading, error, data, refetch }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only',
    variables: {
      searchUserInput: searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (data?.searchUser) {
      setUsers(data.searchUser.users || []);
      setPagination((prev) => ({
        ...prev,
        total: data.searchUser.total || 0,
      }));
    }
  }, [data]);

  const handleSearch = useCallback(
    (values: SearchUserInput) => {
      setSearchParams(values);
      setPagination((prev) => ({ ...prev, current: 1 }));
      refetch({
        searchUserInput: values,
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
        searchUserInput: searchParams,
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
    users,
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
