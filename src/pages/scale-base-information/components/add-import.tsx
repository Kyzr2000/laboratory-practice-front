import type { ApolloQueryResult } from '@apollo/client';
import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { memo, useState } from 'react';

import type { QueryData, ScaleType, TableData } from '../type';
import AddModal from './add-modal';
import ImportModal from './import-modal';
import { StyledCreatedButton, StyledImportButton } from './style';

type PropsConfig = {
  addOpen: boolean;
  setAddOpen: Function;
  scaleTypes: ScaleType[];
  modifyId: React.MutableRefObject<number>;
  getBaseInformationTableData: (
    variables?: Partial<QueryData> | undefined,
  ) => Promise<ApolloQueryResult<TableData>>;
  pageNumber: React.MutableRefObject<number>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const AddAndImport = ({
  addOpen,
  setAddOpen,
  scaleTypes,
  modifyId,
  getBaseInformationTableData,
  pageNumber,
  setPage,
}: PropsConfig) => {
  const [importOpen, setImportOpen] = useState<boolean>(false);

  const handleAddClick = () => {
    modifyId.current = 0;
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleImportClick = () => {
    setImportOpen(true);
  };

  const handleImportClose = () => {
    setImportOpen(false);
  };

  return (
    <>
      <div>
        <StyledCreatedButton startIcon={<Add />} onClick={handleAddClick}>
          新增
        </StyledCreatedButton>
        <StyledImportButton startIcon={<UploadFileIcon />} onClick={handleImportClick}>
          导入量表
        </StyledImportButton>
      </div>
      <AddModal
        open={addOpen}
        onClose={handleAddClose}
        scaleTypes={scaleTypes}
        modifyId={modifyId}
        getBaseInformationTableData={getBaseInformationTableData}
        pageNumber={pageNumber}
        setPage={setPage}
      />
      <ImportModal open={importOpen} onClose={handleImportClose} />
    </>
  );
};

export default memo(AddAndImport);
