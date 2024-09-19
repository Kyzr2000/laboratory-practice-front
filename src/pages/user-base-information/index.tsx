import { Row } from 'antd';
import React from 'react';

import AddModal from '@/pages/user-base-information/components/add-modal';
import Search from '@/pages/user-base-information/components/search';
import BaseInformationTable from '@/pages/user-base-information/components/table';

const BaseInformation: React.FC = () => {
  return (
    <>
      <Row>
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            alignItems: 'center',
          }}
        >
          <Search />
          <AddModal />
        </div>
      </Row>
      <BaseInformationTable />
    </>
  );
};

export default BaseInformation;
