// import { useQuery } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteOutlined, SyncOutlined } from '@mui/icons-material';
import type { TableProps } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import React, { useState } from 'react';

import { DeleteUnit, UpdateUnit1 } from '@/pages/graphql/mutations';
import {
  GetUnitByUnitnameOrName,
  GetUnitByUnitnameOrNameNumber,
} from '@/pages/graphql/query';

// import { GetUserByUsernameOrName } from '@/pages/graphql/query';
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

interface MyComponentProps {
  name: string | undefined;
  total: number | undefined;
  settotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  tableDate: DataType[];
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
  setcurrentpage: React.Dispatch<React.SetStateAction<Currentpage>>;
}

interface Values {
  id?: number;
  name?: string;
  uuid?: string;
  createdAt?: string;
}

const TableDate: React.FC<MyComponentProps> = ({
  name,
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
  } = useQuery(GetUnitByUnitnameOrName, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        name: name || undefined,
      },
    },
    onCompleted(data) {
      settableDate(data.getUnitByUnitnameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { data: num, refetch: refnum } = useQuery(GetUnitByUnitnameOrNameNumber, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        name: name || undefined,
      },
    },
    onCompleted(data) {
      settotal(data.getUnitByUnitnameOrNameNumber);
    },
    // fetchPolicy: "cache-and-network",
  });
  const [deleteUnit] = useMutation(DeleteUnit);

  // 删除的回调
  const deleteunit = async (name: string | undefined) => {
    await deleteUnit({ variables: { data: name } });

    refnum();
    settotal(num);
    searchrefetch({
      variables: { data: { page: currentpage.page, limit: currentpage.limit } },
    });
    settableDate(searchdata.getUnitByUnitnameOrName);
  };

  // 修改
  // 表单的xuanze

  const [form] = Form.useForm();
  const [formusername, setformusername] = useState<DataType>();
  const [open, setOpen] = useState(false);

  console.log(formusername);

  const [updateUnit1] = useMutation(UpdateUnit1);
  // // 更新的回调
  const onUpdata = (values: Values) => {
    console.log(values);

    updateUnit1({
      variables: {
        data: {
          uuid: formusername?.uuid,
          name: values.name,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(searchdata.getUnitByUnitnameOrName);

    setOpen(false);
    refnum();
  };
  //

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '单位名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '编号',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <a>{text}</a>,
    },

    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确认更改?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => {
              setOpen(true);
              setformusername(record);
            }}
          >
            <Button icon={<SyncOutlined />}>修改 </Button>
          </Popconfirm>

          <Popconfirm
            okText="确认"
            cancelText="取消"
            title="确认删除?"
            onConfirm={() => deleteunit(record.name)}
          >
            <Button danger icon={<DeleteOutlined />}>
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
          name="name"
          label="单位名称"
          rules={[
            {
              required: true,
              message: '请输入您的单位名称',
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
