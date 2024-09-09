/* eslint-disable max-len */
import { useQuery } from '@apollo/client';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import { GET_BASE_INFORMATION_TABLE_DATA, GET_SCALE_TYPES } from '@/apis/index';

import AddAndImport from './components/add-import';
import Search from './components/search';
import BaseInformationTable from './components/table';
import type { QueryData, Scale, ScaleType, ScaleTypes, TableData } from './type';

const theme = createTheme({
  palette: {
    primary: {
      main: '#20A89D',
    },
  },
});

const BaseInformation = () => {
  const [scales, setScales] = useState<Scale[]>([]); // 页面数据
  const [page, setPage] = useState<number>(1); // 当前页面
  const [totalCount, setTotalCount] = useState<number>(1); // 总个数
  const [searchData, setSearchData] = useState<{
    scaleType?: number;
    scaleName?: string;
  }>({});
  const pageNumber = useRef<number>(10); // 每页显示的数量
  const [scaleTypes, setScaleTypes] = useState<ScaleType[]>([]); // 量表类型
  const [addOpen, setAddOpen] = useState<boolean>(false); // 新增（编辑）按钮
  const modifyId = useRef<number>(0);

  const { loading, refetch: getBaseInformationTableData } = useQuery<
    TableData,
    QueryData
  >(GET_BASE_INFORMATION_TABLE_DATA, {
    onCompleted(data) {
      const { totalCount, getBaseInformationTableData: tableData } = data || {};
      if (totalCount) setTotalCount(totalCount);
      setScales([...tableData]);
    },
  });

  useQuery<ScaleTypes>(GET_SCALE_TYPES, {
    onCompleted(data) {
      const { getScaleTypes } = data || {};
      setScaleTypes(getScaleTypes);
    },
  });

  useEffect(() => {
    getBaseInformationTableData({
      data: {
        currentPage: page,
        pageNumber: pageNumber.current,
        ...searchData,
      },
    });
  }, [getBaseInformationTableData, page, searchData]);

  const pageCount = useMemo(() => {
    return Math.ceil(totalCount / pageNumber.current);
  }, [totalCount]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Search
              setSearchData={setSearchData}
              scaleTypes={scaleTypes}
              setPage={setPage}
            />
            <AddAndImport
              setPage={setPage}
              addOpen={addOpen}
              setAddOpen={setAddOpen}
              scaleTypes={scaleTypes}
              modifyId={modifyId}
              getBaseInformationTableData={getBaseInformationTableData}
              pageNumber={pageNumber}
            />
          </div>
          <BaseInformationTable
            loading={loading}
            data={scales}
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            setAddOpen={setAddOpen}
            modifyId={modifyId}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default BaseInformation;
