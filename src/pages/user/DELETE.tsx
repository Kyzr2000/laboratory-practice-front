import { gql, useMutation } from '@apollo/client';
import { message, Modal } from 'antd';
import { useRecoilState } from 'recoil';

import { table1, table2 } from './recoil';

const DELETEUSER = gql`
  mutation DUser($username: String!) {
    DUser(username: $username) {
      username
    }
  }
`;
interface DU {
  duser: string;
  open: boolean;
  onCancel: () => void;
}
const DELETE: React.FC<DU> = ({ duser, open, onCancel }) => {
  const [deleteuser] = useMutation(DELETEUSER);
  const [state, setState] = useRecoilState(table1);
  const [state1, setState1] = useRecoilState(table2);

  const handleOk = () => {
    deleteuser({ variables: { username: duser } });
    message.success('删除成功');
    onCancel();
    setState(state + 1);
    setState1(state1 + 1);
  };
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      centered={true}
      closable={false}
    >
      <div>确认删除吗 </div>
    </Modal>
  );
};
export default DELETE;
