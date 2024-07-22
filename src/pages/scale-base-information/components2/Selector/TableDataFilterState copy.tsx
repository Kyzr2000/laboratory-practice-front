import { selector } from 'recoil';

import { InputState } from '../Atom/InterfaceState';
import { OptionsItemFilterState } from '../Atom/OptionsItemFilterState';
import { TableDataState } from '../Atom/TableDataState';

export const TableDataFilterState = selector({
    key: 'TableDataFilted',
    get: ({ get }) => {
        const filterdOption = get(OptionsItemFilterState);
        const tableData = get(TableDataState);
        const inputValue = get(InputState);
        let filteredTableData;

        // 这里的逻辑无法判断 show all 条件下的 account
        // 这里重写一下查询的判断逻辑
        if (inputValue.length <= 0 && filterdOption.value === 'Show All') {
            filteredTableData = tableData;
        } else if (inputValue.length > 0 && filterdOption.value === 'Show All') {
            filteredTableData = tableData.filter((record) => {
                return record.account === inputValue;
            });
        } else if (inputValue.length <= 0 && filterdOption.value !== 'Show All') {
            filteredTableData = tableData.filter((record) => {
                return record.is_enabled === filterdOption.value;  
            });
        } else if (inputValue.length > 0 && filterdOption.value !== 'Show All') {
            filteredTableData = tableData.filter((record) => {
                return record.is_enabled === filterdOption.value && record.account === inputValue;
            });
        }

        return filteredTableData;
    }
});