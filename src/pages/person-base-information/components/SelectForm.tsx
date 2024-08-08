/* eslint-disable react/no-unescaped-entities */
import { Button, Input, Select, Space } from 'antd';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { accountAtom, selectState } from './Atom/AccountAtom';

const SearchForm: React.FC = () => {
  const [accountInput, setAccountInput] = useState('');
  const setAccount = useSetRecoilState(accountAtom);
  const setState = useSetRecoilState(selectState);

  // 定义搜索事件
  const handleSearch = () => {
    setAccount(accountInput);
  };

  // 定义选择事件
  const handleSelect = (value: string) => {
    setState(value);
  };

  return (
    <Space wrap size="middle" style={{ marginLeft: 36, marginTop: 20 }}>
      <Select
        // showSearch属性表示这个选择框具有搜索功能
        showSearch
        placeholder="全部"
        style={{
          width: 200,
          height: 40,
          fontSize: 17,
          textAlign: 'center',
          marginBottom: 20,
        }}
        // filterOption:这是一个函数，它会被select组件调用，用于决定是否显示某个选项}
        // (option):这是函数的参数列表,option是当前正在考虑是否显示的下拉选项对象
        filterOption={(input, option) =>
          // ?. :可选链操作符，?? :空值合并操作符
          // toLowerCase(): 这是一个字符串方法，用于将字符串转换为全小写形式
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        //  options:表示多选框中选项
        options={[
          { value: 'All', label: '全部' },
          { value: 'work', label: '工作' },
          { value: 'rest', label: '休息' },
        ]}
        onChange={handleSelect}
      />
      <Input
        placeholder="请输入账号"
        style={{
          width: 200,
          height: 40,
          fontSize: 17,
          textAlign: 'center',
          marginBottom: 20,
        }}
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
          borderColor: 'green',
          marginBottom: 20,
        }}
        onClick={handleSearch}
      >
        查询
      </Button>
    </Space>
  );
};

export default SearchForm;
