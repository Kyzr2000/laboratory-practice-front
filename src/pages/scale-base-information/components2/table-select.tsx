import { gql, useMutation, useQuery } from '@apollo/client';
import type { TableProps } from 'antd';
import { Button, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ModalVisible } from './atom/ModalVisible';
import type { DataType } from './atom/UsersManagement';
import { userAtom, usersAll, usersAtom } from './atom/UsersManagement';
import { filteredUser } from './selector/FilteredUser';

export const GET_MANAGEMENT = gql`
 query GetUsers($page:Int!,$pageSize:Int!){
  getUsers(page:$page,pageSize:$pageSize) {
    id
    account
    name
    gender
    age
    is_enabled
  }
}`;

export const GET_USERS_ALL = gql`
 query {
  getUsersAll{
    id
    account
    name
    gender
    age
    is_enabled
  }
}`;

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

const TableSelect: React.FC = () => {
  const setIsModalVisible = useSetRecoilState(ModalVisible);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const setUser = useSetRecoilState(userAtom);
  const { loading, error, data } = useQuery(GET_MANAGEMENT, {
    variables: { page: current, pageSize: pageSize }
  });

  // const { data: countData } = useQuery(GET_USERS_COUNT);
  const { data: allData } = useQuery(GET_USERS_ALL);

  const [deleteUser] = useMutation(DEL_MANAGEMENT);

  const setUsers = useSetRecoilState(usersAtom);
  const setUsersAll = useSetRecoilState(usersAll);

  const filteredUsers = useRecoilValue(filteredUser);

  useEffect(() => {
    if (data) {
      setUsers(data.getUsers);
    }
    if (allData) {
      setUsersAll(allData.getUsersAll);
    }
  }, [data, allData, setUsers, setUsersAll]);

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
          id: id
        },
        refetchQueries: [{ query: GET_MANAGEMENT }]
      });
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'name',
      width: 150,
      align: 'center' as 'center',
      render: (_: undefined, __: DataType, index: number) =>
        1001 + index + (current - 1) * pageSize,
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center' as 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      align: 'center' as 'center',
    },
    {
      title: '是否启用',
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      align: 'center' as 'center',
      render: (text: boolean) => (text ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      align: 'center' as 'center',
      render: (record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>编辑</Button>
          <Button type="danger" onClick={() => delUser(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const managementData: DataType[] =
    filteredUsers.slice((current - 1) * pageSize, current * pageSize).map((item: DataType) => ({
      key: item.id,
      id: item.id,
      account: item.account,
      name: item.name,
      gender: item.gender,
      age: item.age,
      is_enabled: item.is_enabled,
    }));

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Table columns={columns} dataSource={managementData}
          pagination={{ current, pageSize, total: filteredUsers.length }}
          onChange={handleTableChange} />
      </div>
    </div>
  );
};

export default TableSelect;