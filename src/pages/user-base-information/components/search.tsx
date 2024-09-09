import { ZoomIn } from '@mui/icons-material';
import { memo, useRef } from 'react';

import type { ScaleType } from '../type';
import {
  StyledButton,
  StyledTextField,
} from './style';

// import '../my-style.scss';

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

const Search = ({ setSearchData, setPage }: PropsConfig) => {
  const scaleType = useRef(0);
  const scaleName = useRef('');



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
    <div style={{marginLeft: 22}}>
      <StyledTextField
        label="请输入账号"
        variant="outlined"
        size="small"
        onChange={handleTextChange}
      />
      <StyledTextField
        label="请输入姓名"
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
