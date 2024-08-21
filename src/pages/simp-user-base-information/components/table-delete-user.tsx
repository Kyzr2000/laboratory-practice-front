import { useMutation } from '@apollo/client';
import { Button } from 'antd';

import { DELETE_SIMPLIFIED_USER_MUTATION } from '@/pages/graphql/simp-user';



interface DeleteUserButtonProps {
  userId: number;
  onDeleted?: () => void; // 可选的回调函数，用于通知父组件用户已被删除
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, onDeleted }) => {
  const [deleteSimplifiedUser] = useMutation(DELETE_SIMPLIFIED_USER_MUTATION);

  const handleDeleteUser = async () => {
    try {
      await deleteSimplifiedUser({ variables: { id: userId } });
      // onDeleted 回调函数是否存在
      console.log(onDeleted);
      if (onDeleted) {
        onDeleted(); // 调用父组件提供的回调函数
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Button type="primary" danger ghost onClick={handleDeleteUser}>
      删除
    </Button>
  );
};

export default DeleteUserButton;