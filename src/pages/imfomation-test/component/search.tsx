
import './index.css';

import { useQuery } from '@apollo/client';
import { Button,Input, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';

import { GET_PAGINATED_TEST_DATA, GET_TEST_DATA } from './gql';

interface SearchProps {
  searchData: (data: any[]) => void; // searchData 是一个函数
  searchBack: (data: any[]) => void; // searchData 是一个函数
}// 此处必须定义为函数，不然浏览器报错，所以只能通过这个方法定义
const Search = ({searchData,AddUser,searchBack}: any) => {
  const [filters, setFilters] = useState({ account: '', name: '' });
  const [pages, setPages] = useState({ current: 1, pageSize: 10 });
  const [num,setNum]=useState({num1:0,num2:0,num3:0});
  const { data, loading, refetch } = useQuery(GET_PAGINATED_TEST_DATA, {
    variables: {
      page: pages.current,
      pageSize:pages.pageSize,
    },
  });
  const {data:AllData}=useQuery(GET_TEST_DATA);
  function searchOnclick(filters: any) {
    if (!data || !data.getPaginatedTestData.data) {
      return; 
    }
      let account=filters.account;
      let name=filters.name;
    if (account!=''&&name!='') {
      setNum(prev=>({...prev,num2:0,num3:0}));
    let current=AllData.getTestData;
      current=current.filter( (item: any) => (item.account.includes(account)&&item.name.includes(name)) );
      let total = current.length;
      searchData(current,total,num.num1);
      setNum(prev=>({...prev,num1:1}));
    }
    else if (account==''&&name!='') {
      setNum(prev=>({...prev,num1:0,num3:0}));
      let current=AllData.getTestData;
        current=current.filter( (item: any) => (item.name.includes(name)) );
        let total = current.length;
        searchData(current,total,num.num2);
        setNum(prev=>({...prev,num2:1}));
    }
    else if (account!=''&&name=='') {
      setNum(prev=>({...prev,num1:0,num2:0}));
      var current=AllData.getTestData;
      current=current.filter( (item: any) => (item.account.includes(account)) );
      let total = current.length;
      searchData(current,total,num.num3);
      setNum(prev=>({...prev,num3:1}));
    }
    else if (account==''&&name=='') {
      setNum({num1:0,num2:0,num3:0});
      let current=data.getPaginatedTestData.data;
      let total=data.getPaginatedTestData.total;
      searchData(current,total,pages.current);
    }
  }
  useEffect(()=>{
    if (data && data.getPaginatedTestData) {
      searchOnclick(filters);
    }
   },[data]);// useeffect执行时data还没拿到数据，所以要在data拿到数据改变之后重新调用effect,这是开屏数据的来源
   useEffect(() => {
    if (searchBack) {
      setPages(searchBack);
    }
  }, [searchBack, refetch]);
  return (
  <div className='head-search'>
    <Input placeholder="请输入账号" className='search-input' 
    onChange={(e)=>setFilters(prev => ({ ...prev, account: e.target.value }))}/>

    <Input placeholder="请输入姓名" className='search-input' 
    onChange={(e)=>setFilters(prev => ({ ...prev, name: e.target.value }))}/> 

    <Button type="primary" className='search-button'
     onClick={()=>searchOnclick(filters)}>搜索</Button>
     
    <Button type="primary" className='search-button right-fix' onClick={()=>AddUser()} >新增用户</Button>

  </div>);

};

export default  Search;