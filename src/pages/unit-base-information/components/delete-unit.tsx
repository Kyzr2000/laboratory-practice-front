import { useMutation } from '@apollo/client';
import { Button, message, Modal } from 'antd';
import { useState } from 'react';

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


  // 添加一个弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);

  const deleteInput: DeleteUnitInput = {
    id: unitId,
  };

  const handleDeleteUnit = async () => {
    try {
      const result = await deleteUnit({ variables: { input: deleteInput } });
      if (result.data.deleteUnit) {
        message.success('单位删除成功');
        setIsModalVisible(false);
        if (onDeleted) {
          onDeleted(); // 调用父组件提供的回调函数
        }
      } else {
        message.error('单位删除失败,请检查是是否有用户关联该单位');
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      let errorMessage='单位删除失败';

      // 提取错误信息

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).graphQLErrors && (error as any).graphQLErrors.length > 0) {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorMessage = (error as any).graphQLErrors[0].message;
      }

      message.error(errorMessage);
    }
  };

  const handleOk = () => {
    handleDeleteUnit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
     <Button type="primary" danger ghost onClick={() => setIsModalVisible(true)}>
        删除
      </Button>
      <Modal
      title="删除单位"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认删除"
      cancelText="取消"
    >
      <p>确认删除此单位？</p>
    </Modal>
    </>
    
  );
};

export default DeleteUnitButton;