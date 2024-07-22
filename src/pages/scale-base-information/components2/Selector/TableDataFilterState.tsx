import { selector } from 'recoil';

import { OptionsItemFilterState } from '../Atom/OptionsItemFilterState';
import { TableDataState } from '../Atom/TableDataState';

export const TableDataFilterState = selector({
    key: 'TableDataFilted',
    get: ({ get }) => {
        const filterdOption = get(OptionsItemFilterState);
        const tableData = get(TableDataState);
        const filteredTableData = filterdOption.value === 'Show All' ? tableData
            : tableData.filter(record => record.is_enabled === filterdOption.value);

        // 这里的逻辑无法判断 show all 条件下的 account
        // 这里重写一下查询的判断逻辑
        

        return filteredTableData;
    }
});