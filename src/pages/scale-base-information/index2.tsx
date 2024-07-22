import { Col, Row } from 'antd';
import React from 'react';

import AddAndImport2 from './components2/add-import2';
import SearchPrictice from './components2/search-prictice';
import TableSelect from './components2/table-select';
import { UpdateTable } from './components2/update-table';

const Information: React.FC = () => {
  return (
    <>
      <Row>
        <Col span={10}>
          <SearchPrictice />
        </ Col>
        <Col span={3} offset={11}>
          <AddAndImport2 />
        </Col>
      </Row>
      <TableSelect />
      <UpdateTable />
    </>
  );
};
Information.displayName = 'Information';
export default Information;
