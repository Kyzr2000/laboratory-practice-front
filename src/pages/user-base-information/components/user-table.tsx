import './css/user-table.scss';

import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { User } from '../type';

type PropsConfig = {
  loading: boolean;
  users: User[];
  currentPage: number;
  pageNumber: React.MutableRefObject<number>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageAllCount: number;
  totalCount: number;
  setIsQuerying: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setDeleteUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteUserId: React.Dispatch<React.SetStateAction<number | null>>;
};

const UserTable = ({
  loading,
  users,
  currentPage,
  pageNumber,
  setCurrentPage,
  totalCount,
  setIsQuerying,
  setUpdateUserId,
  setUpdateUserOpen,
  setDeleteUserId,
  setDeleteUserOpen
}: PropsConfig) => {
  const columns: ColumnsType<User> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (value, record, index) => 
        <a>{(index + 1) + (currentPage - 1) * pageNumber.current}</a>,
    },
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        if (gender === 1) {
          return <span>男</span>;
        } else if (gender === 2) {
          return <span>女</span>;
        } else {
          return <span>未录入</span>;
        }
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (age) => {
        if (age) {
          return <span>{age} 岁</span>;
        }
        else {
          return <span>未录入</span>;
        }
      }
    },
    {
      title: '是否启用',
      key: 'isEnable',
      dataIndex: 'isEnable',
      render: (isEnable) => {
        let color = isEnable ? 'green' : 'gray';
        let tag = isEnable ? '启用' : '禁用';
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
      // render一共有两个参数，一个是value，一个是record。value代表单元格中的值，record是一个对象，存放的是整个单元行的值
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <a onClick={() => showUpdataUserModal(record)}>编辑</a>
          <a onClick={() => showDeleteUserModal(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const showUpdataUserModal = (record: User) => {
    const {id: userId} = record;
    console.log(userId);
    setUpdateUserId(Number(userId));
    setUpdateUserOpen(true);
  };

  const showDeleteUserModal = (record: User) => {
    const {id: userId} = record;
    setDeleteUserId(Number(userId));
    setDeleteUserOpen(true);
  };


  return (
    <div>
      <Table
        columns={columns}
        // dataSource={users}
        dataSource={users.map((user) => ({...user, key: user.id}))}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageNumber.current,
          total: totalCount,
          onChange(page) {
            setCurrentPage(page);
            setIsQuerying(true);
          },
        }}
      />
    </div>
  );
};

export default UserTable;
