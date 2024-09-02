import { useQuery } from '@apollo/client';
import type { TableColumnsType } from 'antd';
import { Table } from 'antd';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { SelectUnitsByNameAndCode } from '@/pages/graphql/unit';

import type { UnitType } from '../models/unitType';
import { currentPageAtom, pageSizeAtom, totalRecordsAtom, unitsAtom } from './atom/pageAtom';
import { unitCodeAtom, unitNameAtom } from './atom/searchAtom';



const UnitTableList = () => {

  // 获取当前在第几页
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  // 获取每页的数据量
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalRecords,setTotalRecords] = useRecoilState(totalRecordsAtom);

  // 存放查询出来的数据
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [units,setUnits] = useRecoilState(unitsAtom);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [recoilCode, setRecoilCode] = useRecoilState(unitCodeAtom);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [recoilName, setRecoilName] = useRecoilState(unitNameAtom);
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, error, refetch } = useQuery(SelectUnitsByNameAndCode, {
    variables: {
      input: {
        unitCode: recoilCode.trim() === '' ? null : recoilCode,
        unitName: recoilName.trim() === '' ? null : recoilName,
        page: currentPage,
        pageSize: pageSize,
      }
    },
    onCompleted: (data) => {
      console.log('查询结果:', data); // 打印查询结果
      // setUnits(data.selectUnits.units);
      // setTotalRecords(data.selectUnits.total);
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
    fetchPolicy: 'no-cache' // 不从缓存获取，从网络获取
  });

   // 使用了 useEffect 钩子来处理从后端获取的数据，并在每次状态改变时重新获取数据  
   useEffect(() => {
    if (data) {
      setUnits(data.selectUnits.units); // 更新数据
      setTotalRecords(data.selectUnits.units.total || 0);
    }
    // refetch();
  }, [data, setUnits, setTotalRecords, refetch]);



  


  const columns: TableColumnsType<UnitType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '单位编号',
      dataIndex: 'unitCode',
      key: 'unitCode',
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string | number | Date) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      // _ 表示当前行的索引，但在这种情况下没有使用。
      // record 表示当前行的数据对象，包含了用户的信息
      // render: (_, record) => (
      //   <Space  size="middle" >
      // eslint-disable-next-line max-len
      //      <EditUnitButton userId={record.id} onEdited={handleEditSuccess} initialValues={record} />
      //     {/* userId 属性传递了当前行用户的数据中的 id。
      //     onDeleted 属性传递了 handleDeleteSuccess 函数，当删除操作成功时，这个函数会被调用。 */}
      //     <DeleteUnitButton userId={record.id} onDeleted={handleDeleteSuccess} />
      //   </Space>
      // ),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <Table 
      columns={columns} 
      // dataSource={data.allSimplifiedUsers.users} 
      dataSource={units} 
      scroll={{ x: 1000}} 
      pagination={{
        current: currentPage,
        pageSize:pageSize,
        total: totalRecords, // 总记录数
        showSizeChanger: true, // 显示每页显示数量的选择
        pageSizeOptions: ['10', '20', '50'],
        onChange: handleTableChange,
      }}
      ></Table>

    </div>
  );
};

export default UnitTableList;