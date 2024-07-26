// // Search.tsx
// import { Input, Button, Row, Col } from 'antd';

// const Search = ({ onSearch }) => {
//   const [form] = Form.useForm();

//   const handleSearch = () => {
//     // 触发搜索
//     onSearch(form.getFieldsValue());
//   };

//   return (
//     <Row gutter={16}>
//       <Col span={6}>
//         <Form form={form}>
//           <Form.Item name="username">
//             <Input placeholder="根据用户名搜索" />
//           </Form.Item>
//         </Col>
//         <Col span={6}>
//           <Form.Item name="realname">
//             <Input placeholder="根据真实姓名搜索" />
//           </Form.Item>
//         </Col>
//         <Col span={6}>
//           <Button type="primary" onClick={handleSearch}>搜索</Button>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

// export default Search;
