import '../scale-base-information.scss';

import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import type { SelectChangeEvent } from '@mui/material';
import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

import { GET_SCALE_DETAIL, SUBMIT_BASE_INFORMATION } from '@/apis';

import type { QueryData, Scale, TableData, User } from '../type';
import { StyledaAffirmButton, StyledBox, StyledCancelButton } from './style';

type PropsConfig = {
  open: boolean;
  onClose: () => void;
  modifyId: React.MutableRefObject<number>;
  getBaseInformationTableData: (
    variables?: Partial<QueryData> | undefined,
  ) => Promise<ApolloQueryResult<TableData>>;
  pageNumber: React.MutableRefObject<number>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const whether = ['否', '是'];
const numberNames = [
  'sd',
  'baselineScore',
  'scaleTimeLimit',
  'startAge',
  'endAge',
  'warnGender',
  'average',
];

const selectItem = (name: string, index: number) => {
  return (
    <MenuItem value={index} key={`${name}-${index}`}>
      {name}
    </MenuItem>
  );
};

const AddModal = ({
  open,
  onClose,
  modifyId,
  getBaseInformationTableData,
  pageNumber,
  setPage,
}: PropsConfig) => {
  const [scale, setScale] = useState<Scale>();
  const [user, setUser] = useState<User>();
  const [submit] = useMutation(SUBMIT_BASE_INFORMATION);

  const { data, refetch } = useQuery(GET_SCALE_DETAIL, {
    variables: {
      data: Number(modifyId.current),
    },
    onCompleted: (data) => {
      const { getScaleDetail } = data;
      setScale({ ...getScaleDetail });
    },
  });

  useEffect(() => {
    if (open) {
      refetch({
        data: Number(modifyId.current),
      });
      if (data) {
        const { getScaleDetail } = data;
        setScale({ ...getScaleDetail });
      }
    }
  }, [data, open, refetch, modifyId]);

  const useSet = (name: string, value: unknown) => {
    // @ts-ignore
    setUser((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });

    setScale((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleClose = () => {
    setScale(undefined);
    onClose();
    modifyId.current = 0;
  };

  // select onChange 处理函数
  const useHandleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    let newValue;
    if (name === 'scaleTypeId' || name === 'warnGender') {
      newValue = String(value).length === 0 ? null : Number(value);
    } else {
      newValue = String(value).length === 0 ? null : Boolean(value);
    }
    useSet(name, newValue);
  };

  // TextField onChange 处理函数
  const useHanldTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    useSet(name, numberNames.includes(name) ? Number(value) : value);
  };


  // 表单提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
    submit({
      variables: {
        data: {
          ...user,
          id: Number(modifyId.current),
        },
      },
      onCompleted: () => {
        handleClose();
        setPage(1);
        getBaseInformationTableData({
          data: {
            currentPage: 1,
            pageNumber: pageNumber.current,
          },
        });
      },
    });

    e.preventDefault();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <StyledBox sx={{ bgcolor: 'background.paper' }}>
          <div className="modal-title-layer">
            <div className="modal-title">添加用户</div>
            <IconButton className="modal-close-button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

              <Grid item xs={6}>
                <span className="modal-left-text">账号：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-left"
                  name="uuid"
                  placeholder="请输入账号"
                  size="small"
                  onChange={useHanldTextChange}
                  value={user?.uuid}
                />
              </Grid>
              <Grid item xs={6}>
                <span className="modal-right-text">姓名：</span>
                <TextField
                  sx={{ marginLeft: '0px', marginTop: '10px' }}
                  className="modal-right"
                  name="username"
                  placeholder="请输入姓名"
                  size="small"
                  onChange={useHanldTextChange}
                  value={user?.username}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">性别：</span>
                  <Select
                    displayEmpty
                    name="gender"
                    size="small"
                    required
                    value={
                      user?.gender !== null && user?.gender !== undefined
                        ? String(user?.gender)
                        : ''
                    }
                    defaultValue=""
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (user?.gender !== null && user?.gender !== undefined) {
                        return Number(user?.gender) === 1
                          ? '男'
                          : Number(user?.gender) === 2
                            ? '性别不限'
                            : '女';
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择性别</div>
                        );
                      }
                      return Number(selected) === 1
                        ? '男'
                        : Number(user?.gender) === 2
                          ? '性别不限'
                          : '女';
                    }}
                  >
                    <MenuItem value={''}>请选择性别</MenuItem>
                    <MenuItem value={0}>女</MenuItem>
                    <MenuItem value={1}>男</MenuItem>
                    <MenuItem value={2}>性别不限</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <span className="modal-right-text">年龄：</span>
                <TextField
                  sx={{ marginLeft: '0px', marginTop: '10px' }}
                  className="modal-right"
                  name="age"
                  placeholder="请输年龄"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.tranformula}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">是否启用：</span>
                  <Select
                    displayEmpty
                    name="isEnable"
                    size="small"
                    required
                    defaultValue=""
                    value={
                      user?.isEnable !== null && user?.isEnable !== undefined
                        ? String(user?.isEnable ? 1 : 0)
                        : ''
                    }
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (user?.isEnable !== null && user?.isEnable !== undefined) {
                        return whether[Number(user?.isEnable)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择是否启用</div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择是否启用</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>



            </Grid>
            <div style={{ float: 'right', marginTop: 10 }}>
              <StyledaAffirmButton variant="contained" type="submit">
                确认
              </StyledaAffirmButton>
              <StyledCancelButton onClick={handleClose}>取消</StyledCancelButton>
            </div>
          </form>
        </StyledBox>
      </Modal>
    </>
  );
};

export default AddModal;
