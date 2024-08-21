import { gql, useMutation, useQuery } from '@apollo/client';
import type { TableProps } from 'antd';
import { Button, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { currentAtom, pageSizeAtom } from '@/atom/atom';

import { ModalVisible } from './atom/ModalVisible';
import type { DataType } from './atom/UsersManagement';
import {
  accountAtom, selectState, userAtom, usersAtom
} from './atom/UsersManagement';

const DEL_MANAGEMENT = gql`
  mutation DelUser($id:Int!){
    deleteUser(userId:$id){
    id
    account
    name
    age
    gender
    is_enabled
    }
  }
`;

export const GET_MANAGEMENT = gql`
  query GetUsers($page:Int!,$pageSize:Int!,$account:String,$isEnabled:Boolean){
    getUsers(page:$page,pageSize:$pageSize,account:$account,isEnabled:$isEnabled){
     users {
      id
      account
      name
      gender
      age
      is_enabled
      unitName
    }
    total
    }
  }
`;

const TableSelect: React.FC = () => {
  const setIsModalVisible = useSetRecoilState(ModalVisible);
  const [current, setCurrent] = useRecoilState(currentAtom);
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);
  // const [current, setCurrent] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const setUser = useSetRecoilState(userAtom);
  const isEnabled = useRecoilValue(selectState);
  const account = useRecoilValue(accountAtom);

  const { loading, error, data, refetch } = useQuery(GET_MANAGEMENT,
    {
      variables: {
        page: current, pageSize: pageSize, account,
        isEnabled: isEnabled === 'start' ? true : isEnabled === 'end' ? false : undefined
      },
    });


  const [deleteUser] = useMutation(DEL_MANAGEMENT);

  const setUsers = useSetRecoilState(usersAtom);


  useEffect(() => {
    if (data) {
      setUsers(data.getUsers.users);
      setTotal(data.getUsers.total);
    }
  }, [data, setUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const showModal = (record: DataType) => {
    setIsModalVisible(true);
    setUser(record);
  };

  const delUser = async ({ id }: DataType) => {
    if (id) {
      await deleteUser({
        variables: {
          id: id,
        },
        refetchQueries: [{
          query: GET_MANAGEMENT,
          variables: {
            page: current,
            pageSize,
            account,
            isEnabled: isEnabled === 'start' ? true : isEnabled === 'end' ? false : undefined,
          },
        }],
      });
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: <span style={{ color: '#038A97' }}>序号</span>,
      dataIndex: 'id',
      key: 'name',
      width: 150,
      align: 'center' as 'center',
      render: (_: undefined, __: DataType, index: number) =>
        1001 + index + (current - 1) * pageSize,

    },
    {
      title: <span style={{ color: '#038A97' }}>账号</span>,
      dataIndex: 'account',
      key: 'account',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>姓名</span>,
      dataIndex: 'name',
      key: 'name',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>性别</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>年龄</span>,
      dataIndex: 'age',
      key: 'age',
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>公司</span>,
      dataIndex: 'unit_name',
      key: 'unit_name',
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>是否启用</span>,
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      align: 'center' as 'center',
      render: (text: boolean) => (text ? '启用' : '禁用'),
    },
    {
      title: <span style={{ color: '#038A97' }}>操作</span>,
      key: 'action',
      width: 250,
      align: 'center' as 'center',
      render: (record) => (
        <Space size="middle">
          <Button type="primary" onClick={
            () => showModal(record)}
            style={{ backgroundColor: 'green', borderColor: 'green' }}>编辑</Button>
          <Button type="primary" onClick={() => delUser(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const managementData: DataType[] =
    data?.getUsers.users.map((item: DataType) => ({
      key: item.id,
      id: item.id,
      account: item.account,
      name: item.name,
      gender: item.gender,
      age: item.age,
      is_enabled: item.is_enabled,
      unit_name: item.unitName,
    })) || [];

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    refetch({
      page: pagination.current,
      pageSize: pagination.pageSize,
      account,
      isEnabled: isEnabled === 'start' ? true : isEnabled === 'end' ? false : undefined
    });
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Table columns={columns} dataSource={managementData}
          pagination={{ current, pageSize, total }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default TableSelect;