import React from 'react';
import { useState } from 'react';

import AddUser from './component/add-user';
import Search from './component/search';
import Table from './component/table';
const InformationTest: React.FC=()=> {
  const [data,setData]=useState([]);
  const [total,setTotal]=useState(1);
  const [addUser,setAddUser]=useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); 
  const [search,setSearch]=useState(1);
  function handleSearchData(current: any ,total: number,search: number) {
    setData(current);
    setTotal(total);
    setSearch(search);
  }// search传来的data
  function handleAddUser() {
    setAddUser(true);
  }// 用于调用点击新增用户出现的表单
  function handleTurnOff() {
    setAddUser(false);
  }// 新增后刷新用户数据并关闭表单
  function handleTableData(pagination: any) {
    setPagination(pagination);
  }// Table的页数改变
  return (
    <div>
      <Search searchData={handleSearchData} AddUser={handleAddUser} searchBack={pagination}/>
      <Table  searchData={{data,total,search} }  TableData={handleTableData} TableBack={pagination}/>
      <AddUser turnOn={addUser} turnOff={handleTurnOff}/>
    </div>
  );
};

export default InformationTest;





