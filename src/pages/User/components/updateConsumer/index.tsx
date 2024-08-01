// import { EditOutlined } from '@ant-design/icons';
// import { Button, Form, Input, InputNumber, message, Modal, Radio } from 'antd';
// import { useRecoilState } from 'recoil';

// import {
//   activateState,
//   ageState,
//   genderState,
//   nicknameState,
//   updateIsShowState,
//   usernameState,
// } from '@/store';

// import type { IProps } from '../..';

// function UpdateConsumer(props: IProps) {

//   const [updateIsShow, setUpdateIsShow] = useRecoilState(updateIsShowState);
//   const [, setUsername] = useRecoilState(usernameState);
//   const [, setNickname] = useRecoilState(nicknameState);
//   const [gender, setGender] = useRecoilState(genderState);
//   const [age, setAge] = useRecoilState(ageState);
//   const [activate, setActivate] = useRecoilState(activateState);

//   const [updateForm] = Form.useForm();

//   const handleAge = (value: number | null) => {
//     setAge(value);
//     console.log(value);
//   };

//   return (
//     <div>
//       <Modal
//         forceRender
//         title="添加"
//         open={updateIsShow}
//         // 点击遮罩层是不关闭
//         maskClosable={false}
//         onCancel={() => {
//           setUpdateIsShow(false);
//         }}
//         // 关闭modal的时候清除数据
//         destroyOnClose
//         onOk={() => {
//           // formRef.current?.(); // 手动触发表单的提交事件
//           updateForm.submit();
//           setUpdateIsShow(false);
//         }}
//       >
//         <Form
//           // 表单配合modal一起使用的时候，需要设置这个属性，要不然关了窗口之后不会清空数据
//           preserve={false}
//           // 提交表单
//           onFinish={(value) => {
//             message.success('保存成功');
//             console.log(value);
//           }}
//           // 使输入框对齐
//           labelCol={{ span: 3 }}
//           // form={updateForm}
//         >
//           <Form.Item
//             label="账号"
//             name="username"
//             rules={[
//               {
//                 required: true,
//                 message: '请输入账号',
//               },
//             ]}
//           >
//             <Input
//               placeholder="请输入账号"
//               onChange={(event) => {
//                 setUsername(event.target.value);
//               }}
//             />
//           </Form.Item>
//           <Form.Item label="姓名" name="name">
//             <Input
//               placeholder="请输入姓名"
//               onChange={(event) => {
//                 setNickname(event.target.value);
//               }}
//             />
//           </Form.Item>
//           <Form.Item label="性别" name="gender">
//             <Radio.Group
//               onChange={(event) => {
//                 setGender(event.target.value);
//                 console.log(event.target.value);
//               }}
//               value={gender}
//             >
//               <Radio value="男">男</Radio>
//               <Radio value="女">女</Radio>
//             </Radio.Group>
//           </Form.Item>
//           <Form.Item label="年龄" name="age">
//             <InputNumber
//               min={1}
//               max={100}
//               placeholder="请输入年龄"
//               value={age}
//               onChange={handleAge}
//             />
//           </Form.Item>
//           <Form.Item label="是否启用" name="activate">
//             <Radio.Group
//               onChange={(event) => {
//                 setActivate(event.target.value);
//                 console.log(event.target.value);
//               }}
//               value={activate}
//             >
//               <Radio value={true}>是</Radio>
//               <Radio value={false}>否</Radio>
//             </Radio.Group>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Button
//         type="primary"
//         icon={<EditOutlined />}
//         onClick={() => {
//           setUpdateIsShow(true);
//           console.log(props.r);
//           console.log(updateForm);
//           updateForm.setFieldsValue(props.r);

//           // myForm.setFieldsValue()
//         }}
//       />
//     </div>
//   );
// }

// export default UpdateConsumer;
