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
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pageNumber: React.MutableRefObject<number>;
  totalCount: number;
};

const DeleteUserModal = ({
  deleteUserId,
  setDeleteUserId,
  setIsQuerying,
  setCurrentPage,
  currentPage,
  pageNumber,
  totalCount,
}: PropsConfig) => {
  const [deleteUser] = useMutation<UserOperateResponse>(DELETE_USER, {
    onCompleted(data) {
      if (data.delUser?.result === "success") {
        message.success(data.delUser.message);
      } else if (data.delUser?.result === "error") {
        message.error(data.delUser.message);
      }
    },
  });

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
          // 如果删除的是本页面的最后一条数据，则应该去更新一下currentPage
          if (totalCount - (currentPage - 1) * pageNumber.current === 1 && currentPage > 1) { 
            setCurrentPage(currentPage - 1);
          }
          setIsQuerying(true);
        },
        onCancel() {
          setDeleteUserId(null);
        },
      });
    }
  }, [
    setDeleteUserId,
    setCurrentPage,
    setIsQuerying,
    deleteUser,
    totalCount,
    currentPage,
    pageNumber,
    deleteUserId,
  ]);

  useEffect(() => {
    if (deleteUserId) {
      showDeleteModal();
    }
  }, [showDeleteModal, deleteUserId]);
  return <></>;
};

export default DeleteUserModal;
