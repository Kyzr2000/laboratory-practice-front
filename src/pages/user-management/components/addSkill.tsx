import { useMutation, useQuery } from '@apollo/client';
import { Button, Col, Form, Input, List, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import {
  AssignSkillToUser,
  DeleteSkillToUser,
  UpdateSkill1,
} from '@/pages/graphql/mutations';
import { Getskill, GetUserByUsernameOrName } from '@/pages/graphql/query';
interface DataType {
  id?: number;
  username?: string;
  password?: string;
  realname?: string;
  gender?: number | null;
  age?: number | null;
  telephone?: string | null;
  email?: string | null;
  address?: string | null;
  introduction?: string | null;
  unit?: Unit | null;
  userSkills?: userSkills | null;
  getSkills?: getSkills[];
}
interface userSkills {
  userId: number;
  skillId?: number;
}
interface getSkills {
  id?: number;
  name?: string;
  description?: string;
}
interface Unit {
  name?: string;
  id?: number;
  uuid?: string;
  createdAt?: string;
}

interface Values {
  description?: string;
  name?: string;
}
interface Currentpage {
  page: number;
  limit: number;
}
interface MyComponentProps {
  currentRow: DataType;
  realname: string | undefined;
  username: string | undefined;
  showModal: (record: DataType) => void;
  settableDate: React.Dispatch<React.SetStateAction<DataType[]>>;
  currentpage: Currentpage;
}

const AddSkill: React.FC<MyComponentProps> = ({
  currentRow,
  realname,
  username,
  settableDate,
  currentpage,
}) => {
  console.log(currentRow.getSkills, 12);
  // 添加
  const [form] = Form.useForm();
  const [assignSkillToUser, { data: dataskill }] = useMutation(AssignSkillToUser);

  const { refetch: searchrefetch, loading } = useQuery(GetUserByUsernameOrName, {
    variables: {
      data: {
        page: currentpage.page,
        limit: currentpage.limit,
        username: username || undefined,
        realname: realname || undefined,
      },
    },
    onCompleted(data) {
      settableDate(data.getUserByUsernameOrName);
    },
  });
  // 添加
  const id1 = Number(currentRow?.id);
  const onFinish = (values: Values) => {
    assignSkillToUser({
      variables: {
        data: {
          userId: id1,
          skillName: values.name,
          description: values.description,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: {
            page: currentpage.page,
            limit: currentpage.limit,
            username: username || undefined,
            realname: realname || undefined,
          },
        },
      });
    });
  }; // 添加
  const [skillList, setSkillList] = useState<getSkills[]>(currentRow?.getSkills || []);
  // 添加后更新值
  useEffect(() => {
    if (dataskill) {
      console.log('操作成功，返回数据:', dataskill);
      setSkillList(dataskill.assignSkillToUser.user.getSkills);
    }
  }, [dataskill]);
  // 切换用户显示该用户的表单
  useEffect(() => {
    setSkillList(currentRow?.getSkills || []);
  }, [currentRow]);

  const [deleteSkillToUser, { data }] = useMutation(DeleteSkillToUser);
  // 删除
  const removeskill = (item: getSkills) => {
    deleteSkillToUser({
      variables: {
        data: {
          userId: id1,
          skillName: item.name,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: {
            page: currentpage.page,
            limit: currentpage.limit,
            username: username || undefined,
            realname: realname || undefined,
          },
        },
      });
    });
  };
  // 删除后更新值
  useEffect(() => {
    if (data) {
      console.log('操作成功，返回数据:', data);
      setSkillList(data.deleteSkillToUser.user.getSkills);
    }
  }, [data]);
  const [updateSkill1] = useMutation(UpdateSkill1);
  console.log(updateSkill1);
  const { data: getskill, refetch: reskill } = useQuery(Getskill, {
    variables: { data: 80 },
  });
  const [open, setOpen] = useState(false);
  const [currentList, setCurrentList] = useState<getSkills>();
  console.log(currentList);
  const onCreate = (values: getSkills) => {
    updateSkill1({
      variables: {
        data: {
          id: currentList?.id,
          description: values?.description,
        },
      },
    }).then(() => {
      searchrefetch({
        variables: {
          data: { page: currentpage.page, limit: currentpage.limit },
        },
      });
      reskill({ variables: { data: 80 } }).then(() => {
        console.log('Received sadas of form: ', getskill.user.getSkills);
      });
      setOpen(false);
    });
  };
  useEffect(() => {
    if (getskill) {
      console.log('操作成功，返回数据:', getskill.getskill[0].user.getSkills);
      setSkillList(getskill.getskill[0].user.getSkills);
    }
  }, [getskill]);

  return (
    <>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
        <Row>
          <Col span={9}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入您的技能名称!' }]}
            >
              <Input placeholder="技能名称" />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name="description"
              rules={[{ required: true, message: '请简单介绍下您的技能!' }]}
            >
              <Input placeholder="介绍下您的技能" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item shouldUpdate>
              {() => (
                <Button type="primary" htmlType="submit">
                  添加技能
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <List
        loading={loading}
        className="demo-loadmore-list"
        // itemLayout="horizontal"
        dataSource={skillList}
        renderItem={(item) => (
          <>
            <List.Item
              actions={[
                <a
                  onClick={() => {
                    setOpen(true);
                    setCurrentList(item);
                  }}
                  key="list-loadmore-edit"
                >
                  修改
                </a>,
                <a onClick={() => removeskill(item)} key="list-loadmore-more">
                  删除
                </a>,
              ]}
            >
              {/* <Skeleton avatar title={false} active> */}
              <List.Item.Meta title={<a>{item?.name}</a>} />
              <div>{item?.description}</div>
              {/* </Skeleton> */}
            </List.Item>
          </>
        )}
      />
    </>
  );
};

export default AddSkill;

interface Values1 {
  title: string;
  description?: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values1) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        {/* <Form.Item
          name="name"
          label="技能名称"
          rules={[
            {
              required: true,
              message: "请输入您的ji'nengjineng!",
            },
          ]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="description"
          label="描述"
          rules={[
            {
              required: true,
              message: '请输入您的描述!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
