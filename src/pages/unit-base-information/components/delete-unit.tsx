import { useMutation } from '@apollo/client';
import { Button } from 'antd';

import { Delete_UNIT } from '@/pages/graphql/unit';



interface DeleteUnitButtonProps {
  unitId: number;
  onDeleted?: () => void; // 可选的回调函数，用于通知父组件用户已被删除
}

interface DeleteUnitInput {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DeleteUnitButton: React.FC<DeleteUnitButtonProps> = ({ unitId, onDeleted }) => {
  const [deleteUnit] = useMutation(Delete_UNIT);

  const deleteInput: DeleteUnitInput = {
    id: unitId,
  };

  const handleDeleteUser = async () => {
    try {
      // 调用 deleteUnit 时传递正确的 input 变量
      await deleteUnit({ variables: { input: deleteInput } });
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

export default DeleteUnitButton;