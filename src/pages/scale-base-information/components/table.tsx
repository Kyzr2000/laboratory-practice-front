import {
  CircularProgress,
  Paper,
  Popover,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { memo, useState } from 'react';

import type { Scale } from '../type';
import {
  StyledaAffirmButton,
  StyledCancelButton,
  StyleDeleteAndModifyButton,
  StyledPagination,
  StyledTableCell,
} from './style';

type PropsConfig = {
  loading: Boolean;
  data: Scale[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modifyId: React.MutableRefObject<number>;
};

const BaseInformationTable = ({
  loading,
  data,
  page,
  setPage,
  pageCount,
  setAddOpen,
  modifyId,
}: PropsConfig) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const tableHeader = (name: string) => {
    return (
      <StyledTableCell align="center" key={name}>
        {name}
      </StyledTableCell>
    );
  };

  const handlePaginationChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const handleModify = (row: Scale) => {
    modifyId.current = row.id as number;
    setAddOpen(true);
  };

  // 点击删除的回调
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;

  return (
    <div style={{ margin: '0 36px' }}>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {[
                '序号',
                '量表名称',
                '量表编号',
                '是否有因子',
                '是否跳题',
                '是否启用',
                '跳转规则',
                '创建时间',
                '操作',
              ].map(tableHeader)}
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={`${row.name}-${row.id}`}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.id}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.isFactor ? '是' : '否'}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.isSkip ? '是' : '否'}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.isEnable ? '是' : '否'}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.skipRule ?? '--'}</StyledTableCell>
                  <StyledTableCell align="center">
                    {`${moment(row.createdAt).format('YYYY-MM-DD')}`}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <>
                      <StyleDeleteAndModifyButton
                        sx={{ marginRight: '5px' }}
                        onClick={() => handleModify(row)}
                      >
                        编辑
                      </StyleDeleteAndModifyButton>
                      <StyleDeleteAndModifyButton onClick={handleClick}>
                        删除
                      </StyleDeleteAndModifyButton>
                    </>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <StyledPagination
          count={pageCount}
          defaultPage={1}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={handlePaginationChange}
        />
      </TableContainer>
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        sx={{
          '& .MuiPaper-root': {
            width: '160px' /* 设置 Popover 宽度 */,
            height: '78px',
          },
        }}
        anchorOrigin={{
          vertical: -80,
          horizontal: 'left',
        }}
      >
        <Typography style={{ marginTop: '8px', marginLeft: '10px', fontSize: '13px' }}>
          你确定要删除吗？
        </Typography>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <StyledaAffirmButton
            variant="contained"
            sx={{
              marginRight: '10px',
              width: '55px',
              height: '25px',
              fontSize: '13px',
            }}
            onClick={handlePopoverClose}
          >
            确认
          </StyledaAffirmButton>
          <StyledCancelButton
            onClick={handlePopoverClose}
            sx={{
              width: '55px',
              height: '25px',
              fontSize: '13px',
            }}
          >
            取消
          </StyledCancelButton>
        </div>
      </Popover>
    </div>
  );
};

export default memo(BaseInformationTable);
