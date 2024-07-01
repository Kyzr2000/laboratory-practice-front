import './css/search.scss';

import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';


type PropsConfig = {
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      realname?: string;
      username?: string;
    }>
  >;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setIsQuerying: React.Dispatch<React.SetStateAction<boolean>>;
};


const Search = ({setSearchData, setCurrentPage, setIsQuerying}: PropsConfig) => {
  const [realname, setRealname] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchData({ username, realname });
    setIsQuerying(true);
  };

  return (
    <div className='user-search'>
      <Input
        className='input-box'
        placeholder='请输入账号'
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        className='input-box'
        placeholder='请输入姓名'
        onChange={(e) => setRealname(e.target.value)}
      />
      <Button type='primary' className='search-button' onClick={handleSearch}>
        <SearchOutlined />
        &nbsp;&nbsp;查询
      </Button>
    </div>
  );
};

export default Search;
