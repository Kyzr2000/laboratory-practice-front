import '../scale-base-information.scss';

import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import type { SelectChangeEvent } from '@mui/material';
import { ImageListItemBar } from '@mui/material';
import {
  FormControl,
  Grid,
  Icon,
  IconButton,
  ImageList,
  ImageListItem,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { GET_SCALE_DETAIL, SUBMIT_BASE_INFORMATION } from '@/apis';

import type { QueryData, Scale, ScaleType, TableData } from '../type';
import { StyledaAffirmButton, StyledBox, StyledCancelButton } from './style';

type PropsConfig = {
  open: boolean;
  onClose: () => void;
  scaleTypes: ScaleType[];
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
  scaleTypes,
  modifyId,
  getBaseInformationTableData,
  pageNumber,
  setPage,
}: PropsConfig) => {
  const [scale, setScale] = useState<Scale>();
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

  // img 点击
  const handleImgClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener(
      'change',
      handleFileInputChange as unknown as EventListener,
    );
    fileInput.click();
  };

  // 图片上传
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      convertImageToBase64(file)
        .then((base64) =>
          setScale((pre) => {
            return {
              ...pre,
              scaleContentImg: base64,
            };
          }),
        )
        .catch((error) => console.error('转换错误:', error));
    }
  };

  const convertImageToBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  // 图片删除
  const handleImageDelete = () => {
    setScale((pre) => {
      return {
        ...pre,
        scaleContentImg: null,
      };
    });
  };

  // 表单提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit({
      variables: {
        data: {
          ...scale,
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
            <div className="modal-title">添加评测量表</div>
            <IconButton className="modal-close-button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <FormControl required>
                  <span className="modal-left-text">量表类型：</span>
                  <Select
                    displayEmpty
                    required
                    name="scaleTypeId"
                    size="small"
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    defaultValue=""
                    value={scale?.scaleTypeId ? String(scale?.scaleTypeId) : ''}
                    renderValue={(selected) => {
                      if (scale?.scaleTypeId) {
                        return scaleTypes.find((element) => {
                          return Number(element.id) === Number(scale.scaleTypeId);
                        })?.name;
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择量表类型</div>
                        );
                      }
                      return scaleTypes.find((element) => {
                        return Number(element.id) === Number(selected);
                      })?.name;
                    }}
                  >
                    <MenuItem value={''}>请选择量表类型</MenuItem>
                    {scaleTypes.map((element: ScaleType) => {
                      return (
                        <MenuItem
                          value={element.id}
                          key={`${element.name}-${element.id}`}
                        >
                          {element.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">量表名称：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入量表名称"
                    name="name"
                    required
                    defaultValue={''}
                    onChange={useHanldTextChange}
                    value={scale?.name}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">是否有因子：</span>
                  <Select
                    displayEmpty
                    required
                    name="isFactor"
                    size="small"
                    defaultValue=""
                    value={
                      scale?.isFactor !== null && scale?.isFactor !== undefined
                        ? String(scale?.isFactor ? 1 : 0)
                        : ''
                    }
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (scale?.isFactor !== null && scale?.isFactor !== undefined) {
                        return whether[Number(scale?.isFactor)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>
                            请选择是否有因子
                          </div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择是否有因子</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">是否跳题：</span>
                  <Select
                    displayEmpty
                    required
                    name="isSkip"
                    size="small"
                    defaultValue=""
                    className="modal-right"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    value={
                      scale?.isSkip !== null && scale?.isSkip !== undefined
                        ? String(scale?.isSkip ? 1 : 0)
                        : ''
                    }
                    renderValue={(selected) => {
                      if (scale?.isSkip !== null && scale?.isSkip !== undefined) {
                        return whether[Number(scale?.isSkip)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择是否跳题</div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择是否跳题</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
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
                      scale?.isEnable !== null && scale?.isEnable !== undefined
                        ? String(scale?.isEnable ? 1 : 0)
                        : ''
                    }
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (scale?.isEnable !== null && scale?.isEnable !== undefined) {
                        return whether[Number(scale?.isEnable)];
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
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">量表编号：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="自动生成"
                    name="id"
                    disabled
                    value={modifyId.current}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">量表计算公式(粗分)：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="calformula"
                  placeholder="请输入量表计算公式(粗分)"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.calformula}
                />
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">量表转换公式key：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="tranformulakey"
                  placeholder="请输入量表转换公式key"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.tranformulakey}
                />
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">量表转换公式：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="tranformula"
                  placeholder="请输入量表转换公式"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.tranformula}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">平均数X：</span>
                  <TextField
                    sx={{ marginLeft: '35px' }}
                    className="modal-left"
                    size="small"
                    placeholder="请输入平均数X"
                    name="average"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    onChange={useHanldTextChange}
                    value={scale?.average}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">标准差SD：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入标准差SD"
                    name="sd"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    onChange={useHanldTextChange}
                    value={scale?.sd}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">结果解释方式：</span>
                  <TextField
                    sx={{ marginLeft: '35px' }}
                    className="modal-left"
                    size="small"
                    placeholder="请输入结果解释方式"
                    name="scaleInterpretationResult"
                    onChange={useHanldTextChange}
                    value={scale?.scaleInterpretationResult}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">基线分数：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入基线分数"
                    name="baselineScore"
                    type="number"
                    inputProps={{ step: 0.01 }}
                    onChange={useHanldTextChange}
                    value={scale?.baselineScore}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">标准分取值方式：</span>
                  <TextField
                    sx={{ marginLeft: '35px' }}
                    className="modal-left"
                    size="small"
                    placeholder="请输入标准分取值方式"
                    name="standardSourceMethod"
                    onChange={useHanldTextChange}
                    value={scale?.standardSourceMethod}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">原始分取值方式：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入原始分取值方式"
                    name="rawSourceMethod"
                    onChange={useHanldTextChange}
                    value={scale?.rawSourceMethod}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">平均分取值方式：</span>
                  <TextField
                    sx={{ marginLeft: '35px' }}
                    className="modal-left"
                    size="small"
                    placeholder="请输入平均分取值方式"
                    name="averageSourceMethod"
                    onChange={useHanldTextChange}
                    value={scale?.averageSourceMethod}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">量表限时：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入量表限时"
                    name="scaleTimeLimit"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    onChange={useHanldTextChange}
                    value={scale?.scaleTimeLimit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">量表介绍：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  multiline
                  rows={3}
                  name="introduction"
                  placeholder="请输入量表介绍"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.introduction}
                />
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">指导语：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="instructions"
                  placeholder="请输入指导语"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.instructions}
                />
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">封面url：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="scaleCoverUrl"
                  placeholder="请输入封面url"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.scaleCoverUrl}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">是否团体：</span>
                  <Select
                    displayEmpty
                    required
                    name="isTeam"
                    size="small"
                    defaultValue=""
                    value={
                      scale?.isTeam !== null && scale?.isTeam !== undefined
                        ? String(scale?.isTeam ? 1 : 0)
                        : ''
                    }
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (scale?.isTeam !== null && scale?.isTeam !== undefined) {
                        return whether[Number(scale?.isTeam)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择是否团体</div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择是否团体</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">内容图片：</span>
                  <ImageList
                    sx={{ width: 250, height: 120, marginTop: 0 }}
                    cols={3}
                    rowHeight={120}
                  >
                    <ImageListItem>
                      {scale?.scaleContentImg ? (
                        <div>
                          <img
                            style={{ width: 240 }}
                            src={scale?.scaleContentImg}
                            onClick={handleImgClick}
                          />
                          <ImageListItemBar
                            sx={{
                              background:
                                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' +
                                'rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)',
                            }}
                            position="top"
                            actionIcon={
                              <IconButton sx={{ color: 'black' }}>
                                <DeleteIcon />
                              </IconButton>
                            }
                            actionPosition="left"
                            onClick={handleImageDelete}
                          />
                        </div>
                      ) : (
                        <div className="image-placeholader" onClick={handleImgClick}>
                          <div>
                            <Icon
                              style={{ color: 'rgb(0,0,0, 0.45)', marginBottom: '10px' }}
                            >
                              <AddIcon />
                            </Icon>
                          </div>
                          <div style={{ color: 'rgb(0,0,0, 0.45)' }}>最大不超过10M</div>
                        </div>
                      )}
                    </ImageListItem>
                  </ImageList>
                </FormControl>
              </Grid>
              <Grid item xs={6} style={{ marginTop: '-90px' }}>
                <FormControl>
                  <span className="modal-left-text">是否综合报告：</span>
                  <Select
                    displayEmpty
                    required
                    name="isComprehensiveReport"
                    size="small"
                    value={
                      scale?.isComprehensiveReport !== null &&
                      scale?.isComprehensiveReport !== undefined
                        ? String(scale?.isComprehensiveReport ? 1 : 0)
                        : ''
                    }
                    defaultValue=""
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (
                        scale?.isComprehensiveReport !== null &&
                        scale?.isComprehensiveReport !== undefined
                      ) {
                        return whether[Number(scale?.isComprehensiveReport)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>
                            请选择是否综合报告
                          </div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择是否综合报告</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">团体介绍：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  name="teamIntroduction"
                  placeholder="请输入团体介绍"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.teamIntroduction}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">开始年龄：</span>
                  <TextField
                    sx={{ marginLeft: '35px' }}
                    className="modal-left"
                    size="small"
                    placeholder="请输入开始年龄"
                    name="startAge"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    onChange={useHanldTextChange}
                    value={scale?.startAge}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-right-text">结束年龄：</span>
                  <TextField
                    className="modal-right"
                    size="small"
                    placeholder="请输入结束年龄"
                    name="endAge"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    onChange={useHanldTextChange}
                    value={scale?.endAge}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl>
                  <span className="modal-left-text">性别：</span>
                  <Select
                    displayEmpty
                    name="warnGender"
                    size="small"
                    required
                    value={
                      scale?.warnGender !== null && scale?.warnGender !== undefined
                        ? String(scale?.warnGender)
                        : ''
                    }
                    defaultValue=""
                    className="modal-left"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (scale?.warnGender !== null && scale?.warnGender !== undefined) {
                        return Number(scale?.warnGender) === 1
                          ? '男'
                          : Number(scale?.warnGender) === 2
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
                        : Number(scale?.warnGender) === 2
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
                <FormControl>
                  <span className="modal-right-text">量表是否计时：</span>
                  <Select
                    displayEmpty
                    name="scaleTimeKeeping"
                    size="small"
                    value={
                      scale?.scaleTimeKeeping !== null &&
                      scale?.scaleTimeKeeping !== undefined
                        ? String(scale?.scaleTimeKeeping ? 1 : 0)
                        : ''
                    }
                    defaultValue=""
                    className="modal-right"
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={useHandleSelectChange}
                    renderValue={(selected) => {
                      if (
                        scale?.scaleTimeKeeping !== null &&
                        scale?.scaleTimeKeeping !== undefined
                      ) {
                        return whether[Number(scale?.scaleTimeKeeping)];
                      }
                      if (!selected || selected.length === 0) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>
                            请选择量表是否计时
                          </div>
                        );
                      }
                      return whether[Number(selected)];
                    }}
                  >
                    <MenuItem value={''}>请选择量表是否计时</MenuItem>
                    {whether.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <span className="modal-left-text">跳题规则：</span>
                <TextField
                  sx={{ marginLeft: '35px', marginTop: '10px' }}
                  className="modal-one"
                  multiline
                  rows={3}
                  name="skipRule"
                  placeholder="请输入量表介绍"
                  size="small"
                  onChange={useHanldTextChange}
                  value={scale?.skipRule}
                />
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
