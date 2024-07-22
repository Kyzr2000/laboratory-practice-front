import './components2/style.less';

import { Row } from 'antd';
import { memo } from 'react';
import { RecoilRoot } from 'recoil';

import AddPractice from './components2/AddPractice';
import SearchPractice from './components2/SearchPractice';
import TablePractice from './components2/TablePractice';
// eslint-disable-next-line react/display-name
const Information = memo(() => {
    return (
        <RecoilRoot>
            <div className='container-all'>
                <Row id='header-entry'>
                    <SearchPractice></SearchPractice>
                    <AddPractice></AddPractice>
                </Row>
                <Row id='table-entry'>
                    <TablePractice></TablePractice>
                </Row>
            </div>
        </RecoilRoot>
    );
});

export default Information;