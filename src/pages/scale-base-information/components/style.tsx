import {
  Box,
  Button,
  InputLabel,
  Pagination,
  Select,
  styled,
  TableCell,
  tableCellClasses,
  TextField,
} from '@mui/material';

// add-modal 中的 BOX
export const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: auto;
  max-height: 75vh;
  border-radius: 7px;
  overflow-y: auto;
  overflow-x: hidden;
`;

// modal 确认按钮
export const StyledaAffirmButton = styled(Button)`
  width: 66px;
  height: 32px;
  border-radius: 2px;
  background: linear-gradient(153deg, #20a89c 0%, #16a2a0 34%, #0497a8 100%);
  box-shadow: 0px 2px 8px 0px rgba(5, 115, 127, 0.45);
  margin-right: 35px;
  margin-bottom: 10px;
  color: white;
`;

// modal 取消按钮
export const StyledCancelButton = styled(Button)`
  width: 66px;
  height: 32px;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  color: black;
  box-shadow: 0px 2px 8px 0px rgba(5, 115, 127, 0.45);
  margin-right: 10px;
  margin-bottom: 10px;
`;

// search 中的下拉框文字
export const StyledInputLable = styled(InputLabel)`
  margin-top: 14px;
  margin-left: 36px;
`;
// search 中的下拉框
export const StyledSelectField = styled(Select)`
  width: 170px;
  height: 40px;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 36px;
`;

// search 中的输入框
export const StyledTextField = styled(TextField)`
  width: 174px;
  background: #fff;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 14px;
`;

// search 中的查询按钮
export const StyledButton = styled(Button)`
  width: 90px;
  height: 40x;
  color: white;
  background: linear-gradient(153deg, #20a89c 0%, #16a2a0 34%, #0497a8 100%);
  boxshadow: 0px 2px 8px 0px rgba(5, 115, 127, 0.45);
  borderradius: 4px;
  margin-top: 20px;
  margin-left: 14px;
`;

// add-import 新增按钮
export const StyledCreatedButton = styled(Button)`
  width: 90px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  color: black;
  margin-top: 20px;
  margin-right: 14px;
`;

// add-import 导入按钮
export const StyledImportButton = styled(Button)`
  width: 100px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  color: black;
  margin-top: 20px;
  margin-right: 36px;
`;

// table
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(141, 156, 158, 0.25)',
    color: '#038A97',
    height: '40px',
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '13px',
    color: 'rgba(0,0,0,0.85)',
    height: '20px',
  },
}));

export const StyledPagination = styled(Pagination)`
  float: right;
  margin-top: 18px;
  margin-bottom: 18px;
`;

// table  编辑与删除按钮
export const StyleDeleteAndModifyButton = styled(Button)`
  width: 52px;
  height: 26px;
  background: rgba(3, 138, 151, 0.04);
  border-radius: 2px;
  border: 1px solid rgba(3, 138, 151, 0.45);
  font-size: 14px;
  font-family: MicrosoftYaHeiUI;
  color: #038a97;
`;
