// 量表
export type Scale = {
  id?: number;
  name: string;
  scacleCode?: string;
  calformula?: string;
  tranformulakey?: string;
  tranformula?: string;
  average?: number;
  sd?: number;
  scaleInterpretationResult?: string;
  baselineScore?: number;
  standardSourceMethod?: string;
  rawSourceMethod?: string;
  averageSourceMethod?: string;
  scaleTimeKeeping?: boolean;
  scaleTimeLimit?: number;
  introduction?: string;
  instructions?: string;
  isEnable?: boolean;
  scaleCoverUrl?: string;
  scaleContentImg?: string;
  isTeam?: boolean;
  teamIntroduction?: string;
  isComprehensiveReport?: boolean;
  startAge?: number;
  endAge?: number;
  warnGender?: number;
  skipRule?: string;
  isSkip?: boolean;
  isFactor?: boolean;
  createdAt?: Date;
  scaleTypeId?: number;
};

// 量表类型
export type ScaleType = {
  id: number;
  name: string;
};

export type ScaleTypes = {
  getScaleTypes: ScaleType[];
};

export type TableData = {
  totalCount: number;
  getBaseInformationTableData: Scale[];
};

export type QueryData = {
  data: {
    currentPage: number;
    pageNumber: number;
    scaleType?: number;
    scaleName?: string;
  };
};
