import '../scale-base-information.scss';

import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  Button,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Link,
  MenuItem,
  Modal,
  Select,
} from '@mui/material';

import { StyledaAffirmButton, StyledBox, StyledCancelButton } from './style';

type PropsConfig = {
  open: boolean;
  onClose: () => void;
};

const scaleType = ['心理问题常用量表', '认知功能量表', '睡眠相关'];

const selectItem = (name: string, index: number) => {
  return (
    <MenuItem value={index + 1} key={`${name}-${index}`}>
      {name}
    </MenuItem>
  );
};

const ImportModal = ({ open, onClose }: PropsConfig) => {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <StyledBox sx={{ bgcolor: 'background.paper' }}>
          <div className="modal-title-layer">
            <div className="modal-title">量表导入</div>
            <IconButton className="modal-close-button" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <FormControl>
                  <text className="modal-left-text">量表分类：</text>
                  <Select
                    displayEmpty
                    name="scaleType"
                    size="small"
                    renderValue={(selected: number) => {
                      if (!selected) {
                        return (
                          <div style={{ color: 'rgba(0,0,0,0.35)' }}>请选择量表分类</div>
                        );
                      }
                      return scaleType[Number(selected) - 1];
                    }}
                    className="modal-one-row"
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={0}>请选择量表分类</MenuItem>
                    {scaleType.map(selectItem)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <text className="modal-left-text">量表数据：</text>
                <Button
                  variant="outlined"
                  component="label"
                  className="modal-upload-button"
                  size="small"
                >
                  <div className="modal-upload-text ">请选择文件</div>
                  <input type="file" hidden />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <text className="modal-left-text">答案数据：</text>
                <Button
                  variant="outlined"
                  component="label"
                  className="modal-upload-button"
                  size="small"
                >
                  <div className="modal-upload-text ">请选择文件</div>
                  <input type="file" hidden />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <text className="modal-left-text">题目数据：</text>
                <Button
                  variant="outlined"
                  component="label"
                  className="modal-upload-button"
                  size="small"
                >
                  <div className="modal-upload-text ">请选择文件</div>
                  <input type="file" hidden />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <text className="modal-left-text">因子数据：</text>
                <Button
                  variant="outlined"
                  component="label"
                  className="modal-upload-button"
                  size="small"
                >
                  <div className="modal-upload-text ">请选择文件</div>
                  <input type="file" hidden />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <text className="modal-left-text">模板下载：</text>
                <div className="link-outter-div">
                  <div className="link-inner-div" style={{ marginBottom: '10px' }}>
                    <Link href="#" color="#038A97" sx={{ marginLeft: '50px' }}>
                      <Icon>
                        <SaveAltIcon />
                      </Icon>
                      {'量表数据导入模板.xlsx'}
                    </Link>

                    <Link href="#" color="#038A97" sx={{ marginRight: '170px' }}>
                      <Icon>
                        <SaveAltIcon />
                      </Icon>
                      {'问题数据导入模板.xlsx'}
                    </Link>
                  </div>
                  <div className="link-inner-div">
                    <Link href="#" color="#038A97" sx={{ marginLeft: '50px' }}>
                      <Icon>
                        <SaveAltIcon />
                      </Icon>
                      {'答案数据导入模板.xlsx'}
                    </Link>

                    <Link href="#" color="#038A97" sx={{ marginRight: '170px' }}>
                      <Icon>
                        <SaveAltIcon />
                      </Icon>
                      {'因子数据导入模板.xlsx'}
                    </Link>
                  </div>
                </div>
              </Grid>
            </Grid>
          </form>
          <div style={{ float: 'right', marginTop: 10 }}>
            <StyledCancelButton
              onClick={() => {
                onClose();
              }}
            >
              取消
            </StyledCancelButton>
            <StyledaAffirmButton variant="contained" type="submit">
              确认
            </StyledaAffirmButton>
          </div>
        </StyledBox>
      </Modal>
    </>
  );
};

export default ImportModal;
