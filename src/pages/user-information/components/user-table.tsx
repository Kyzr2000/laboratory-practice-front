import { useLazyQuery } from '@apollo/client';
import { Table } from 'antd';
import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import type { User } from '../../../interface/USER';
import { GET_ALL_USERS, GET_USER_COUNT } from '../../graphql/query';
import DeleteUserButton from './delete-user';
import UpdateUserButton from './update-user';

export const columnsState = atom({
  key: 'columnsState',
  default: [
    {
      key: '',
      username: '',
      realname: '',
      gender: '',
      age: '',
      isEnable: '',
    },
  ],
});

export const NowPage = atom({
  key: 'NowPage',
  default: 1,
});

export const TotalCount = atom({
  key: 'TotalCount',
  default: 0,
});

export const NoMainModel = atom({
  key: 'NoMainModel',
  default: false,
});

export const tmpUserData = atom({
  key: 'tmpUserData',
  default: [
    {
      username: null as string | null | undefined,
      realname: null as string | null | undefined,
    },
  ],
});

// const CustomTableHearderCell = ({ children }) => {
//     return <th style={{ color: '#038A97', height: '40px',textAlign: 'center' }}>{children}</th>;
// };

function UserTable() {
  const [dataSource, setDataSource] = useRecoilState(columnsState);
  const [pages, setPages] = useRecoilState(NowPage);
  const [userCount, setUserCount] = useRecoilState(TotalCount);
  const IfNowMain = useRecoilValue(NoMainModel);
  const tmpUser = useRecoilValue(tmpUserData);
  const [getUsers, { data: data }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only',
  });
  const [getUserCount, { data: data1 }] = useLazyQuery(GET_USER_COUNT, {
    fetchPolicy: 'network-only',
  });

  const columns = [
    {
      title: <div style={{ color: '#038A97' }}>序号</div>,
      dataIndex: 'num',
      className: 'User-columns',
      align: 'center',
      render: (text, record, index) => `${(pages - 1) * 10 + index + 1}`,
    },
    {
      title: <div style={{ color: '#038A97' }}>账号</div>,
      dataIndex: 'username',
      className: 'User-columns',
      align: 'center',
      render: (text: string) => {
        if (!text) return <div>---</div>;
        else {
          return <div>{text}</div>;
        }
      },
    },
    {
      title: <div style={{ color: '#038A97' }}>姓名</div>,
      dataIndex: 'realname',
      className: 'User-columns',
      align: 'center',
      render: (text: string) => {
        if (!text) return <div>---</div>;
        else {
          return <div>{text}</div>;
        }
      },
    },
    {
      title: <div style={{ color: '#038A97' }}>性别</div>,
      className: 'User-columns',
      dataIndex: 'gender',
      align: 'center',
      render: (text: number) => {
        if (!text) return <div>无数据</div>;
        else {
          if (text === 1) return <div>男</div>;
          else {
            return <div>女</div>;
          }
        }
      },
    },
    {
      title: <div style={{ color: '#038A97' }}>年龄</div>,
      className: 'User-columns',
      dataIndex: 'age',
      align: 'center',
      render: (text: number) => {
        if (!text) return <div>无数据</div>;
        else return <div>{text}</div>;
      },
    },
    {
      title: <div style={{ color: '#038A97' }}>是否启用</div>,
      className: 'User-columns',
      dataIndex: 'isEnable',
      align: 'center',
      render: (text: boolean) => {
        if (text === true) return <div>是</div>;
        else return <div>否</div>;
      },
    },
    {
      title: <div style={{ color: '#038A97' }}>操作</div>,
      className: 'User-columns',
      key: 'operation',
      align: 'center',
      render: (text: User) => {
        const people = {
          username: text.username,
          realname: text.realname,
          age: text.age,
          gender: text.gender,
          isEnable: text.isEnable,
          id: text.id,
          uuid: text.uuid,
        };
        return (
          <div className="Operator">
            <UpdateUserButton {...people}></UpdateUserButton>
            <DeleteUserButton username={text.username}></DeleteUserButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchDatas = async () => {
      getUserCount({
        variables: {
          username: tmpUser[0].username,
          realname: tmpUser[0].realname,
        },
      });
      let pagesnumber = pages - 1;
      getUsers({
        variables: {
          pages: pagesnumber,
          username: tmpUser[0].username,
          realname: tmpUser[0].realname,
        },
      });
      // console.log(pagesnumber);
      if (data) {
        setUserCount(data1.getAllUserCount);
        setDataSource(data.getAllUsers);
        console.log(data.getAllUsers);
        console.log(data1);
      }
    };
    try {
      if (!IfNowMain) {
        fetchDatas();
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    data,
    data1,
    getUsers,
    getUserCount,
    pages,
    IfNowMain,
    setDataSource,
    setUserCount,
    tmpUser,
  ]);

  return (
    <>
      <Table
        rowKey="username"
        className="User-Table"
        dataSource={dataSource}
        columns={columns}
        pagination={{
          className: 'User-Table-page',
          defaultPageSize: 10,
          defaultCurrent: 1,
          current: pages,
          showQuickJumper: true,
          pageSizeOptions: [10],
          locale: {
            items_per_page: '/页',
            jump_to: '跳转至',
            page: '页',
          },
          total: userCount,
          onChange: (page) => {
            setPages(page);
          },
        }}
      ></Table>
    </>
  );
}

export default UserTable;
