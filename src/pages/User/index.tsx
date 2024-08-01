import './index.css';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Space,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import {
  activateState,
  ageState,
  genderState,
  isShowState,
  nicknameState,
  usernameState,
} from '@/store';

import { ADD_CONSUMER, MODIFY_CONSUMER } from '../graphql/mutations';
import { FIND_ALL, FIND_MANY } from '../graphql/query';
// import AddConsumer from "./components/addConsumer";
import RemoveConsumer from './components/removeConsumer';
// import UpdateConsumer from './components/updateConsumer';

export interface Customer {
  id: string;
  // username: string;
  // nickname: string;
  // gender: string;
  // age: number;
  // isEnable: boolean;
}

export interface IProps {
  value?: {};
  r?: {};
  i?: number;
}

const UserList = () => {
  const [isShow, setIsShow] = useRecoilState(isShowState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [nickname, setNickname] = useRecoilState(nicknameState);
  // const [total, setTotal] = useState(0);

  const [searchUsername, setSearchUsername] = useState('');
  const [searchNickname, setSearchNickname] = useState('');

  const [gender, setGender] = useRecoilState(genderState);
  const [age, setAge] = useRecoilState(ageState);
  const [activate, setActivate] = useRecoilState(activateState);

  const [currentId, setCurrentId] = useState(''); // 当前id，如果为空，表示新增

  const [currentSearch, setCurrentSearch] = useState(false); // 当前展示的数据，若为空，则表示展示全部，否则展示按条件查询到的数据

  const [myForm] = Form.useForm(); // 可以获取表单元素的实例

  // 添加用户
  const [addConsumer] = useMutation(ADD_CONSUMER);

  // 更新用户
  const [modifyConsumer, { loading: modifyLoading, error: modifyError }] =
    useMutation(MODIFY_CONSUMER);

  // 使用useEffect钩子来监听isShow，如果 isShow发生变化，则将currentId的值设为空
  useEffect(() => {
    if (!isShow) {
      setCurrentId('');
    }
  }, [isShow]);

  // 模糊查询，根据username和nickname进行查询
  const [
    executeFindMany,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useLazyQuery(FIND_MANY, {
    variables: {
      username: searchUsername,
      nickname: searchNickname,
    },
  });

  const handleAge = (value: number | null) => {
    setAge(value);
    console.log(value);
  };

  // 查询全部consumer数据
  const {
    data: consumerData,
    loading: consumerLoading,
    error: consumerError,
  } = useQuery(FIND_ALL);

  if (searchLoading || modifyLoading || consumerLoading) return <p>Loading...</p>;
  if (searchError) return <p>Error:{searchError?.message}</p>;
  if (modifyError) return <p>Error:{modifyError?.message}</p>;
  if (consumerError) return <p>Error:{consumerError?.message}</p>;
  return (
    <>
      <Card
        title="用户管理"
        extra={
          <>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsShow(true);
              }}
            />
          </>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* <SearchConsumer /> */}
          <Form
            layout="inline"
            onFinish={() => {
              message.success('查询成功');
              console.log(searchData.findManyByUsernameOrNickname);
            }}
          >
            <Form.Item label="账号">
              <Input
                placeholder="请输入关键词"
                allowClear
                value={searchUsername}
                onChange={(event) => {
                  setSearchUsername(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item label="名字">
              <Input
                placeholder="请输入关键词"
                allowClear
                value={searchNickname}
                onChange={(event) => {
                  setSearchNickname(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setCurrentSearch(true);
                  executeFindMany({
                    variables: {
                      username: searchUsername,
                      nickname: searchNickname,
                    },
                  });
                  // setUsername(searchUsername);
                  // setNickname(searchNickname);
                }}
              />
            </Form.Item>
          </Form>
          <Table
            // dataSource={consumerData.findAll}
            // dataSource={searchData.findManyByUsernameOrNickname}
            dataSource={
              currentSearch
                ? searchData.findManyByUsernameOrNickname
                : consumerData.findAll
            }
            rowKey="id"
            columns={[
              {
                title: '序号',
                width: 80,
                align: 'center',
                // render 方法中的 v、r、i 分别表示当前单元格的值、整行数据和当前行的索引。
                render(_, __, i) {
                  return <span>{i + 1}</span>;
                },
              },
              {
                title: '账号',
                dataIndex: 'username',
                width: 80,
                align: 'center',
              },
              {
                title: '姓名',
                dataIndex: 'nickname',
                width: 80,
                align: 'center',
              },
              {
                title: '性别',
                dataIndex: 'gender',
                width: 80,
                align: 'center',
              },
              {
                title: '年龄',
                dataIndex: 'age',
                width: 80,
                align: 'center',
              },
              {
                title: '是否启用',
                dataIndex: 'isEnable',
                width: 80,
                align: 'center',
                render(_, r) {
                  // return <Select defaultValue="1" style={{ width: '100%' }} />;
                  return r.isEnable ? <span>启用</span> : <span>未启用</span>;
                },
              },
              {
                title: '操作',
                width: 80,
                align: 'center',
                render(v: Customer, r) {
                  return (
                    <Space>
                      {/* <UpdateConsumer r={r} /> */}
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setIsShow(true);
                          console.log(r);
                          myForm.setFieldsValue(v);
                          setUsername(r.username);
                          setNickname(r.nickname);
                          setGender(r.gender);
                          setAge(r.age);
                          setActivate(r.isEnable);
                          setCurrentId(r.id);
                        }}
                      />
                      <RemoveConsumer id={v.id} />
                    </Space>
                  );
                },
              },
            ]}
            pagination={{
              total: consumerData.findAll.length,
              pageSize: 10,
              onChange: (page, pageSize) => {
                console.log(`Current page: ${page}, size per page: ${pageSize}`);
              },
            }}
          />
        </Space>
        {/* <Pagination defaultCurrent={1} total={50} className="page-foot" /> */}
      </Card>
      <Modal
        forceRender
        title="编辑"
        open={isShow}
        // 关闭modal时重新设置数据
        destroyOnClose={true}
        // 点击遮罩层是不关闭
        maskClosable={false}
        onCancel={() => {
          setIsShow(false);
          // 关闭modal时重新设置字段
          myForm.resetFields();
          setNickname('');
        }}
        onOk={() => {
          myForm.submit(); // 手动触发表单的提交事件
        }}
      >
        <Form
          // 表单配合modal一起使用的时候，需要设置这个属性，要不然关了窗口之后不会清空数据
          preserve={false}
          // 提交表单
          onFinish={(value) => {
            message.success('保存成功');
            if (currentId) {
              modifyConsumer({
                variables: {
                  id: parseInt(currentId),
                  updateConsumerInput: {
                    username: username,
                    nickname: nickname,
                    gender: gender,
                    age: age,
                    isEnable: activate,
                  },
                },
                refetchQueries: [{ query: FIND_ALL }],
              });
            } else {
              addConsumer({
                variables: {
                  createConsumerInput: {
                    username: username,
                    nickname: nickname,
                    gender: gender,
                    age: age,
                    isEnable: activate,
                  },
                },
                refetchQueries: [{ query: FIND_ALL }],
              });
            }
            setIsShow(false);
            console.log(value);
          }}
          // 使输入框对齐
          labelCol={{ span: 3 }}
          form={myForm}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          >
            <Input
              placeholder="请输入账号"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                console.log(username);
              }}
            />
          </Form.Item>
          <Form.Item label="姓名" name="nickname">
            <Input
              placeholder="请输入姓名"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                console.log(nickname);
              }}
            />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Radio.Group
              value={gender}
              onChange={(event) => {
                setGender(event.target.value);
                console.log(event.target.value);
              }}
            >
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="年龄" name="age">
            <InputNumber
              min={1}
              max={100}
              placeholder="请输入年龄"
              value={age}
              onChange={handleAge}
            />
          </Form.Item>
          <Form.Item label="是否启用" name="isEnable">
            <Radio.Group
              value={activate}
              onChange={(event) => {
                setActivate(event.target.value);
                console.log(event.target.value);
              }}
            >
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
