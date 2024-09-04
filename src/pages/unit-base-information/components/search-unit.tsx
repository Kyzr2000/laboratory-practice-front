/* eslint-disable max-len */
import { useLazyQuery } from '@apollo/client';
import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';

import { SELECT_UNITS_BY_NAME_AND_CODE } from '@/pages/graphql/unit';

import { currentPageAtom, pageSizeAtom, totalRecordsAtom, unitsAtom } from './atom/pageAtom';
import { unitNameAtom } from './atom/searchAtom';
import { unitCodeAtom } from './atom/searchAtom';

interface searchUnitByCodeAndName {
  unitCode: string;
  unitName: string;
  page: number;
  pageSize: number;
}

const SearchUnits: React.FC = () => {

  // 获取当前在第几页
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  // 获取每页的数据量
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalRecords, setTotalRecords] = useRecoilState(totalRecordsAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoilUnits, setRecoilUnits] = useRecoilState(unitsAtom);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoilCode, setRecoilCode] = useRecoilState(unitCodeAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoilName, setRecoilName] = useRecoilState(unitNameAtom);
  
  
  // 使用局部状态来存储输入框的初始值为空
  const [localCode, setLocalCode] = useState('');
  const [localName, setLocalName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchUnitByCodeAndName, { data }] = useLazyQuery(SELECT_UNITS_BY_NAME_AND_CODE);

  console.log(data);

  // 在输入框中输入时更新Recoil状态   
  // 关键代码   当输入框的值变为空的时候 才设置atom中账户和姓名为空，
  //  不为空时不设置 这样避免了输入库中输入值自动重新查询更新用户列表
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>, state: string) => {

    const value = e.target.value.trim();
    setState(value);
    if (state === 'code' && value === '') {
      setRecoilCode('');
    } else if (state === 'name' && value === '') {
      setRecoilName('');
    }
    
    
  };

  const handleSearch = () => {
    if (!localCode.trim() && !localName.trim()) {
      alert('请至少输入账户或姓名中的一个');
      return;
    }
    // 更新Recoil状态   出现的问题 输入框值变动 自动搜索， 问题2： 搜索组件接口搜出来的数据 点击分页时会自动取消，因为分页在用户列表组件，点分页重新加载用户列表接口数据
    // 因此点击搜索 就要更新atom 这样列表组件接口重新加载 就是带有 账户和姓名两个条件的（从atom中获取）
    // 在点击搜索的时候 才去更新atom中的account和name为输入框的值， 这样点击搜索了才会重新加载数据
    // 
    setRecoilCode(localCode.trim());
    setRecoilName(localName.trim());

    // 确定返回第一页
    setCurrentPage(1);

    const searchInput: searchUnitByCodeAndName = {
      unitCode: localCode.trim(),
      unitName: localName.trim(),
      page: currentPage,
      pageSize: pageSize,
    };
    searchUnitByCodeAndName({ variables: { input: searchInput } });
  };


  useEffect(() => {
    if (data?.selectUnits) {
      // 解析数据
      setRecoilUnits(data.selectUnits.units); // 更新数据
      setTotalRecords(data.selectUnits.total);
      // refetch(); 
    }
  }, [data, setRecoilUnits, setTotalRecords]);
  
  // 在组件挂载时检查输入框的值
  useEffect(() => {
    if (localCode.trim() === '' && localName.trim() === '') {
      setRecoilCode('');
      setRecoilName('');
    }
  }, [localCode, localName, setRecoilCode, setRecoilName]); // 添加依赖数组

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
      <Input placeholder="单位编码" value={localCode} onChange={(e) => handleInputChange(e, setLocalCode, 'code')} />
        <Input placeholder="单位名称" value={localName} onChange={(e) => handleInputChange(e, setLocalName, 'name')} />
        <Button type="primary" style={{background:'green'}} onClick={handleSearch}>
          搜索
        </Button>
      </Space>
    </Space>
  );
};

export default SearchUnits;