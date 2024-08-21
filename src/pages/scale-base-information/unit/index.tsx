
import { Col, Row } from 'antd';
import React from 'react';

import SearchForm from './search-prictice';
import TableSelect from './table-select';

const UnitInformation: React.FC = () => {
  return (
    <>
      <Row>
        <Col span={10}>
          <SearchForm />
        </ Col>
        {/* <Col span={3} offset={11}>
          <AddAndImport2 />
        </Col> */}
      </Row>
      <TableSelect />
    </>
  );
};
export default UnitInformation;