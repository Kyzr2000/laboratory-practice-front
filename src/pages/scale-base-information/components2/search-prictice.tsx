import { Button, Input, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { accountAtom, selectState } from './atom/UsersManagement';

const SearchForm: React.FC = () => {
  const [accountInput, setAccountInput] = useState('');
  const setAccount = useSetRecoilState(accountAtom);
  const setState = useSetRecoilState(selectState);

  const handleSearch = () => {
    setAccount(accountInput);
  };

  const handleSelect = (value) => {
    setState(value);
  };

  return (
    <Space wrap size="middle" style={{ marginLeft: 36, marginTop: 20 }}>
       <Select
        showSearch
        placeholder="全部"
        style={{ width: 200, height: 40, fontSize: 17, textAlign: 'center' }}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
          { value: 'All', label: '全部' },
          { value: 'start', label: '启用' },
          { value: 'end', label: '禁用' },
        ]}
        onChange={handleSelect}
      />
      <Input
        placeholder="请输入账号"
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