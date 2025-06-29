import './index.less';

import { Col, ConfigProvider, Divider, Row } from 'antd';
import { useState } from 'react';

import Add from './components/add';
import Search from './components/search';
import TableDate from './components/table';

const UnitManagement = () => {
  interface DataType {
    id?: number;
    name?: string;
    uuid?: string;
    createdAt?: string;
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
  const [name, setname] = useState<string>();

  return (
    <div className="User">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#40a9ff', // 主色调
            // borderRadius: 8,              // 组件圆角
            fontSize: 16, // 基础字号
          },
          components: {
            Button: {
              colorPrimary: '#1677ff', // 按钮单独定制
            },
            Table: {
              headerBg: '#f0f5ff', // 表头背景
              borderColor: '#d9d9d9', // 边框色
              // headerColor: '#08A19F',
            },
          },
        }}
      >
        <div className="UserList">
          <span></span>单位列表
        </div>
        <Divider style={{ borderColor: '#00000022' }} />
        <Row gutter={[0, 20]} justify="space-between">
          <Col>
            <Search setname={setname} />
          </Col>
          <Col>
            <Add
              settotal={settotal}
              settableDate={settableDate}
              currentpage={currentpage}
              setcurrentpage={setcurrentpage}
            />
          </Col>
          <Col span={24}>
            <TableDate
              name={name}
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
      </ConfigProvider>
    </div>
  );
};
export default UnitManagement;
