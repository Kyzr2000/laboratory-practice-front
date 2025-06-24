import { useMutation } from '@apollo/client';
import type { ApolloError } from '@apollo/client';

import { DELETE_USER } from '../graphql/mutations';
import type { User } from '../type';
import ChangeUser from './ChangeUser';

interface UserManagementTableProps {
  users: User[];
  loading: boolean;
  error: ApolloError | undefined;
  setDeleteTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setChangeTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number; // 当前页码
  pageSize: number; // 每页大小
}

const UserManagementTable = ({
  users,
  loading,
  error,
  setDeleteTrigger,
  setChangeTrigger,
  currentPage,
  pageSize,
}: UserManagementTableProps) => {
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setDeleteTrigger(true);
    },
    onError: (error) => {
      console.error('删除用户失败:', error.message);
    },
  });

  const handleDelete = (username: string) => {
    if (window.confirm(`确定要删除用户 ${username} 吗？`)) {
      deleteUser({
        variables: { username },
      });
    }
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p>发生错误: {error.message}</p>;

  return (
    <div style={{ overflowX: 'auto', position: 'relative', height: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={thStyle}>序号</th> {/* 新增序号列 */}
            <th style={thStyle}>用户名</th>
            <th style={thStyle}>姓名</th>
            <th style={thStyle}>性别</th>
            <th style={thStyle}>年龄</th>
            <th style={thStyle}>是否启用</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr style={trStyle} key={user.username}>
              {/* 计算序号：当前页第一条的序号为 (currentPage-1)*pageSize+1，然后按行递增 */}
              <td style={tdStyle}>{(currentPage - 1) * pageSize + index + 1}</td>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.realname}</td>
              <td style={tdStyle}>{user.gender === 0 ? '男' : '女'}</td>
              <td style={tdStyle}>{user.age}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    padding: '2px 8px',
                  }}
                >
                  {user.isEnable ? '启用' : '禁用'}
                </span>
              </td>
              <td className="change-button-box">
                <ChangeUser user={user} setChangeTrigger={setChangeTrigger} />
                <button
                  className="change-button"
                  onClick={() => handleDelete(user.username)}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  width: '150px',
  height: '35px',
  textAlign: 'left',
  padding: '8px',
  borderBottom: '2px solid rgba(62 136 62/ 20%)',
  border: '2px solid rgba(62 136 62/ 20%)',
};

const tdStyle: React.CSSProperties = {
  textAlign: 'left',
};

const trStyle: React.CSSProperties = {
  height: '51px',
  borderBottom: '1px solid rgba(62 136 62/ 20%)',
};
export default UserManagementTable;
