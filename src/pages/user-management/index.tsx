import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Pagination } from 'antd';

import UserManagementHeader from './components/UserManagementHeader';
import UserManagementTable from './components/UsermanagementTable';

import './userManagement.scss';
import { SEARCH_USER } from './graphql/queries';
import type { SearchUserInput, User } from './type';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [addTrigger, setAddTrigger] = useState(false);
  const [changeTrigger, setChangeTrigger] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [searchInput, setSearchInput] = useState<SearchUserInput>({
    username: '',
    realname: '',
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 修改查询添加分页参数
  const [getUsers, { loading, error, data }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only',
    variables: {
      searchUserInput: searchInput,
      page: currentPage,
      pageSize: pageSize,
    },
  });

  // 初始数据获取
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // 当搜索条件变化时重置到第一页
  useEffect(() => {
    // 当搜索条件变化时，重置到第一页
    if (searchInput.username || searchInput.realname) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  // 数据变化时重新获取
  useEffect(() => {
    if (
      deleteTrigger ||
      addTrigger ||
      changeTrigger ||
      searchTrigger ||
      searchInput.username ||
      searchInput.realname
    ) {
      // 重置到第一页
      if (
        deleteTrigger ||
        addTrigger ||
        changeTrigger
        // || searchTrigger
      ) {
        setCurrentPage(1);
      }

      // 确保使用最新的分页参数
      getUsers({
        variables: {
          searchUserInput: searchInput,
          page: currentPage,
          pageSize: pageSize,
        },
      });

      setDeleteTrigger(false);
      setAddTrigger(false);
      setChangeTrigger(false);
      // setSearchTrigger(false);
    }
  }, [
    deleteTrigger,
    addTrigger,
    changeTrigger,
    searchTrigger,
    searchInput,
    getUsers,
    currentPage,
    pageSize,
  ]);

  // 更新用户数据
  useEffect(() => {
    if (data && data.searchUser) {
      setUsers(data.searchUser.users || []);
      setTotal(data.searchUser.total || 0);
    }
  }, [data]);

  // 处理分页变化
  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) {
      setPageSize(newPageSize);
    }
  };

  return (
    <div
      className="user-management-container"
      style={{
        position: 'relative',
        minHeight: '710px',
        paddingBottom: '50px',
      }}
    >
      <UserManagementHeader
        setSearchTrigger={setSearchTrigger}
        setAddTrigger={setAddTrigger}
        setSearchInput={setSearchInput}
      />
      <UserManagementTable
        users={users}
        loading={loading}
        error={error}
        setChangeTrigger={setChangeTrigger}
        setDeleteTrigger={setDeleteTrigger}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      {/* 分页组件 - 固定在右下角 */}
      {totalPages > 1 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            padding: '10px',
            marginRight: '10px',
            marginBottom: '10px',
            boxShadow: '0 2px 0 3px rgba(62 136 62/ 20%);',
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={(_, size) => setPageSize(size)}
          />
        </div>
      )}
    </div>
  );
};
export default UserManagement;
