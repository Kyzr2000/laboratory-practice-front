import React, { useState } from 'react';

import type { SearchUserInput } from '../type';
import AddUser from './AddUser';

interface UserManagementHeaderProps {
  setSearchInput: React.Dispatch<React.SetStateAction<SearchUserInput>>;
  setAddTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserManagementHeader = ({
  setSearchInput,
  setAddTrigger,
  setSearchTrigger,
}: UserManagementHeaderProps) => {
  const [localSearch, setLocalSearch] = useState({
    username: '',
    realname: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.realname === '' && localSearch.username === '') return;
    // 更新父组件的搜索输入
    setSearchInput({
      username: localSearch.username.trim(),
      realname: localSearch.realname.trim(),
    });
  };

  const handleClear = () => {
    if (!(localSearch.realname === '' && localSearch.username === '')) {
      setLocalSearch({
        username: '',
        realname: '',
      });
      // 清空搜索时重置搜索条件
      setSearchInput({
        username: '',
        realname: '',
      });
      setSearchTrigger(true);
    }
  };

  return (
    <div className="users-header">
      <form className="header-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="请输入账号"
          name="username"
          onChange={handleChange}
          value={localSearch.username}
          className="search-input"
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="请输入姓名"
          name="realname"
          onChange={handleChange}
          value={localSearch.realname}
          className="search-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          搜索
        </button>
        <button type="button" className="clear-button" onClick={handleClear}>
          ❌
        </button>
      </form>

      <AddUser setAddTrigger={setAddTrigger} />
    </div>
  );
};

export default UserManagementHeader;
