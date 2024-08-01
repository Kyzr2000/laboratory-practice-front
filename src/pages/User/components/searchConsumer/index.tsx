// import { useQuery } from '@apollo/client';
// import { SearchOutlined } from '@mui/icons-material';
// import { Button, Form, Input, message } from 'antd';
// import { useRecoilState } from 'recoil';

// import { FIND_MANY } from '@/pages/graphql/query';
// import { nicknameState, usernameState } from '@/store';

// function SearchConsumer() {
//   const [username, setUsername] = useRecoilState(usernameState);

//   const [nickname, setNickname] = useRecoilState(nicknameState);

//   const { data } = useQuery(FIND_MANY, {
//     variables: {
//       username: username,
//       nickname: nickname,
//     },
//   });

//   return (
//     <Form
//       layout="inline"
//       onFinish={() => {
//         message.success('查询成功');
//         console.log(data.findManyByUsernameOrNickname);
//       }}
//     >
//       <Form.Item label="账号">
//         <Input
//           placeholder="请输入关键词"
//           onChange={(event) => {
//             setUsername(event.target.value);
//           }}
//         />
//       </Form.Item>
//       <Form.Item label="名字">
//         <Input
//           placeholder="请输入关键词"
//           onChange={(event) => {
//             setNickname(event.target.value);
//           }}
//         />
//       </Form.Item>
//       <Form.Item>
//         <Button htmlType="submit" type="primary" icon={<SearchOutlined />} />
//       </Form.Item>
//     </Form>
//   );
// }

// export default SearchConsumer;
