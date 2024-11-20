import { useMutation, useQuery } from '@apollo/client';
import type {TableProps } from 'antd';
import { Table as AntTable} from 'antd';
import {
  Button,
  Form,
  Input,
  Select,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

import {CHANGE_TEST_DATA, DELETE_TEST_DATA, GET_PAGINATED_TEST_DATA, GET_TEST_DATA_BY_ACCOUNT} from './gql';

interface DataType{
  id: number;
  account: string;
  name: string;
  gender: string;
  age: number;
  isEnable: boolean;
  todo: any;
}
interface searchProps{
  searchData: (data: any[]) => void;
  TableData: (data: any[]) => void;
  TableBack: (data: any[]) => void;
}
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};




const Table=({searchData,TableData,TableBack}: any) => {
  const [form] = Form.useForm();
  const [userData,setUserData]=useState<DataType[]>([]);
  const userDataRef = useRef<DataType[]>([]);
  const [deleter]=useMutation(DELETE_TEST_DATA);
  const [changer]=useMutation(CHANGE_TEST_DATA);
  const [isVisible, setIsVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); 
  const [changeValue,setChangeValue]=useState({id:'',account:'',name:'',gender:'',age:'n',isEnable:true});
  const [filters, setFilters] = useState({ account: '', name: '' });
  const [error,setError]=useState({noError:0,typeError:'TypeError: Cannot read property \'property\' of undefined'});
  const { data, loading, refetch } = useQuery(GET_TEST_DATA_BY_ACCOUNT, {
    variables: {account:filters.account},
  });
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => {
        // index 为当前页的数据索引
        return (pagination.current - 1) * pagination.pageSize + index + 1;}
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
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      key: 'isEnable',
    },
    {
      title: '操作',
      key: 'todo',
      dataIndex: 'todo',
      
    },
  ];
  const updateUserData = (newData: DataType[]) => {
    setUserData(newData);
    userDataRef.current = newData; // 更新 Ref 的值
  };
  async function deleteData(account: string) {
    const { data } = await deleter({
      variables: { account },
    });

    // 使用最新的 userDataRef.current
    const newData = userDataRef.current.filter(
      (item: any) => item.account !== data.deleteTestData.account
    );
    updateUserData(newData); // 更新状态和 Ref
  }// 用于拿取数据，防止旧数据影响


  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    refetch({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    // 此处可以触发后端分页 API
  };


  useEffect(()=>{
    console.log('searcheDataeffect');
    console.log(searchData);
    let Arr = searchData.data.map((item: any) => ({
      key: item.id,
      ...item,
      isEnable : item.isEnable === true ? '是' : item.isEnable ===false ? '否' : '',
      todo: <><Button onClick={()=>changeData(item)}>编辑</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button onClick={()=>deleteData(item.account)}>删除</Button></>
       })).sort((a: any, b: any) => a.id - b.id);
       console.log(Arr);
       if (!searchData || !searchData.data || searchData.data.length === 0) {
        setError(prev=>({...prev,noError:0}));
      } else {
        setError(prev=>({...prev,noError:1}));
      }
       updateUserData(Arr);
       if (searchData.search==0) {
        setPagination({ current: 1, pageSize: 10 });
       }
  },[searchData]);// 初始化和搜索后重新传入数据


  const onFinish = (values: any) => {// 更新完成后调用，会重置数据并刷新数据，让页面上的数据为最新
   const newData = userDataRef.current.map(
    (item: any) => {
      if (item.account==changeValue.account) {
        return  {
        id:changeValue.id,
        account:values.account,
        name:values.name,
        gender:values.gender,
        age:values.age ? Number(values.age) : null,
        isEnable : values.isEnable ===true ? '是' : values.isEnable === false ? '否' : '',
      todo: <><Button onClick={()=>changeData(changeValue)}>编辑</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button onClick={()=>deleteData(changeValue.account)}>删除</Button></>
      };
      }
    else return item;
  }
  );
  if (!data||filters.account==changeValue.account) {
changer({
          variables: { 
            changeTestData:{
              id:changeValue.id,
              account:values.account,
              name:values.name,
              gender:values.gender,
              age:values.age ? Number(values.age) : null,
              isEnable:values.isEnable
            }
          },
      });
    alert('修改成功');
   } else alert('修改失败');
  updateUserData(newData);
    setIsVisible(false);
  };


  async function changeData(data: any) {
    setChangeValue(data);
    setIsVisible(true);
  }// 打开编辑表单并把已有数据放入表单,这步是除了初始值的第一次给changeValue

useEffect(()=>{ 
   if (isVisible) {
  form.setFieldsValue(changeValue); // 动态更新表单字段值
}},[changeValue]);// 打开表单后会调用，把按钮所在数据传进表单
useEffect(()=>{ 
    TableData(pagination);
},[pagination]);// 打开表单后会调用，把按钮所在数据传进表单



    return (
      <div>
     {error.noError?<AntTable<DataType> columns={columns} dataSource={userData} pagination={{...pagination, total:searchData.total}} onChange={handleTableChange} loading={loading}/>:<div><h1>{error.typeError}</h1></div> }
    {isVisible && (<Form
    {...formItemLayout}
    form={form}
    name="addNewUser"
    onFinish={onFinish}
    initialValues={{
      account:changeValue.account,
      name:changeValue.name,
      gender:changeValue.gender,
      age:changeValue.age,
      isEnable:changeValue.isEnable
    }}
    style={{ maxWidth: 600,
        position: 'absolute',
        top: 170,
        left: 650,
        zIndex: 1000,
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '0 0 1000px rgba(0, 0, 0, 0.2)',
    }}
    scrollToFirstError
  >
    <Form.Item
      name="account"
      label="账号"
      rules={[
        {
          required: true,
          message: '请输入账号',
        },
      ]}
    >
      <Input  onChange={(e)=>setFilters(prev => ({ ...prev, name: e.target.value }))} />
    </Form.Item>

    <Form.Item
      name="name"
      label="姓名"
      rules={[{ required: true, message: '请输入姓名!', whitespace: true }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="gender"
      label="性别"
      rules={[
        {
          required: false,
          message: '你的性别是？',
        },
      ]}
      hasFeedback
    >
      <Select placeholder="选择你的性别">
        <Option value="男">男</Option>
        <Option value="女">女</Option>
      </Select>
    </Form.Item>   

    <Form.Item
      name="age"
      label="年龄"
      rules={[{ required: false, message: '请输入你的年龄' }]}
    >
        <Input />
    </Form.Item>

    <Form.Item
      name="isEnable"
      label="是否启用"
      rules={[{ required: false, message: '启用？' }]}
    >
      <Select placeholder="是否启用">
        <Option value={true}>是</Option>
        <Option value={false}>否</Option>
      </Select>
    </Form.Item>

    <Form.Item {...tailFormItemLayout}>
      <Button type="primary" htmlType="submit">
        确认
      </Button>
    </Form.Item>
  </Form>)}
  </div>
);};

export default Table;