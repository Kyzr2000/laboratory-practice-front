// // EditUserModal.tsx
// import { useMutation } from '@apollo/client';
// import { Checkbox, Form, Input, message,Modal, Select } from 'antd';

// import { USER_UPDATE } from '../../../apis';

// const EditUserModal = ({ visible, onCancel, currentUser, refetch }) => {
//   const [form] = Form.useForm();

//   const [updateUser, { loading }] = useMutation(USER_UPDATE, {
//     onCompleted: (data) => {
//       message.success(data.message);
//       refetch();
//       onCancel(); // 关闭模态框
//     },
//     onError: (error) => {
//       message.error(error.message);
//     },
//   });

//   const handleOk = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         updateUser({ variables: { updateUserData: { ...values, id: currentUser.id } } });
//       })
//       .catch(() => {
//         message.error('表单验证失败，请检查输入！');
//       });
//   };

//   return (
//     <Modal
//       title="编辑用户"
//       open={visible}
//       onOk={handleOk}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <Form
//           form={form}
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 18 }}
//           onFinishFailed={(errorInfo) => {
//             console.log('Failed:', errorInfo);
//             message.error('表单验证失败，请检查输入！');
//           }}
//         >
//           <Form.Item
//             name="username"
//             label="用户名"
//             rules={[{ required: true, message: '请输入用户名!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             label="密码"
//             rules={[
//               // 如果是新增模式，则密码为必填项；如果是编辑模式，则密码为可选项
//               { required: !isEditMode, message: '请输入密码!' }
//             ]}
//           >
//             <Input.Password placeholder={isEditMode ? "如需修改密码，请输入新密码" : "请输入密码"} />
//           </Form.Item>
//           <Form.Item
//             name="realname"
//             label="真实姓名"
//             rules={[{ required: true, message: '请输入真实姓名!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="gender"
//             label="性别"
//             rules={[{ required: true, message: '请选择性别!' }]}
//           >
//             <Select>
//               <Select.Option value="1">男</Select.Option>
//               <Select.Option value="2">女</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="age"
//             label="年龄"
//             rules={[{ required: true, message: '请输入年龄!', type: 'number' }]}
//             normalize={(value) => {
//               return parseInt(value, 10);
//             }}
//           >
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item
//             name="role"
//             label="角色"
//             rules={[{ required: true, message: '请选择角色!' }]}
//           >
//             <Select>
//               {Object.entries(RoleOptions).map(([key, value]) => (
//                 <Select.Option key={key} value={value}>{value}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="isAdmin"
//             label="是否为管理员"
//             valuePropName="checked"
//           >
//             <Checkbox>是</Checkbox>
//           </Form.Item>
//           <Form.Item
//             name="isEnable"
//             label="是否启用"
//             valuePropName="checked"
//           >
//             <Checkbox>启用</Checkbox>
//           </Form.Item>
//         </Form>
//     </Modal>
//   );
// };

// export default EditUserModal;
