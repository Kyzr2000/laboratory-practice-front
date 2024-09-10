
import '../user-base-information.scss';

import { useQuery } from '@apollo/client';
import type { TableColumnsType } from 'antd';
import { Space, Table } from 'antd';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { apolloClient } from '@/apis/client';
import { triggerRefreshGlobalAtom } from '@/pages/atom/triggerRefreshAtom';
import { Find_ALL_SIMPLIFIED_USERS_QUERY } from '@/pages/graphql/simp-user';

import type { SimpUserType } from '../models/simpUserType';
import {currentPageAtom, pageSizeAtom, simpUsersAtom, totalRecordsAtom } from './atom/pageAtom';
import { accountAtom, nameAtom } from './atom/searchAtom';
import { triggerRefreshAtom } from './atom/triggerRefresh';
import DeleteUserButton from './table-delete-user';
import EditUserButton from './table-update-user';

interface Props {
  onSearch?: (users: SimpUserType[]) => void;
}

const SimpUserTableList: React.FC<Props> = ({ onSearch }) => {

  // 获取当前在第几页
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  // 获取每页的数据量
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);
  // 获取当前页面的数据
  const [simpUsers, setSimpUsers] = useRecoilState(simpUsersAtom);
  // 获取总记录数
  const [totalRecords, setTotalRecords] = useRecoilState(totalRecordsAtom);

  const [recoilAccount] = useRecoilState(accountAtom);
  const [recoilName] = useRecoilState(nameAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [triggerRefresh, setTriggerRefresh] = useRecoilState(triggerRefreshAtom);
  // 全局刷新有效
  const [triggerRefreshGlobal] = useRecoilState(triggerRefreshGlobalAtom);




  // 获取gql查询的数据
  const { data, loading, error , refetch } = useQuery(Find_ALL_SIMPLIFIED_USERS_QUERY, {
    variables: {
      searchAllSimplifiedUsersInput: {
        page: currentPage,
        pageSize: pageSize,
        account: recoilAccount.trim() === '' ? null : recoilAccount,
        name: recoilName.trim() === '' ? null : recoilName,
      },
    },
    client: apolloClient, // 使用Apollo Client实例
    // skip: false, 
    fetchPolicy: 'no-cache',  // 不从缓存获取，从网络获取
    onError: (error) => console.error('GraphQL Error:', error),
  });
  // console.log(data);


   // 使用了 useEffect 钩子来处理从后端获取的数据，并在每次状态改变时重新获取数据  
  useEffect(() => {
    if (data) {
      setSimpUsers(data.allSimplifiedUsers.users); // 更新数据
      setTotalRecords(data.allSimplifiedUsers.total || 0);
    }
    // refetch();
  }, [data, triggerRefresh, setSimpUsers, setTotalRecords, refetch]);

  useEffect(() => {
      // console.log('Triggered refetch.');
      refetch(); // 当 triggerRefresh 改变时，重新执行查询
  }, [triggerRefresh,triggerRefreshGlobal,refetch]);
  // console.log(triggerRefresh);
  


 
  useEffect(() => {
    if (onSearch) {
      onSearch(simpUsers);
    }
  }, [simpUsers, onSearch]);

  if (loading) return null;
  if (error) return `Error! ${error}`;

  // 分页
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    refetch({ // 重新获取数据
      searchAllSimplifiedUsersInput: {
        page: page,
        pageSize: pageSize,
        account: recoilAccount,
        name: recoilName,
      },
    });
  };

  
  // console.log(simpUsers);

  // 序列号生成渲染 因为Table 组件的 render 函数默认接受三个参数，
  // 而第一个参数通常表示单元格的值，__: 这个参数被定义为 SimpUserType 类型这两个都不需要
  // index: 这个参数表示当前行在当前页面中的索引位置，从 0 开始计数。
  const SerialNumber = (_: undefined, __: SimpUserType, index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  // 转换男女
  const genderMapping = {
    F: '女',
    M: '男',
  };


  // // 编辑
  const handleEditSuccess = () => {
    refetch();
  };

  // 删除
  const handleDeleteSuccess = () => {
    // 当删除成功时重新获取数据
    refetch();
  };


  const columns: TableColumnsType<SimpUserType> = [
    {
      title: '序号',
      // 唯一的索引列
      dataIndex: 'id',
      key: '0',
      width: 40,
      render: SerialNumber,
    },
    {
      title: 'ID',
      // 唯一的索引列
      dataIndex: 'id',
      key: '1',
      width: 40,
    },
    {
      title: '账户',
      dataIndex: 'account',
      key: '2',
      width: 60,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: '3',
      width: 60,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: '4',
      width: 50,
      // 使用类型断言确保 gender 的类型正确接收性别值:
      // 接收一个类型为 string 的 gender 参数，它来自数据源。
      // 类型断言:
      // 使用类型断言 (gender as keyof typeof genderMapping) 确保 TypeScript 知道 gender 的类型实际上是 'F' | 'M'。
      // 查找映射表:
      // 使用 gender 作为索引去查找 genderMapping 对象中的值。genderMapping 对象是预先定义好的，其中包含了 'F' 和 'M' 的映射。
      // 返回值:
      // 如果 gender 的值存在于 genderMapping 中，就返回相应的中文文本（如 '女' 或 '男'）。
      // 如果 gender 的值不存在于 genderMapping 中，就返回 '未知'。
      render: (gender: string) => genderMapping[gender as keyof typeof genderMapping] || '未知',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: '5',
      width: 50,
    },
    {
      title: '是否启用',
      dataIndex: 'is_enabled',
      key: '6',
      fixed: 'right',
      width: 50,
      render:(is_enabled: boolean)=>(is_enabled?'是':'否')
    },
    {
      title: '所在单位',
      key: '5', // 使用 key 而不是 dataIndex
      width: 50,
      render: (record) => {
        // 从 record 中获取 unitName
        return record.unit?.unitName || '未分配';
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      // _ 表示当前行的索引，但在这种情况下没有使用。
      // record 表示当前行的数据对象，包含了用户的信息
      render: (_, record) => (
        <Space  size="middle" >
          <EditUserButton userId={record.id} onEdited={handleEditSuccess} initialValues={record} />
          {/* userId 属性传递了当前行用户的数据中的 id。
          onDeleted 属性传递了 handleDeleteSuccess 函数，当删除操作成功时，这个函数会被调用。 */}
          <DeleteUserButton userId={record.id} onDeleted={handleDeleteSuccess} />
        </Space>
      ),
    },
  ];
  
  



  return (
    <div>
      <Table 
      columns={columns} 
      // dataSource={data.allSimplifiedUsers.users} 
      dataSource={simpUsers} 
      scroll={{ x: 1000}} 
      pagination={{
        current: currentPage,
        pageSize,
        total: totalRecords, // 总记录数
        showSizeChanger: true, // 显示每页显示数量的选择
        pageSizeOptions: ['10', '20', '50'],
        onChange: onPageChange,
      }}
      
      />
    </div>
  );
    
};

export default SimpUserTableList;