import { useQuery } from '@apollo/client';
import type { TableColumnsType } from 'antd';
import { Col, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { GET_PERSONS } from '@/pages/graphql/person.graphql';

import { accountAtom, selectState } from './Atom/AccountAtom';
import { currentPageAtom, pageSizeAtom } from './Atom/pageAtom';
import type { PersonType } from './Atom/PersonType';
// import { TableDataState } from './Atom/TableDataState';
import { usersAtom } from './Atom/usersAtom';
import TableDelete from './TableDelete';
import TableUpdate from './TableUpdate';

const TablePractice: React.FC = () => {
  // useState是一个状态变量，是一个存放当前值和改变这个值的函数的容器
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom); // 用于记录当前页码
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom); // 代表每页有十条数据
  const [total, setTotal] = useState(0); // 代表筛选后的记录总数
  const isEnabled = useRecoilValue(selectState);
  const account = useRecoilValue(accountAtom);

  // 获取gql的查询到的数据
  const { data, loading, error, refetch } = useQuery(GET_PERSONS, {
    // findAll方法传入的参数
    variables: {
      page: currentPage,
      pageSize: pageSize,
      account,
      isEnabled: isEnabled === 'work' ? true : isEnabled === 'rest' ? false : undefined,
    },
  });

  // // useState是一个状态变量，是一个存放当前值和改变这个值的函数的容器
  // const [currentPage, setCurrentPage] = useState(1); // 用于记录当前页码
  // const [pageSize, setPageSize] = useState(10); // 代表每页有十条数据
  // const [total, setTotal] = useState(0);  // 代表筛选后的记录总数

  // PersonData：是最后从后端拿到的数据
  // const [PersonData, setPersonData] = useState<PersonType[]>([]);

  const setUsers = useSetRecoilState(usersAtom);

  // const setTableData = useSetRecoilState(TableDataState);
  // 处理分页变化的回调函数
  // onTableChange 函数用于响应表格分页或分页大小的变化。
  // 当分页变化时，它更新当前页码；如果同时提供了新的页面大小，它也会更新页面大小。
  // const onTableChange = (newPage: number, newSize?: number) => {
  //   setCurrentPage(newPage);
  //   if (newSize) {
  //     setPageSize(newSize);
  //   }
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    refetch({
      page: pagination.current,
      pageSize: pagination.pageSize,
      account,
      isEnabled: isEnabled === 'work' ? true : isEnabled === 'rest' ? false : undefined,
    });
  };
  // useCallback 被用来包装 setTableData 函数，
  // 创建了一个记忆化的回调函数 memorizedSetTableData。
  // 这个记忆化的回调函数的作用是优化性能，避免在组件渲染时不必要的重新创建函数，从而避免不必要的渲染。
  // const memorizedSetTableData = useCallback((PersonData1: PersonType[]) => {
  //   setTableData(PersonData1);
  // }, [setTableData]);

  // useEffect用于将后端的data和前端匹配上，数据与类型绑定
  // `useEffect`钩子用于在函数组件中执行副作用（事件监听），例如数据获取、订阅、或手动操作DOM等
  useEffect(() => {
    if (data) {
      // 将数据与类型绑定，进行声明，PersonData1：是一个临时存储后端数据的东西
      // const PersonData1: PersonType[] =
      //   data?.findAll.users.map((item: PersonType) => (
      //     {
      //       key: item.id,
      //       id: item.id,
      //       account: item.account,
      //       name: item.name,
      //       gender: item.gender,
      //       age: item.age,
      //       is_enabled: item.is_enabled
      //     }
      //   ));
      // setPersonData(PersonData1);
      // memorizedSetTableData(PersonData);
      setUsers(data.findAll.users);
      setTotal(data.findAll.total);
    }
    // 为了达到一个更好的监听的效果，应该把useEffect中用到的数据都放到一个数组中
  }, [data, setUsers]);

  // 遍历拿到后端的数据
  const PersonData: PersonType[] = data?.findAll.users.map((item: PersonType) => ({
    key: item.id,
    id: item.id,
    account: item.account,
    name: item.name,
    gender: item.gender,
    age: item.age,
    is_enabled: item.is_enabled,
  }));

  // 序号渲染函数
  // 获取数据序列号的函数，renderSerialNumber这个函数的作用是根据当前页码和每页显示的条数，以及当前单元格的索引，计算出当前单元格数据在整个数据集中的序号。
  const renderSerialNumber = (_: undefined, __: PersonType, index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  // 定义列
  const columns: TableColumnsType<PersonType> = [
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          序号
        </span>
      ),
      // dataIndex是数据对象中对应列的数据字段,serial_number代表连续id
      dataIndex: 'id',
      // key是列的唯一标识，通常与 dataIndex 相同
      key: 'id',
      align: 'center' as 'center',
      // sorter函数根据返回值来进行排序，返回值>0时进行倒序排序，返回值为<0时进行正序排序
      // sorter函数书写格式：sorter: (a,b) => a.value - b.value
      sorter: (a, b) => a.id - b.id,
      // render属性是一个函数，用于定义如何渲染（显示）列中的每个单元格的值
      // renderSerialNumber:是一个自定义函数，用于显示表中数据正确的id号
      render: renderSerialNumber,
      width: 80,
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          账号
        </span>
      ),
      dataIndex: 'account',
      key: 'account',
      align: 'center' as 'center',
      // localeCompare 是一个字符串方法，用于按照本地环境的排序规则比较两个字符串。
      // 这个方法返回一个数字，表示两个字符串在排序时的相对顺序：
      // 如果返回值小于 0，则表示 a 在 b 之前。
      // 如果返回值等于 0，则表示 a 和 b 相等（在排序上）。
      // 如果返回值大于 0，则表示 a 在 b 之后。
      sorter: (a, b) => a.account.localeCompare(b.account),
      // 账号筛选项
      filters: [
        {
          text: 'xiaowu',
          value: 'xiaowu',
        },
        {
          text: 'xiaoyang',
          value: 'xiaoyang',
        },
        {
          text: 'xiaoli',
          value: 'xiaoli',
        },
      ],
      onFilter: (value, record) => record.account === value,
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          姓名
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      align: 'center' as 'center',
      sorter: (a, b) => {
        // 假设我们根据名字的首字母进行排序
        const firstLetterA = a.name[0].toUpperCase();
        const firstLetterB = b.name[0].toUpperCase();
        return firstLetterA.localeCompare(firstLetterB);
      },
      filters: [
        {
          text: '小吴',
          value: '小吴',
        },
        {
          text: '小杨',
          value: '小杨',
        },
      ],
      onFilter: (value, record) => record.name === value,
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          性别
        </span>
      ),
      dataIndex: 'gender',
      key: 'gender',
      align: 'center' as 'center',
      filters: [
        {
          text: '女',
          value: 'female',
        },
        {
          text: '男',
          value: 'male',
        },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          年龄
        </span>
      ),
      dataIndex: 'age',
      key: 'age',
      align: 'center' as 'center',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          状态
        </span>
      ),
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      align: 'center' as 'center',
      render: (text: boolean) => (text ? '工作' : '休息'),
    },
    {
      title: (
        <span
          style={{
            color: '#038A97',
            height: '40px',
            fontWeight: 'bold',
          }}
        >
          操作
        </span>
      ),
      key: 'opeation',
      align: 'center' as 'center',
      render: (record: PersonType) => (
        <div className="buttons-box">
          <Space size={30}>
            <TableUpdate record={record} />
            <TableDelete record={record} />
          </Space>
        </div>
      ),
    },
  ];

  // const data1 = [{
  //   id: 3,
  //   account: 'aaa',
  //   name: 'bbb',
  //   gender: '男',
  //   age: 10,
  //   is_enabled: false,
  // }];

  // const onChange: TableProps<PersonType>['onChange'] = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  return (
    <Col span={22} offset={1}>
      <Table
        style={{
          fontSize: '13px',
          color: 'rgba(0,0,0,0.85)',
          height: '20px',
        }}
        // 定义列
        columns={columns}
        // 定义数据
        dataSource={PersonData}
        // onChange={onChange}
        // rowKey 属性用于指定表格行的唯一标识。它是一个函数，接收一条数据记录，返回一个唯一的键。
        rowKey={(record) => record.id}
        // 定义分页
        pagination={{
          current: currentPage,
          pageSize,
          total,
          // 假设数据已加载，使用数据长度作为总数
        }} // 设置默认每页显示条数
        onChange={onTableChange} // 绑定分页变化的回调函数
      />
    </Col>
  );
};

export default TablePractice;
