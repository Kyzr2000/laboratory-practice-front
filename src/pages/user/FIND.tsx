import { gql, useLazyQuery } from '@apollo/client';
import { Button, Col, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { searchResultsState, table2 } from './recoil';
const QUERYUSERNAME = gql`
  query FindUserName($username: String!) {
    FindUserName(username: $username) {
      username
      name
      password
      gender
      age
      use
    }
  }
`;
const QUERYNAME = gql`
  query FindName($name: String!) {
    FindName(name: $name) {
      username
      name
      password
      gender
      age
      use
    }
  }
`;
interface DataType {
  key: number;
  username: string;
  name: string;
  gender: string;
  age: string;
  use: string;
  operate: string;
}

const FIND: React.FC = () => {
  const setSearchResults = useSetRecoilState(searchResultsState);
  // const [state]=useRecoilState(table1);
  const [state1] = useRecoilState(table2);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  // const {data:usernameDate}=useQuery(QUERYUSERNAME,{variables:{username:username}});
  // const {data:nameDate}=useQuery(QUERYNAME,{variables:{username:name}});
  const [queryusername] = useLazyQuery(QUERYUSERNAME, { fetchPolicy: 'no-cache' });
  const [queryname] = useLazyQuery(QUERYNAME, { fetchPolicy: 'no-cache' });

  const handleClick = async () => {
    let searchResults = [];
    if (username && !name) {
      const { data: usernameData } = await queryusername({ variables: { username } });
      if (usernameData) {
        searchResults = [usernameData.FindUserName];
      } else {
        message.error('查询失败');
      }
    } else if (name && !username) {
      const { data: nameData } = await queryname({ variables: { name } });
      if (nameData.FindName.length > 0) {
        searchResults = nameData.FindName;
      } else {
        message.error('查询失败');
      }
    } else if (username && name) {
      const { data: usernameData } = await queryusername({ variables: { username } });
      const { data: nameData } = await queryname({ variables: { name } });
      if (
        usernameData &&
        nameData.FindName.length > 0 &&
        usernameData.FindUserName.name === name
      ) {
        searchResults = [usernameData.FindUserName];
      } else {
        message.error('查询失败');
      }
    }
    // 将搜索结果存储在全局状态中
    setSearchResults(
      searchResults.map((user: DataType, index: number) => ({
        key: index + 1,
        username: user.username,
        name: user.name,
        gender: user.gender,
        age: user.age,
        use: user.use,
        operate: '',
      })),
    );
    // if (searchResults.length===0) {
    // setState(state+1);
    // message.success(123);
    // }
  };
  useEffect(() => {}, [setSearchResults, state1]);
  return (
    <>
      <Col span={4}>
        <Input
          placeholder="请输入账号"
          style={{ width: '200px' }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </Col>
      <Col span={4}>
        <Input
          placeholder="请输入姓名"
          style={{ width: '200px' }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Col>
      <Col span={14}>
        <Button
          type="primary"
          className="Primary"
          onClick={handleClick}
          style={{ backgroundColor: '#0497a8', color: 'white' }}
        >
          搜索
        </Button>
      </Col>
    </>
  );
};
export default FIND;
