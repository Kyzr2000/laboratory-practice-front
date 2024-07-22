import { selector } from 'recoil';

import { InputState } from '../Atom/InterfaceState';
import { TableDataFilterState } from './TableDataFilterState';

export const TableDataFilterState_2 = selector({
    key: 'TableDataFilted2',
    get: ({ get }) => {
        const filteredTableData = get(TableDataFilterState);

        const InputValue = get(InputState);

        const filteredTableData2 = InputValue.length <= 0 ? filteredTableData :
            filteredTableData.filter(record => record.account.includes(InputValue));
        
        return filteredTableData2;
    }
});