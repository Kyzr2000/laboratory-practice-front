import { useCallback, useEffect, useState } from 'react';
import type { FindUnitsInput, Unit } from '../types';
import { useLazyQuery } from '@apollo/client';
import { FIND_UNITS } from '../graphql/unitGql';

export const useUnitManagement = () => {
  const [units, setUnits] = useState<Unit[]>();
  const [searchParams, setSearchParams] = useState<FindUnitsInput>({
    unitNumber: '',
    name: '',
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [getUnit, { data, error, loading, refetch }] = useLazyQuery(FIND_UNITS, {
    fetchPolicy: 'network-only',
    variables: {
      findUnitsInput: searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
  });

  useEffect(() => {
    getUnit();
  }, [getUnit]);
  useEffect(() => {
    if (data?.findUnits) {
      setUnits(data.findUnits.units || []);
      setPagination((prev) => ({
        ...prev,
        total: data.findUnits.total || 0,
      }));
    }
  }, [data]);

  const handleSearch = useCallback(
    (values: FindUnitsInput) => {
      setSearchParams(values);
      setPagination((prev) => ({ ...prev, current: 1 }));
      refetch({
        findUnitsInput: values,
        page: 1,
        pageSize: pagination.pageSize,
      });
    },
    [pagination.pageSize, refetch],
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination({ current: page, pageSize, total: pagination.total });
      refetch({
        findUnitsInput: searchParams,
        page,
        pageSize,
      });
    },
    [pagination.total, refetch, searchParams],
  );

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    units,
    loading,
    error,
    pagination,
    handleSearch,
    handlePaginationChange,
    refreshData,
    searchParams,
  };
};
