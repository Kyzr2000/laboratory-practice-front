import { useQuery } from '@apollo/client';
import type { TableProps } from 'antd';
import { Button, Space, Table } from 'antd';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { currentAtom, pageSizeAtom, unitName } from '@/atom/atom';
import { GET_UNIT_COUNT } from '@/gql/query';

import type { UnitType } from './intterface/UsersUnit';




const TableSelect: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [current, setCurrent] = useRecoilState(currentAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState(0);

  const getUnitName = useRecoilValue(unitName);



  const { data, error, loading } = useQuery(GET_UNIT_COUNT, {
    variables: {
      page: current,
      pageSize: pageSize,
      unitName: getUnitName
    },
  });



  // useEffect(() => {
  //   if (data) {
  //     setTotal(data.getUsers.total);
  //   }
  // }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;






  const columns: TableProps<UnitType>['columns'] = [
    {
      title: <span style={{ color: '#038A97' }}>序号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 150,
      align: 'center' as 'center',
      render: (_: undefined, __: UnitType, index: number) =>
        1001 + index + (current - 1) * pageSize,


    },
    {
      title: <span style={{ color: '#038A97' }}>公司编号</span>,
      dataIndex: 'unit_code',
      key: 'unit_code',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>公司姓名</span>,
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 250,
      align: 'center' as 'center',
    },
    {
      title: <span style={{ color: '#038A97' }}>创建日期</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center' as 'center',
      // 定义一个渲染函数，用于将日期字符串格式化为本地日期格式并显示在页面上
      // 参数: text - 一个字符串类型的日期，如"2023-01-01"
      // 返回值: 一个 React 元素，用于显示格式化后的日期
      render: (text: string) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: <span style={{ color: '#038A97' }}>操作</span>,
      key: 'action',
      width: 250,
      align: 'center' as 'center',
      render: (record: UnitType) => (
        <Space size="middle">
          <Button
            key={record.id}
            type="primary"
            style={{ backgroundColor: 'green', borderColor: 'green' }}>编辑</Button>
          <Button
            key={record.id}
            type="primary" >删除</Button>
        </Space>
      ),
    },
  ];

  const unitData: UnitType[] =
    data?.getUnits.units.map((item: UnitType) => ({
      id: item.id,
      unit_code: item.unit_code,
      unit_name: item.unit_name,
      created_at: item.created_at,
      key: item.id, // 在这里添加 key
    })) || [];

  // const handleTableChange = (pagination) => {
  //   setCurrent(pagination.current);
  //   setPageSize(pagination.pageSize);
  //   refetch({
  //     page: pagination.current,
  //     pageSize: pagination.pageSize,
  //     account,
  //     isEnabled: isEnabled === 'start' ? true : isEnabled === 'end' ? false : undefined
  //   });
  // };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Table columns={columns} dataSource={unitData}
          pagination={{ current, pageSize, total }}
        />
      </div>
    </div>
  );
};

export default TableSelect;