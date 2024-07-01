import './user-base-information.scss';

import { useQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { GET_USER_BASE_INFORMATION_LIST } from '@/apis';


import AddUser from './components/add-user.jsx';
import Search from './components/search.jsx';
import UserTable from './components/user-table.jsx';
import UpdateUserModal from './components/update-user-modal';
import type { QueryData, TableData, User } from './type';




export default function UserInformation() {
  const [users, setUsers] = useState<User[]>([]); // 页面数据
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页面
  const [totalCount, setTotalCount] = useState<number>(1); // 数据总个数
  const [open, setUpdateUserOpen] = useState(false);

  const [userId, setUserId] = useState<number | null>(null);
  const [searchData, setSearchData] = useState<{
    username?: string;
    realname?: string
  }>({});
  const pageNumber = useRef<number>(10); // 每页显示的数量

  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const { loading, refetch: getUserBaseInformationForTableData } = useQuery<
    TableData,
    QueryData
  >(GET_USER_BASE_INFORMATION_LIST, {
    variables: {
      data:{
        currentPage: currentPage,
        pageNumber: pageNumber.current
      }      
    },
    onCompleted(data: TableData) {
      console.log('数据获取请求完成');
      console.log(data);
      const { userTotalCount, getUserBaseInformationList: userList } = data || {};
      if (userTotalCount) setTotalCount(userTotalCount);
      setUsers(userList);
    },
    onError(error) {
      console.log('数据获取请求发生错误');
      message.error('数据获取请求发生错误！！！');
      console.log(error);
    },
  });


  const pageAllCount = useMemo(() => {
    return Math.ceil(totalCount / pageNumber.current);
  }, [totalCount,pageNumber]);

  // 当页码发生变化、查询条件发生变化时，重新进行数据查询
  useEffect(() => {
    if (isQuerying) { // 有时页面和查询数据会同时发生变化，为了防止短时间查询两次，使用isQuerying限制查询次数，避免无效查询
      getUserBaseInformationForTableData({
        data:{
          currentPage,
          pageNumber:pageNumber.current,
          realname: searchData.realname ? searchData.realname : undefined,
          username: searchData.username ? searchData.username : undefined,
        }
      });
    }
    setIsQuerying(false);
  },[getUserBaseInformationForTableData, isQuerying, pageNumber, currentPage, searchData]);




  return (
    <div className='user-information'>
      <div className='top-bar'>
        <Row>
          <Col className='top-bar-left' span={12}>
            <Search 
              setSearchData={setSearchData}
              setCurrentPage={setCurrentPage}
              setIsQuerying={setIsQuerying}
            >
            </Search>
          </Col>
          <Col className='top-bar-right' span={12}>
            <AddUser
              setUpdateUserOpen={setUpdateUserOpen}
            ></AddUser>
          </Col>
        </Row>
      </div>
      <div className='table-box'>
        <UserTable
          users={users}
          totalCount={totalCount}  // 总共有多少个数据条数
          loading={loading}  
          currentPage={currentPage} // 当前所在的页码
          pageNumber={pageNumber}   // 每一页所包含的数据条数
          pageAllCount={pageAllCount} // 总共有多少页
          setCurrentPage={setCurrentPage}
          setIsQuerying={setIsQuerying}
          setUpdateUserOpen={setUpdateUserOpen}
          setUserId={setUserId}
        >
        </UserTable>
      </div>
      <UpdateUserModal
        open={open}
        setUpdateUserOpen={setUpdateUserOpen}
        userId={userId}
        setUserId={setUserId}
        setCurrentPage={setCurrentPage}
        setIsQuerying={setIsQuerying}
      ></UpdateUserModal>
    </div>
  );
}

