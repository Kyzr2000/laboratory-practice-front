import { useQuery } from '@apollo/client';
import type { TableColumnsType } from 'antd';
import { Space, Table } from 'antd';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { SELECT_UNITS_BY_NAME_AND_CODE } from '@/pages/graphql/unit';

import type { UnitType } from '../models/unitType';
import { currentPageAtom, pageSizeAtom, totalRecordsAtom, unitsAtom } from './atom/pageAtom';
import { unitCodeAtom, unitNameAtom } from './atom/searchAtom';
import { triggerRefreshAtom } from './atom/triggerRefreshAtom';
import DeleteUnitButton from './delete-unit';
import EditUnitButton from './update-unit';



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
  const [triggerRefresh, setTriggerRefresh] = useRecoilState(triggerRefreshAtom);

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, error, refetch } = useQuery(SELECT_UNITS_BY_NAME_AND_CODE, {
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
      setUnits(data.selectUnits.units);
      setTotalRecords(data.selectUnits.total);
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

  useEffect(() => {
    
    console.log('Triggered refetch.');
    refetch(); // 当 triggerRefresh 改变时，重新执行查询
  
  }, [triggerRefresh, refetch]);



  // // 编辑
  const handleEditSuccess = () => {
    refetch();
  };

  // 序列号生成渲染 因为Table 组件的 render 函数默认接受三个参数，
  // 而第一个参数通常表示单元格的值，__: 这个参数被定义为 SimpUserType 类型这两个都不需要
  // index: 这个参数表示当前行在当前页面中的索引位置，从 0 开始计数。
  const SerialNumber = (_: undefined, __: UnitType, index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };
  



  const columns: TableColumnsType<UnitType> = [
    
    {
      title: '序号',
      // 唯一的索引列
      dataIndex: 'id',
      key: '0',
      width: 100,
      render: SerialNumber,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '单位编号',
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: 200,
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 200,
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
      width: 300,
      // _ 表示当前行的索引，但在这种情况下没有使用。
      // record 表示当前行的数据对象，包含了用户的信息
      render: (_, record) => (
        <Space  size="middle" >
          <EditUnitButton unitId={record.id} onEdited={handleEditSuccess} initialValues={record} />
          {/* userId 属性传递了当前行用户的数据中的 id。
          onDeleted 属性传递了 handleDeleteSuccess 函数，当删除操作成功时，这个函数会被调用。 */}
          <DeleteUnitButton unitId={record.id} onDeleted={handleEditSuccess} />
        </Space>
      ),
    },
  ];


  // 分页
  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    refetch({ // 重新获取数据
      input: {
        unitCode: recoilCode.trim() === '' ? null : recoilCode,
        unitName: recoilName.trim() === '' ? null : recoilName,
        page: currentPage,
        pageSize: pageSize,
      }
    });
  };

  return (
    <div>
      <Table 
      columns={columns} 
      dataSource={units} 
      scroll={{ x: 1000}} 
      pagination={{
        current: currentPage,
        pageSize,
        total: totalRecords, // 总记录数
        showSizeChanger: true, // 显示每页显示数量的选择
        pageSizeOptions: ['10', '20', '50'],
        onChange: onPageChange,
      }}
      ></Table>

    </div>
  );
};

export default UnitTableList;

