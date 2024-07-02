import "./css/delete-user-modal.scss";
// import { useMutation, useQuery } from '@apollo/client';
// import { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Modal, message } from "antd";
import { useEffect, useCallback } from "react";
import { DELETE_USER } from "@/apis";
import type { UserOperateResponse } from "../type";

type PropsConfig = {
  openDeleteModal: boolean;
  setDeleteUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteUserId: number | null;
  setDeleteUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsQuerying: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteUserModal = ({ deleteUserId, setDeleteUserId, setIsQuerying }: PropsConfig) => {
  
  const [deleteUser] = useMutation<UserOperateResponse>(
    DELETE_USER,
    {
      onCompleted(data) {
        if (data.delUser?.result === "success") {
          message.success(data.delUser.message);
        } else if (data.delUser?.result === "error") {
          message.error(data.delUser.message);
        }
      },
    }
  );

  const showDeleteModal = useCallback(() => {
    if (deleteUserId) {
      Modal.confirm({
        title: "你确定要删除该用户信息吗？",
        icon: <ExclamationCircleOutlined />,
        style: { marginTop: "260px" },
        maskClosable: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          deleteUser({
            variables: {
              delUserId: deleteUserId,
            },
          });
          setDeleteUserId(null);
          setIsQuerying(true);
        },
        onCancel() {
          setDeleteUserId(null);
        },
      });
    }
  }, [setDeleteUserId, setIsQuerying, deleteUser, deleteUserId]);

  useEffect(() => {
    if (deleteUserId) {
      showDeleteModal();
    }
  }, [showDeleteModal, deleteUserId]);
  return (
    <></>
  );
};

export default DeleteUserModal;
