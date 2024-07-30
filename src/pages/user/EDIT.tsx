import { gql, useMutation } from '@apollo/client';
import { Form, Input, message, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { table1, table2 } from './recoil';

interface EDITPROPS {
  open: boolean;
  onCancel: () => void;
  user: {
    key: string;
    username: string;
    name: string;
    gender: string;
    age: string;
    use: string;
    operate: string;
  } | null;
}

const UPDATE = gql`
  mutation UUser($updateuser: UpdateUser!) {
    UUser(updateuser: $updateuser) {
      name
      gender
      age
      use
    }
  }
`;

const EDIT: React.FC<EDITPROPS> = ({ open, onCancel, user }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [use, setUse] = useState('');
  const [updateuser] = useMutation(UPDATE);
  const [form] = Form.useForm();
  const [state, setState] = useRecoilState(table1);
  const [state1, setState1] = useRecoilState(table2);

  const handleOk = () => {
    form.submit();
  };
  const onFinish = () => {
    updateuser({
      variables: {
        updateuser: {
          username: user?.username,
          name: name || user?.name,
          gender: gender || user?.gender,
          age: age || user?.age,
          use: use || user?.use,
        },
      },
    });
    setState(state + 1);
    setState1(state1 + 1);

    onCancel();
    message.success('编辑成功');
  };
  useEffect(() => {
    if (user) form.setFieldsValue(user);
  }, [user, form]);
  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        centered={true}
        title="编辑用户"
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form
          form={form}
          name="edit"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="id"
            name="key"
            rules={[{ required: true, message: '请输入你的id' }]}
          >
            <Input value={user?.key} disabled={true} />
          </Form.Item>

          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入你的账号' }]}
          >
            <Input value={user?.username} disabled={true} />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入你的名字' }]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
            <Radio.Group value={gender} onChange={(e) => setGender(e.target.value)}>
              <Radio value={'男'}>男</Radio>
              <Radio value={'女'}>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
            rules={[{ required: true, message: '请输入你的年龄' }]}
          >
            <Input value={age} onChange={(e) => setAge(e.target.value)} />
          </Form.Item>

          <Form.Item label="是否启用" name="use" rules={[{ required: true }]}>
            <Radio.Group value={use} onChange={(e) => setUse(e.target.value)}>
              <Radio value={'是'}>是</Radio>
              <Radio value={'否'}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EDIT;

// 将所有状态管理都交给 Form 组件
// import { gql, useMutation } from '@apollo/client';
// import { Form, Input, Modal, Radio } from 'antd';
// import { useEffect } from 'react';
// import { useRecoilState } from 'recoil';

// import { table1 } from './recoil';

// interface EDITPROPS {
//   open: boolean;
//   onCancel: () => void;
//   user: {
//     key: string;
//     username: string;
//     name: string;
//     gender: string;
//     age: string;
//     use: string;
//     operate: string;
//   } | null;
// }

// const UPDATE = gql`
//   mutation UUser($updateuser: UpdateUser!) {
//     UUser(updateuser: $updateuser) {
//       name
//       gender
//       age
//       use
//     }
//   }
// `;

// const EDIT: React.FC<EDITPROPS> = ({ open, onCancel, user }) => {
//   const [form] = Form.useForm();
//   const [updateuser] = useMutation(UPDATE);
//   const [state, setState] = useRecoilState(table1);

//   const handleOk = () => {
//     form.submit();
//   };

//   const onFinish = (values: { name: string; gender: string; age: string; use: string; }) => {
//     updateuser({
//       variables: {
//         updateuser: {
//           username: user?.username,
//           name: values.name,
//           gender: values.gender,
//           age: values.age,
//           use: values.use,
//         },
//       },
//     });
//     setState(state + 1);
//     onCancel();
//   };

//   useEffect(() => {
//     if (user)
//     form.setFieldsValue(user);
//   }, [user, form]);

//   const handleCancel = () => {
//     onCancel();
//   };

//   return (
//     <>
//       <Modal centered title="编辑用户" open={open} onCancel={handleCancel} onOk={handleOk}>
//         <Form
//           form={form}
//           name="basic"
//           labelCol={{ span: 4 }}
//           wrapperCol={{ span: 16 }}
//           style={{ maxWidth: 600 }}
//           onFinish={onFinish}
//           autoComplete="off"
//         >
//           <Form.Item label="id" name="key" rules={[{ required: true, message: '请输入你的id' }]}>
//             <Input disabled />
//           </Form.Item>

//           <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入你的账号' }]}>
//             <Input disabled />
//           </Form.Item>

//           <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入你的名字' }]}>
//             <Input />
//           </Form.Item>

//           <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择你的性别' }]}>
//             <Radio.Group>
//               <Radio value="男">男</Radio>
//               <Radio value="女">女</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入你的年龄' }]}>
//             <Input />
//           </Form.Item>

//           <Form.Item label="是否启用" name="use" rules={[{ required: true }]}>
//             <Radio.Group>
//               <Radio value="是">是</Radio>
//               <Radio value="否">否</Radio>
//             </Radio.Group>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default EDIT;
