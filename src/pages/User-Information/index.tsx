import './App.scss';

import { Button, Form, Input, Row, Table } from 'antd';

const dataSource = [
  {
    key: '1',
    num: '1',
    account: 'Rockie',
    name: '江子浩',
    sex: '男',
    age: '19',
    authority: '是',
  },
];

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '是否启用',
    dataIndex: 'authority',
    key: 'authority',
  },
  {
    title: '操作',
    key: 'operation',
    render: () => {
      return (
        <div className="Operator">
          <Button>编辑</Button>
          <Button>删除</Button>
        </div>
      );
    },
  },
];

function TestDemo() {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className="User-Information-Ctrl">
      <div className="User-Search-Input">
        <Form onFinish={onFinish}>
          <Row>
            <Form.Item name="usernameInput" className="Username-Input">
              <Input placeholder="请输入要搜索的账号"></Input>
            </Form.Item>
            <Form.Item name="userInput" className="User-Input">
              <Input placeholder="请输入要搜索的姓名"></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
      <div className="Add-User">
        <Button>新增用户</Button>
      </div>
      <div className="User-Information-Show">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            defaultCurrent: 3,
            showQuickJumper: true,
            pageSizeOptions: [10],
            locale: {
              items_per_page: '/页',
              jump_to: '跳转至',
              page: '页',
            },
          }}
        ></Table>
      </div>
    </div>
  );
}

export default TestDemo;
