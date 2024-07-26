// // Table.tsx
// import { Button, Space,Table } from 'antd';
// import { ColumnsType } from 'antd/es/table';

// interface User {
//     id: string;
//     username: string;
//     realname: string;
//     gender: string;
//     age: number;
//     isEnable: boolean;
//     password: string;
//     role: string;
//     isAdmin: boolean;
// }

// const UserTable = ({ users, onEdit, onDelete }) => {
//     const columns: ColumnsType<User> = [
//         {
//           title: '序号',
//           dataIndex: 'index',
//           key: 'index',
//           align: 'center', // 添加这一行
//           width: 100,
//           render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
//         },
//         {
//           title: '用户名',
//           dataIndex: 'username',
//           key: 'username',
//           align: 'center', // 添加这一行
//           width: 100,
//         },
//         {
//           title: '真实姓名',
//           dataIndex: 'realname',
//           key: 'realname',
//           align: 'center', // 添加这一行
//           width: 100,
//         },
//         {
//           title: '性别',
//           dataIndex: 'gender',
//           key: 'gender',
//           align: 'center', // 添加这一行
//           width: 100,
//           render: (gender) => (gender === 1 ? '男' : '女'),
//         },
//         {
//           title: '年龄',
//           dataIndex: 'age',
//           key: 'age',
//           align: 'center', // 添加这一行
//           width: 100,
//         },
//         {
//           title: '启用状态',
//           dataIndex: 'isEnable',
//           key: 'isEnable',
//           align: 'center', // 添加这一行
//           width: 100,
//           render: (isEnable) => (isEnable ? '启用' : '禁用'),
//         },
//         {
//           title: '操作',
//           key: 'action',
//           align: 'center', // 添加这一行
//           width: 200,
//           render: (_, record) => (
//             <Space size="middle">
//               <Button type="link" onClick={() => showModal(record)}>编辑</Button>
//               <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
//             </Space>
//           ),
//         },
//       ];

//   return (
//     <Table
//       dataSource={users}
//       columns={columns}
//       rowKey="id"
//     />
//   );
// };

// export default UserTable;
