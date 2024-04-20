import { Button, Form, Input, Row } from 'antd';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { NowPage, tmpUserData } from './user-table';

function UserSearch() {
  const [username, setUsername] = useState<string | null>();
  const [realname, setRealname] = useState<string | null>();
  const setSearchUser = useSetRecoilState(tmpUserData);
  const setPages = useSetRecoilState(NowPage);


  const handleSearch = () => {
    setSearchUser([
      {
        username: username,
        realname: realname,
      },
    ]);
    setPages(1);
  };

  return (
    <>
      <Form onFinish={handleSearch}>
        <Row>
          <Form.Item name="usernameInput" className="Username-Input">
            <Input
              className="Search-Username"
              placeholder="请输入要搜索的账号"
              onChange={(e) => {
                const username = e.target.value;
                setUsername(username);
              }}
            ></Input>
          </Form.Item>
          <Form.Item name="userInput" className="User-Input">
            <Input
              placeholder="请输入要搜索的姓名"
              onChange={(e) => {
                const realname = e.target.value;
                setRealname(realname);
              }}
            ></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}

export default UserSearch;
