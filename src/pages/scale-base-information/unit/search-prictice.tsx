import { Button, Input, Space } from 'antd';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { unitName } from '@/atom/atom';


const SearchForm: React.FC = () => {
  const [accountInput, setAccountInput] = useState('');
  const setUnitName = useSetRecoilState(unitName);

  const handleSearch = () => {
    setUnitName(accountInput);
  };


  return (
    <Space wrap size="middle" style={{ marginLeft: 36, marginTop: 20, marginBottom: 20 }}>
      <Input
        placeholder="请输入公司名称"
        style={{ width: 200, height: 40, fontSize: 17, textAlign: 'center' }}
        onChange={(e) => setAccountInput(e.target.value)}
      />
      <Button
        type="primary"
        style={{
          height: 40,
          width: 100,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'green',
          borderColor: 'green'
        }}
        onClick={handleSearch}
      >
        查询
      </Button>
    </Space>
  );
};

export default SearchForm;