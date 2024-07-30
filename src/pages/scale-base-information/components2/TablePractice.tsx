import '../components2/style.less';

import { useQuery } from '@apollo/client';
import type { TableColumnsType } from 'antd';
import { Col, Space, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { GET_PEOPLE } from '@/pages/graphql/people.graphql';

import type { NameType,OptionItemType,PeopleType } from './Atom/InterfaceState';
import { OptionsState } from './Atom/OptionsState';
import { TableDataState } from './Atom/TableDataState';
import { TableDataFilterState_2 } from './Selector/TableDataFilterStateByInput';
import TableDelete from './TableDelete';
import TableEdit from './TableEdit';

const TablePractice: React.FC = () => {

    // 获取gql查询到的数据
    const { data, error, loading } = useQuery(GET_PEOPLE);
    console.log(data);

    const setTableData = useSetRecoilState(TableDataState);
    const tableDataFiltered = useRecoilValue(TableDataFilterState_2);
    const [peopleName, setPeopleName] = useState<NameType[]>([]);
    
    const optionList = useRecoilValue(OptionsState);
    
    // 
    const [currentPage, setCurrentPage] = useState(1); // 用于记录当前页码
    const [pageSize, setPageSize] = useState(10);  // 每页显示条数

    // 处理分页变化的回调函数
    const onTableChange = (newPage: number, newSize?: number) => {
        setCurrentPage(newPage);
        if (newSize) {
            setPageSize(newSize);
        }
    };

    // 序号列的渲染逻辑
    const renderSerialNumber = (_: undefined, __: PeopleType, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
    };

    // 创建一个状态列的filter
    // const statusList = optionList.map((item: OptionItemType) => ({
    //     text: item.label,
    //     value: item.label,
    // }));

    
    // 使用 useCallback 包装 setTableData
    const memorizedSetTableData = useCallback((peopleData: PeopleType[]) => {
        setTableData(peopleData);
    }, [setTableData]);


    const memorizedSetPeopleNameData = useCallback((peopleNameData: NameType[]) => {
        setPeopleName(peopleNameData);
    }, [setPeopleName]);


    /*
        `useEffect`钩子用于在函数组件中执行副作用，例如数据获取、订阅、或手动操作DOM等。

        `useEffect`接受两个参数：
            1. 一个副作用函数。
            2. 一个依赖项数组，当数组中的任意一项发生变化时，副作用函数将重新执行。
    
        依赖项数组的作用
            依赖项数组告诉React这个effect依赖于哪些变量。
            当依赖项中的变量发生变化时，React将重新执行这个Effect。如果依赖项数组为空，effect只会在组件挂载和写在时各执行一次。
    */
    useEffect(() => {
        if (data) {
            // 将数据与类型绑定，进行声明
            const PeopleData: PeopleType[] =
                data.getPeople.map((item: PeopleType) => (
                    {
                        key: item.id,
                        id: item.id,
                        account: item.account,
                        name: item.name,
                        gender: item.gender,
                        age: item.age,
                        is_enabled: item.is_enabled
                    }
                ));
            const PeopleNameData: NameType[] =
                data.getPeople.map((item: PeopleType) => ({
                    text: item.name,
                    value: item.name,
                }));
            memorizedSetTableData(PeopleData);
            memorizedSetPeopleNameData(PeopleNameData);
        }
    }, [data, memorizedSetTableData, memorizedSetPeopleNameData]);

    

    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p>Loading...</p>;

    // 定义统一的列宽
    const commonWidth = 120;  

    // 定义列
    const columns: TableColumnsType<PeopleType> = [
        {
            title: <span className='columns-name'>序号</span>,
            dataIndex: 'serial_number',
            key: 'serial_number',
            sorter: (a, b) => a.id - b.id,
            render: renderSerialNumber,
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>账号</span>,
            dataIndex: 'account',
            key: 'account',
            sorter: (a, b) => a.account.localeCompare(b.account),
            filters: [
                {
                    text: 'kinglyz',
                    value: 'kinglyz',
                },
                {
                    text: 'BOBBYSTONE',
                    value: 'BOBBYSTONE',
                },
                // 可以添加更多账号筛选项
            ],
            onFilter: (value, record) => record.account === value,
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>姓名</span>,
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            filters: peopleName,
            onFilter: (value, record) => record.name === value,
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>性别</span>,
            dataIndex: 'gender',
            key: 'gender',
            filters: [
                {
                    text: '男',
                    value: '男',
                },
                {
                    text: '女',
                    value: '女',
                },
            ],
            onFilter: (value, record) => record.gender === value,
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>年龄</span>,
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.age - b.age,
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>状态</span>,
            dataIndex: 'is_enabled',
            key: 'is_enabled',
            filters: optionList.map((item: OptionItemType) => ({
                text: item.label,
                value: item.label,
            })),
            onFilter: (value, record) => record.is_enabled === value,
            render: value => value,
            // render: value => (value === true ? '启用' : '未启用'),
            width: commonWidth,
            className: 'centered-column', 
        },
        {
            title: <span className='columns-name'>操作</span>,
            key: 'operation',
            render: (record: PeopleType) => (
                <div className='buttons-box'>
                    <Space size={30}>
                        <TableEdit record={ record } />
                        <TableDelete record={ record } />
                    </Space>
                </div>
            ),
            width: commonWidth,
            className: 'centered-column', 
        },
    ];


    return (
        <Col span={22} offset={1}>
            <Table
                columns={columns}
                dataSource={tableDataFiltered}
                rowKey={(record) => record.id}
                pagination={{
                    current: currentPage,  // 当前页数
                    pageSize: pageSize, // 每页展示条目数
                    // total: data ? data.getPeople.length : 0,
                    total: tableDataFiltered ? tableDataFiltered.length : 0,
                    // 假设数据已加载，使用数据长度作为总数
                    onChange: onTableChange, // 绑定分页变化的回调函数
                    className: 'ant-pagination-item',
                }} // 设置默认每页显示条数
            />
        </Col>
    );
};

export default TablePractice;