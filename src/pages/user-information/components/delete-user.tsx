import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const OnClicked = () => {
    setIsModalVisible(true);
  };

  // const OnClicked = async () => {
  //   console.log(typeof username);
  //   await Delete();
  //   await RefreshPage();
  // };

  const RefreshPage = async () => {
    let pageNumber = pages - 1;
    getUsers({
      variables: {
        pages: pageNumber,
        realname: tmpUser[0].realname,
        username: tmpUser[0].username,
      },
    });
    // console.log(data2);
    await message.success('删除成功', 3);
    await setDataSource(data2.getAllUsers);
  };

  const handleOk = async () => {
    await Delete();
    await RefreshPage();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={OnClicked} className="User-Delete-btn">
        删除
      </Button>
      <Modal
        title="确认删除"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>您确定要删除这个用户吗？</p>
      </Modal>
    </>
  );
}

export default DeleteUserButton;
