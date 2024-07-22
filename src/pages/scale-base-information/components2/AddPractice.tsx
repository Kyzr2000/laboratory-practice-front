import { Col, Space } from 'antd';
import { memo } from 'react';

import AddModal from './AddModal';
import ImportModal from './ImportModal';

// eslint-disable-next-line react/display-name
const AddPractice = memo(() => {
    
    return (
        <>
            <Col span={3} offset={7} className='add-modal-box'>
                <Space size={'large'}>
                    <AddModal />
                    <ImportModal />
                </Space>
            </Col>
        </>
    );
});

export default AddPractice;