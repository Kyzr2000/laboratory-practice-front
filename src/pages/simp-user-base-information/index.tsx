import { useQuery } from '@apollo/client';
import { Col, Row } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';

import { Find_ALL_SIMPLIFIED_USERS_QUERY } from '../graphql/simp-user';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AddUserButton from './components/add-user';
import { currentPageAtom, pageSizeAtom } from './components/atom/pageAtom';
import SearchUsers from './components/search-user';
import SimpUserTableList from './components/table-list';
import type { SimpUserType } from './models/simpUserType';


const SimpUserBaseInformation = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchResults, setSearchResults] = React.useState<SimpUserType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loading, data, refetch } = useQuery(Find_ALL_SIMPLIFIED_USERS_QUERY, {
        variables: { page: currentPage, pageSize },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddSuccess = () => {
        // 当添加新用户成功时，重新获取数据  之后会刷新用户的列表
        refetch();
    };


    // const handleSearchResults = (users: SimpUserType[]) => {
    //     setSearchResults(users);
    // };

    // 监听 currentPage 和 pageSize 的变化，当变化时重新获取数据
    React.useEffect(() => {
        refetch();
    }, [currentPage, pageSize, refetch]);

    return (
        <div>
        <Row style={{height:15}}>
            
            <Col span={14}></Col>
        </Row>
        <Row style={{height:50}}>
            <Col span={1}></Col>
            <Col span={6}>
                <SearchUsers /> {/* 添加 SearchUsers 组件 */}
            </Col>
            <Col span={12}></Col>
            <Col span={4}>
                <AddUserButton onAdded={handleAddSuccess} />{/* 添加 add 组件 */}   
            </Col>
        </Row>
        <SimpUserTableList />
        </div>
    );
};
export default SimpUserBaseInformation;
