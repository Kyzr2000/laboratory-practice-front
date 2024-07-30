import { gql, useQuery } from '@apollo/client';
import type { TableProps } from 'antd';
import { Button, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CREATE from './CREATE';
import DELETE from './DELETE';
import EDIT from './EDIT';
import FIND from './FIND';
import { searchResultsState, table1, table2 } from './recoil';

interface DataType {
  key: string;
  username: string;
  name: string;
  gender: string;
  age: string;
  use: string;
  operate: string;
}

const QUERYUSER = gql`
  query FindUser {
    FindUser {
      username
      password
      name
      gender
      age
      use
    }
  }
`;
const TABLE: React.FC = () => {
  const state = useRecoilValue(table1);
  const [state1, setState1] = useRecoilState(table2);

  const [searchResults, setSearchResults] = useRecoilState(searchResultsState);
  const [showEdit, setEdit] = useState(false);
  const [showDelete, setDelete] = useState(false);
  const [user, setUser] = useState<DataType | null>(null);
  const [duser, setDuser] = useState('');
  const { data, loading, error, refetch } = useQuery(QUERYUSER, {
    fetchPolicy: 'no-cache',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handle = (record: DataType) => {
    setUser(record);
    setEdit(true);
  };
  const handleCancelEdit = () => {
    setEdit(false);
    setUser(null);
  };
  const handleCancelDelete = () => {
    setDelete(false);
  };
  const handleDelete = (username: string) => {
    setDuser(username);
    setDelete(true);
  };
  useEffect(() => {
    refetch();
  }, [state, refetch]);
  useEffect(() => {
    if (searchResults.length === 0) {
      setPagination({
        current: 1,
        pageSize: 10,
      });
    }
  }, [searchResults]);
  useEffect(() => {
    if (searchResults.length !== 0 && state1 !== 0) {
      setSearchResults([]);
      setPagination({
        current: 1,
        pageSize: 10,
      });
      console.log(123);
      setState1(0);
    }
    console.log(searchResults.length, state1);
  }, [searchResults, setSearchResults, setState1, state1]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '账号',
      key: 'username',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
      align: 'center',
    },
    {
      title: '年龄',
      key: 'age',
      dataIndex: 'age',
      align: 'center',
    },
    {
      title: '是否启用',
      key: 'use',
      dataIndex: 'use',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              handle(record);
            }}
            className="Primary"
          >
            编辑
          </Button>
          <Button
            type="primary"
            className="Delete"
            onClick={() => {
              handleDelete(record.username);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const TABLE1 = () => {
    const table =
      searchResults.length > 0
        ? searchResults
        : data.FindUser.map((user: DataType, index: number) => ({
            key: index + 1,
            username: user.username,
            name: user.name,
            gender: user.gender,
            age: user.age,
            use: user.use,
            operate: '',
          }));
    return table;
  };

  return (
    <>
      <Row>
        <FIND />
        <CREATE />
      </Row>
      <br />
      <Table
        columns={columns}
        dataSource={TABLE1()}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize || pagination.pageSize,
            });
          },
        }}
        className="Css"
        style={{ display: ' ' }}
      />
      <EDIT open={showEdit} onCancel={handleCancelEdit} user={user} />
      <DELETE duser={duser} open={showDelete} onCancel={handleCancelDelete} />
    </>
  );
};
export default TABLE;
