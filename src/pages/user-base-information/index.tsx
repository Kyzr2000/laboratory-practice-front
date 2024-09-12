import { Col, Row } from 'antd';
import React from 'react';

import AddModal from '@/pages/user-base-information/components/add-modal';
import Search from '@/pages/user-base-information/components/search';
import BaseInformationTable from '@/pages/user-base-information/components/table';

const BaseInformation: React.FC = () => {
  return (
    <>
      <Row>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Col span={30}>
            <Search />
            <AddModal />

          </Col>
          <Col span={10}>

          </Col>
        </div>
      </Row>
      <BaseInformationTable />
    </>
  );
};

export default BaseInformation;
