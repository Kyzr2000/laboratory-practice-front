import './user-information.css';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Input, Row, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { useEffect, useState } from 'react';

import { Users, Users_count } from '../graphql/query';
import Add_user from './components/add_user';
import Del_user from './components/del_user';
import Update_user from './components/update_user';

interface DataType {
  id: number;
  username: string;
  realname: string;
  gender: number;
  age: number;
  isEnable: boolean;
}
const UserInformation = ({ usertotal }: { usertotal: number }) => {
  const [current, setCurrent] = useState(1);
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: '',
      key: 'rowIndex',
      className: 'custom-header',
      align: 'center',
      render: (_text, _record, index) => {
        const startNo = (current - 1) * 10 + 1;
        return startNo + index;
      },
    },
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      className: 'custom-header',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
      className: 'custom-header',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      key: 'name',
      className: 'custom-header',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      className: 'custom-header',
      align: 'center',
      render: (gender: number) => <span>{gender ? '男' : '女'}</span>,
    },
    {
      title: () => (
        <div
          style={{
            textAlign: 'center',
            color: '#1c8a9b',
          }}
        >
          年龄
        </div>
      ),
      dataIndex: 'age',
      key: 'age',
      className: 'custom-header',
      align: 'center',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      key: 'isEnable',
      className: 'custom-header',
      align: 'center',
      render: (isEnabled: boolean) => <span>{isEnabled ? 'Yes' : 'No'}</span>,
    },
    {
      title: '操作',
      dataIndex: 'do',
      key: 'do',
      className: 'custom-header',
      align: 'center',
      render: (_, record: DataType) => (
        <div>
          <Button
            onClick={() => {
              onUpdateClick(record);
            }}
          >
            编辑
          </Button>{' '}
          <Del_user id={record.id - 0} onSuccess={onDeleteSuccess} />
        </div>
      ),
    },
  ];
  const [username, setusername] = useState<string>('');
  const [realname, setrealname] = useState<string>('');
  const [username1, setusername1] = useState<string>('');
  const [realname1, setrealname1] = useState<string>('');
  const { data: dataTwo, refetch: refetchTwo } = useQuery(Users_count, {
    variables: {
      data: {
        realname: realname,
        username: username,
        currentPage: 1,
        pageNumber: 10,
      },
    },
  });
  const [usercount, setusercount] = useState(usertotal);
  const [userData, setuerData] = useState<DataType[]>([]);
  const [updateopen, setupdateopen] = useState(false);
  const [updateForm, setupdateForm] = useState({
    id: 17,
    username: 'cxk2132',
    realname: 'dwadawd',
    age: 18,
    gender: 1,
    isEnable: false,
  });
  const [addopen, setaddopen] = useState(false);
  const addForm = {
    id: 1,
    username: '',
    realname: '',
    age: 18,
    gender: 1,
    isEnable: false,
  };
  function onUpdateClick(userdate: DataType) {
    setupdateopen(true);
    setupdateForm(userdate);
  }
  function onAddeClick() {
    setaddopen(true);
  }
  const [loading1, setloading1] = useState(true);
  const [pagenation, setpagenation] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: usercount,
  });
  const { data, refetch } = useQuery(Users, {
    variables: {
      data: {
        realname: realname,
        username: username,
        currentPage: pagenation.current,
        pageNumber: 10,
      },
    },
  });

  function onTableChange(newpagenation: TablePaginationConfig) {
    setpagenation(newpagenation);
    console.log(newpagenation);
    if (newpagenation.current) setCurrent(newpagenation.current);
  }
  function onDeleteSuccess() {
    setpagenation(pagenation);
    refetchTwo();
    setpagenation({
      ...pagenation,
      total: dataTwo.userTotalCount,
    });
    refetch();
  }
  function onUpdateSuccess() {
    setupdateopen(false);
    refetch();
  }
  function onUpdateCancel() {
    setupdateopen(false);
  }
  function onAddSuccess() {
    setaddopen(false);
    refetchTwo();
    setpagenation({
      ...pagenation,
      total: dataTwo.userTotalCount,
    });
    refetch();
  }
  function onAddCancel() {
    setaddopen(false);
  }
  function onSearch() {
    setusercount(dataTwo.userTotalCount);
    console.log(usercount);
    setpagenation({
      ...pagenation,
      current: pagenation.current,
      total: dataTwo.userTotalCount,
    });
    setusername(username1);
    setrealname(realname1);
    console.log(pagenation.total);
  }
  useEffect(() => {
    async function getdata() {
      const userList = data.getUserBaseInformationList;
      if (Array.isArray(userList)) {
        setloading1(false);
        setuerData(userList);
      }
      console.log(pagenation.current);
    }
    getdata();
  }, [pagenation, data, dataTwo]);
  return (
    <div style={{ position: 'relative', top: '20px' }}>
      <Update_user
        open={updateopen}
        userdate={updateForm}
        onSuccess={onUpdateSuccess}
        onCancle={onUpdateCancel}
      />
      <Add_user
        open={addopen}
        userdate={addForm}
        onSuccess={onAddSuccess}
        onCancle={onAddCancel}
      />
      <div className="Title">
        <Row justify="start" gutter={12} align="middle">
          <Col span={4} offset={1}>
            <Input
              size="large"
              placeholder="请输入账号"
              style={{ width: 200 }}
              value={username1}
              onChange={(e) => setusername1(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Input
              size="large"
              placeholder="请输入姓名"
              style={{ width: 200 }}
              value={realname1}
              onChange={(e) => setrealname1(e.target.value)}
            />
          </Col>
          <Col span={2}>
            <Button
              icon={<SearchOutlined />}
              size="large"
              style={{ backgroundColor: 'green', color: 'white' }}
              onClick={onSearch}
            >
              查询
            </Button>
          </Col>
          <Col span={2} offset={8} push={1}>
            <Button onClick={onAddeClick} icon={<PlusOutlined />} size="large">
              添加用户
            </Button>
          </Col>
        </Row>
      </div>
      <div className="Body-table">
        <Row justify="center">
          <Col span={22}>
            <Table
              dataSource={userData}
              columns={columns}
              rowKey={(record) => record.username}
              loading={loading1}
              pagination={pagenation}
              onChange={onTableChange}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default UserInformation;
