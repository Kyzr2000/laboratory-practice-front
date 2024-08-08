import { Col, Row } from 'antd';
import React from 'react';
import { RecoilRoot } from 'recoil';

import SearchForm from './components/SelectForm';
import TablePractice from './components/Table';
import TableCreate from './components/TableCreate';

const Information: React.FC = () => (
  <RecoilRoot>
    <div className="container-all">
      <Row>
        <Col span={12}>用户管理</Col>
      </Row>
      <Row id="header-entry">
        <Col span={16}>
          <SearchForm />
        </Col>
        <Col span={5} offset={3}>
          <TableCreate />
        </Col>
      </Row>
      <Row id="table-entry">
        <TablePractice />
      </Row>
    </div>
  </RecoilRoot>
);

export default Information;
