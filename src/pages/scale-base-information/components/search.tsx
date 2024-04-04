import { ZoomIn } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { memo, useRef } from 'react';

import type { ScaleType } from '../type';
import {
  StyledButton,
  StyledInputLable,
  StyledSelectField,
  StyledTextField,
} from './style';

type PropsConfig = {
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      scaleType?: number;
      scaleName?: string;
    }>
  >;
  scaleTypes: ScaleType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const Search = ({ setSearchData, scaleTypes, setPage }: PropsConfig) => {
  const scaleType = useRef(0);
  const scaleName = useRef('');

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    scaleType.current = event.target.value as number;
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    scaleName.current = event.target.value as string;
  };

  const handleClick = () => {
    setPage(1);
    setSearchData({
      scaleType: scaleType.current,
      scaleName: scaleName.current,
    });
  };

  return (
    <div>
      <FormControl>
        <StyledInputLable>量表类型</StyledInputLable>
        <StyledSelectField size="small" label="量表类型" onChange={handleSelectChange}>
          <MenuItem value={0} key={0}>
            请选择量表类型
          </MenuItem>
          {scaleTypes &&
            scaleTypes.map((element) => {
              return (
                <MenuItem
                  value={Number(element.id)}
                  key={`${element.id}-${element.name}`}
                >
                  {element.name}
                </MenuItem>
              );
            })}
        </StyledSelectField>
      </FormControl>
      <StyledTextField
        label="请输入量表名称"
        variant="outlined"
        size="small"
        onChange={handleTextChange}
      />
      <StyledButton variant="contained" startIcon={<ZoomIn />} onClick={handleClick}>
        查询
      </StyledButton>
    </div>
  );
};

export default memo(Search);
