import { useMutation } from '@apollo/client';
import { Button, message, Popconfirm } from 'antd';

import { DelUser } from '@/pages/graphql/mutations';
export default function Del_user({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess: () => void;
}) {
  const [delUser] = useMutation(DelUser);
  function onConfirm() {
    console.log(id);
    delUser({
      variables: {
        delUserId: id,
      },
    })
      .then((result) => {
        console.log('User deleted:', result);
        // 在这里处理删除成功的情况，比如更新UI或导航
        message.success('删除成功');
        onSuccess();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        // 在这里处理错误情况
        message.success('删除失败');
      });
  }

  return (
    <Popconfirm title="确定要删除学生吗？" onConfirm={onConfirm}>
      <Button danger size="middle">
        删除
      </Button>
    </Popconfirm>
  );
}
