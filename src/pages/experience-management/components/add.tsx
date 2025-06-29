import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

import { AddExperience } from '@/pages/graphql/mutations';
import {
  GetExperienceByExperiencenameOrName,
  GetExperienceByExperiencenameOrNameNumber,
} from '@/pages/graphql/query';

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
interface Values {
  placeName?: string;
  createdAt?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  userName: string;
}
interface MyComponentProps {
  settotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
  setcurrentpage: React.Dispatch<React.SetStateAction<Currentpage>>;
}

const Add: React.FC<MyComponentProps> = ({
  settotal,
  currentpage,
  settableDate,
  setcurrentpage,
}: MyComponentProps) => {
  const { data: datanumber, refetch: refetchnumber } = useQuery(
    GetExperienceByExperiencenameOrNameNumber,
    {
      variables: {
        data: {
          page: currentpage.page,
          limit: currentpage.limit,
        },
      },
      onCompleted(data) {
        settotal(data.getExperienceByExperiencenameOrNameNumber);
      },
      // fetchPolicy: "cache-and-network",
    },
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery(GetExperienceByExperiencenameOrName, {
    variables: { data: { page: 1, limit: currentpage.limit } },
    onCompleted(data) {
      settableDate(data.getExperienceByExperiencenameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [add] = useMutation(AddExperience);

  const onCreate = async (values: Values) => {
    await add({
      variables: {
        data: {
          placeName: values.placeName,
          address: values.address,
          startDate: values.startDate,
          endDate: values.endDate,
          userName: values.userName,
        },
      },
    }).then(() => {
      refetchnumber();
      console.log(datanumber);
      setcurrentpage({ page: 1, limit: currentpage.limit });
      settotal(datanumber.getExperienceByExperiencenameOrNameNumber);
      refetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(data.getExperienceByExperiencenameOrName);
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
        添加社会经验
      </Button>
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      <Modal
        open={open}
        title="添加社会经历"
        okText="Create"
        cancelText="Cancel"
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
            onFinish={(values) => onCreate(values)}
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

export default Add;
