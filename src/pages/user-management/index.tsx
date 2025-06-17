import { Col, Row } from 'antd';
import { useState } from 'react';

import Add from './components/add';
import Search from './components/search';
import TableDate from './components/table';

const UserManagement = () => {
  interface DataType {
    username?: string;
    password?: string;
    realname?: string;
    gender?: number | null;
    age?: number | null;
    telephone?: string | null;
    email?: string | null;
    introduction?: string | null;
  }
  interface Currentpage {
    page: number;
    limit: number;
  }
  // const { data } = useQuery(GetAllUser);
  const [tableDate, settableDate] = useState<DataType[]>([]); // 表格所有数据
  const [currentpage, setcurrentpage] = useState<Currentpage>({
    page: 1,
    limit: 10,
  }); // 表格所有数据
  const [total, settotal] = useState<number>();
  const [username, setusername] = useState<string>();
  const [realname, setrealname] = useState<string>();
  return (
    <>
      <Row gutter={[0, 50]}>
        <Col span={20}>
          <Search setusername={setusername} setrealname={setrealname} />
        </Col>
        <Col span={4}>
          <Add
            settotal={settotal}
            settableDate={settableDate}
            currentpage={currentpage}
            setcurrentpage={setcurrentpage}
          />
        </Col>
        <Col span={24}>
          <TableDate
            username={username}
            realname={realname}
            total={total}
            settotal={settotal}
            tableDate={tableDate}
            settableDate={settableDate}
            currentpage={currentpage}
            setcurrentpage={setcurrentpage}
          />
          {/* <TableDate /> */}
        </Col>
      </Row>
    </>
  );
};
export default UserManagement;
