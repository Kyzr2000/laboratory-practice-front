import './css/add-user.scss';

import { Button } from 'antd';

type PropsConfig = {
  setUpdateUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddUser = ({setUpdateUserOpen}: PropsConfig) => {

  const showUpdateUserModal = () => {
    setUpdateUserOpen(true);
  };

  return (
    <div className='add-user'>
      <Button className='add-user-button' type='primary' onClick={showUpdateUserModal}>
        新增用户
      </Button>
    </div>
  );
};
export default AddUser;
