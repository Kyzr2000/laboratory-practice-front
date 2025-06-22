import { Col, ConfigProvider, Row } from 'antd';
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
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#08A19F', // 主色调
            // borderRadius: 8,              // 组件圆角
            fontSize: 16, // 基础字号
          },
          components: {
            Button: {
              colorPrimary: '#08A19F', // 按钮单独定制
            },
            Table: {
              headerBg: '#f0f5ff', // 表头背景
              borderColor: '#d9d9d9', // 边框色
              headerColor: '#08A19F',
            },
          },
        }}
      >
        <Row gutter={[0, 50]}>
          <Col span={20}>
            <Search setname={setname} />
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
    </>
  );
};
export default UnitManagement;
