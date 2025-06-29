// import { useQuery } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import type { TableProps } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import React, { useState } from 'react';

import { DeleteExperience, UpdateExperience1 } from '@/pages/graphql/mutations';
import {
  GetExperienceByExperiencenameOrName,
  GetExperienceByExperiencenameOrNameNumber,
} from '@/pages/graphql/query';

// import { GetUserByUsernameOrName } from '@/pages/graphql/query';
interface DataType {
  id: number;
  placeName?: string;
  createdAt?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  user?: User | null;
}
interface User {
  id: number;
  username?: string;
}
interface Currentpage {
  page: number;
  limit: number;
}

interface MyComponentProps {
  placeName: string | undefined;
  total: number | undefined;
  settotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  tableDate: DataType[];
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
  setcurrentpage: React.Dispatch<React.SetStateAction<Currentpage>>;
}

interface Values {
  id: number;
  placeName?: string;
  createdAt?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  userName: string;
}

const TableDate: React.FC<MyComponentProps> = ({
  placeName,
  total,
  settotal,
  currentpage,
  setcurrentpage,
  tableDate,
  settableDate,
}: MyComponentProps) => {
  const {
    data: searchdata,
    refetch: searchrefetch,
    loading,
  } = useQuery(GetExperienceByExperiencenameOrName, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        placeName: placeName || undefined,
      },
    },
    onCompleted(data) {
      settableDate(data.getExperienceByExperiencenameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { data: num, refetch: refnum } = useQuery(
    GetExperienceByExperiencenameOrNameNumber,
    {
      variables: {
        data: {
          page: currentpage.page,
          limit: currentpage.limit,
          placeName: placeName || undefined,
        },
      },
      onCompleted(data) {
        settotal(data.getExperienceByExperiencenameOrNameNumber);
      },
      // fetchPolicy: "cache-and-network",
    },
  );
  const [deleteExperience] = useMutation(DeleteExperience);

  // 删除的回调
  const deleteexperience = async (id: number) => {
    console.log(deleteExperience);
    console.log(id);

    deleteExperience({ variables: { data: Number(id) } });

    refnum();
    settotal(num);
    searchrefetch({
      variables: { data: { page: currentpage.page, limit: currentpage.limit } },
    });
    settableDate(searchdata.getExperienceByExperiencenameOrName);
  };

  // 修改
  // 表单的xuanze

  const [form] = Form.useForm();
  const [formusername, setformusername] = useState<DataType>();
  const [open, setOpen] = useState(false);

  const [updateExperience1] = useMutation(UpdateExperience1);
  // // 更新的回调

  const onUpdata = (values: Values) => {
    updateExperience1({
      variables: {
        data: {
          id: formusername?.id,
          placeName: values.placeName,
          address: values.address,
          startDate: values.startDate,
          endDate: values.endDate,
          userName: values.userName,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(searchdata.getExperienceByExperiencenameOrName);

    setOpen(false);
    refnum();
  };
  //

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '工作地',
      dataIndex: 'placeName',
      key: 'placeName',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
    },
    {
      title: '用户',
      align: 'center',
      render: (_, record) => record.user?.username || '未关联用户',
      key: 'user',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },

    {
      title: '操作',
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            variant="outlined"
            color="primary"
            style={{ width: 85 }}
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setformusername(record);
            }}
          >
            修改{' '}
          </Button>

          <Popconfirm
            okText="确认"
            cancelText="取消"
            title="确认删除?"
            onConfirm={() => deleteexperience(record.id)}
          >
            <Button style={{ width: 85 }} danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newReversedArray = [...tableDate];
  const data: DataType[] = [...newReversedArray];

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: currentpage.page,
          pageSize: currentpage.limit,
          total: total,
          onChange(page, pageSize) {
            setcurrentpage({ page, limit: pageSize });
          },
        }}
      />
      <Modal
        open={open}
        title="更改信息"
        okText="确认"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(values) => onUpdata(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="placeName"
          label="工作地"
          rules={[
            {
              required: true,
              message: '请输入您的工作地',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="实践地址"
          rules={[
            {
              required: true,
              message: '请输入您的实践地址',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="开始时间"
          rules={[
            {
              required: true,
              message: '请输入您的开始时间',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="结束时间"
          rules={[
            {
              required: true,
              message: '请输入您的结束时间',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="userName"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入您的用户名',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Modal>
    </>
  );
};

export default TableDate;
