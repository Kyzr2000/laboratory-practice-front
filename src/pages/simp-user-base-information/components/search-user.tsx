/* eslint-disable max-len */
import { useLazyQuery } from '@apollo/client';
import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';

import { SEARCH_SIMPLIFIED_USERS_BY_ACCOUNT_AND_NAME } from '@/pages/graphql/simp-user';

import { currentPageAtom, pageSizeAtom, simpUsersAtom, totalRecordsAtom } from './atom/pageAtom';
import { accountAtom, nameAtom } from './atom/searchAtom';

interface SearchSimplifiedUsersByAccountAndNameInput {
  account: string;
  name: string;
  page: number;
  pageSize: number;
}

const SearchUsers: React.FC = () => {

  // 获取当前在第几页
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  // 获取每页的数据量
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);
  // 获取当前页面的数据
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [simpUsers, setSimpUsers] = useRecoilState(simpUsersAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalRecords, setTotalRecords] = useRecoilState(totalRecordsAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoilAccount, setRecoilAccount] = useRecoilState(accountAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoilName, setRecoilName] = useRecoilState(nameAtom);
  
  
  // 使用局部状态来存储输入框的初始值为空
  const [localAccount, setLocalAccount] = useState('');
  const [localName, setLocalName] = useState('');
  const [searchSimplifiedUsersByAccountAndName, { data }] = useLazyQuery(SEARCH_SIMPLIFIED_USERS_BY_ACCOUNT_AND_NAME);


  // 在输入框中输入时更新Recoil状态   
  // 关键代码   当输入框的值变为空的时候 才设置atom中账户和姓名为空，
  //  不为空时不设置 这样避免了输入库中输入值自动重新查询更新用户列表
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>, state: string) => {

    const value = e.target.value.trim();
    setState(value);
    if (state === 'account' && value === '') {
      setRecoilAccount('');
    } else if (state === 'name' && value === '') {
      setRecoilName('');
    }
    
    
  };

  const handleSearch = () => {
    if (!localAccount.trim() && !localName.trim()) {
      alert('请至少输入账户或姓名中的一个');
      return;
    }
    // 更新Recoil状态   出现的问题 输入框值变动 自动搜索， 问题2： 搜索组件接口搜出来的数据 点击分页时会自动取消，因为分页在用户列表组件，点分页重新加载用户列表接口数据
    // 因此点击搜索 就要更新atom 这样列表组件接口重新加载 就是带有 账户和姓名两个条件的（从atom中获取）
    // 在点击搜索的时候 才去更新atom中的account和name为输入框的值， 这样点击搜索了才会重新加载数据
    // 
    setRecoilAccount(localAccount.trim());
    setRecoilName(localName.trim());

    // 确定返回第一页
    setCurrentPage(1);

    const searchInput: SearchSimplifiedUsersByAccountAndNameInput = {
      account: localAccount.trim(),
      name: localName.trim(),
      page: currentPage,
      pageSize: pageSize,
    };
    searchSimplifiedUsersByAccountAndName({ variables: { searchSimplifiedUsersByAccountAndNameInput: searchInput } });
  };


  useEffect(() => {
    if (data?.searchSimplifiedUsersByAccountAndNameInput) {
      // 解析数据
      setSimpUsers(data.searchSimplifiedUsersByAccountAndNameInput.users); // 更新数据
      setTotalRecords(data.searchSimplifiedUsersByAccountAndNameInput.total);
      // refetch(); 
    }
  }, [data, setSimpUsers, setTotalRecords]);
  
  // 在组件挂载时检查输入框的值
  useEffect(() => {
    if (localAccount.trim() === '' && localName.trim() === '') {
      setRecoilAccount('');
      setRecoilName('');
    }
  }, [localAccount, localName, setRecoilAccount, setRecoilName]); // 添加依赖数组

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
      <Input placeholder="账户" value={localAccount} onChange={(e) => handleInputChange(e, setLocalAccount, 'account')} />
        <Input placeholder="姓名" value={localName} onChange={(e) => handleInputChange(e, setLocalName, 'name')} />
        <Button type="primary" onClick={handleSearch}>
          搜索
        </Button>
      </Space>
    </Space>
  );
};

export default SearchUsers;