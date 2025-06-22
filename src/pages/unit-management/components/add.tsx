import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

import { AddUnit } from '@/pages/graphql/mutations';
import {
  GetUnitByUnitnameOrName,
  GetUnitByUnitnameOrNameNumber,
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
  id?: number;
  name?: string;
  uuid?: string;
  createdAt?: string;
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
}: MyComponentProps) => {
  const { data: datanumber, refetch: refetchnumber } = useQuery(
    GetUnitByUnitnameOrNameNumber,
    {
      onCompleted(data) {
        settotal(data.getUnitByUnitnameOrNameNumber);
      },
      fetchPolicy: 'cache-and-network',
    },
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery(GetUnitByUnitnameOrName, {
    variables: { data: { page: 1, limit: currentpage.limit } },
    onCompleted(data) {
      settableDate(data.getUnitByUnitnameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [add] = useMutation(AddUnit);

  const onCreate = async (values: Values) => {
    await add({
      variables: {
        data: {
          name: values.name,
        },
      },
    }).then(() => {
      refetchnumber();
      settotal(datanumber);
      refetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(data.getUnitByUnitnameOrName);
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        添加单位
      </Button>
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      <Modal
        open={open}
        title="Create a new collection"
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

export default Add;
