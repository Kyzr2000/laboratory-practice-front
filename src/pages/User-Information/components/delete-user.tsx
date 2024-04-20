import { useLazyQuery, useMutation } from '@apollo/client';
import { Button } from 'antd';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { DelUser } from '../../graphql/mutations';
import { GET_ALL_USERS } from '../../graphql/query';
import { columnsState, NowPage, tmpUserData } from './user-table';
function DeleteUserButton(text) {
  const { username } = text;
  const [getUsers, { data: data2 }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only',
  });
  const tmpUser = useRecoilValue(tmpUserData);
  const setDataSource = useSetRecoilState(columnsState);
  const pages = useRecoilValue(NowPage);
  const [Delete] = useMutation(DelUser, {
    variables: { username },
  });

  const OnClicked = async () => {
    console.log(typeof username);
    await Delete();
    await RefreshPage();
  };

  const RefreshPage = async () => {
    let pageNumber = pages - 1;
    getUsers({
      variables: {
        pages: pageNumber,
        realname: tmpUser[0].realname,
        username: tmpUser[0].username,
      }
    });
    console.log(data2);
    await setDataSource(data2.getAllUsers);
  };

  return (
    <>
      <Button onClick={OnClicked}>删除</Button>
    </>
  );
}

export default DeleteUserButton;
