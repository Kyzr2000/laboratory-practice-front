import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

import { AddSkill } from '@/pages/graphql/mutations';
import {
  GetSkillBySkillnameOrName,
  GetSkillBySkillnameOrNameNumber,
} from '@/pages/graphql/query';

interface DataType {
  id: number;
  description?: string;
  createdAt?: string;
  name?: string;
  user?: User | null;
  userSkills?: userSkills | null;
}
interface User {
  id: number;
  username?: string;
}
interface userSkills {
  userId: number;
  skillId?: number;
}
interface Currentpage {
  page: number;
  limit: number;
}
interface Values {
  description?: string;
  name?: string;
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
    GetSkillBySkillnameOrNameNumber,
    {
      variables: {
        data: {
          page: currentpage.page,
          limit: currentpage.limit,
        },
      },
      onCompleted(data) {
        settotal(data.GetSkillBySkillnameOrNameNumber);
      },
      // fetchPolicy: "cache-and-network",
    },
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery(GetSkillBySkillnameOrName, {
    variables: { data: { page: 1, limit: currentpage.limit } },
    onCompleted(data) {
      settableDate(data.getSkillBySkillnameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [add] = useMutation(AddSkill);

  const onCreate = async (values: Values) => {
    await add({
      variables: {
        data: {
          name: values.name,
          description: values.description,
        },
      },
    }).then(() => {
      refetchnumber();
      console.log(datanumber);
      setcurrentpage({ page: 1, limit: currentpage.limit });
      settotal(datanumber.getSkillBySkillnameOrNameNumber);
      refetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(data.getSkillBySkillnameOrName);
    setOpen(false);
  };

  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpen(true)}>
        添加技能
      </Button>
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      <Modal
        open={open}
        title="添加技能"
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
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="技能名称"
          rules={[
            {
              required: true,
              message: '请输入您的技能名称',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="技能描述"
          rules={[
            {
              required: true,
              message: '请输入您的技能描述',
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
