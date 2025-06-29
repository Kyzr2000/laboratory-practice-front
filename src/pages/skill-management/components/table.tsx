// import { useQuery } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import type { TableProps } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { DeleteSkill, UpdateSkill1 } from '@/pages/graphql/mutations';
import {
  GetSkillBySkillnameOrName,
  GetSkillBySkillnameOrNameNumber,
} from '@/pages/graphql/query';

// import { GetUserByUsernameOrName } from '@/pages/graphql/query';
interface DataType {
  id: number;
  description?: string;
  createdAt?: string;
  name?: string;
  user?: User | null;
  userSkills?: userSkills | null;
  getUsers?: getUsers[] | null;
}

interface getUsers {
  id: number;
  username?: string;
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
  description?: string;
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
  } = useQuery(GetSkillBySkillnameOrName, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        name: name || undefined,
      },
    },
    onCompleted(data) {
      settableDate(data.getSkillBySkillnameOrName);
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { data: num, refetch: refnum } = useQuery(GetSkillBySkillnameOrNameNumber, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        name: name || undefined,
      },
    },
    onCompleted(data) {
      settotal(data.getSkillBySkillnameOrNameNumber);
    },
    // fetchPolicy: "cache-and-network",
  });
  const [deleteSkill] = useMutation(DeleteSkill);

  // 删除的回调
  const deleteskill = async (id: number) => {
    console.log(deleteSkill);
    console.log(id);

    deleteSkill({ variables: { data: Number(id) } });

    refnum();
    settotal(num);
    searchrefetch({
      variables: { data: { page: currentpage.page, limit: currentpage.limit } },
    });
    settableDate(searchdata.getSkillBySkillnameOrName);
  };

  // 修改
  // 表单的xuanze

  const [form] = Form.useForm();
  const [formusername, setformusername] = useState<DataType>();
  const [open, setOpen] = useState(false);

  const [updateSkill1] = useMutation(UpdateSkill1);
  // // 更新的回调

  const onUpdata = (values: Values) => {
    updateSkill1({
      variables: {
        data: {
          id: formusername?.id,
          description: values.description,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
    });
    settableDate(searchdata.getSkillBySkillnameOrName);

    setOpen(false);
    refnum();
  };
  //
  console.log(searchdata);

  // 技能绑定的用户start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<DataType>();
  const showModal = (record: DataType) => {
    setIsModalOpen(true);
    setCurrentRow(record);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 技能绑定的用户end
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '技能名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '用户',
      align: 'center',
      render: (record) => (
        <>
          <Button
            type="primary"
            variant="outlined"
            color="primary"
            style={{ fontSize: 16 }}
            onClick={() => {
              showModal(record);
              console.log(record);
            }}
          >
            绑定的用户
          </Button>
        </>
      ),
      key: 'getUsers',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
            修改
          </Button>

          <Popconfirm
            okText="确认"
            cancelText="取消"
            title="确认删除?"
            onConfirm={() => deleteskill(record.id)}
          >
            <Button danger style={{ width: 85 }} icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  console.log(currentRow);

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
        title="绑定用户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <div>
          {currentRow?.getUsers?.length ? (
            <div>
              {currentRow.getUsers.map((user) => (
                <div key={user.id}>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <span>未绑定用户</span>
            </div>
          )}
        </div>
      </Modal>
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

export default TableDate;
