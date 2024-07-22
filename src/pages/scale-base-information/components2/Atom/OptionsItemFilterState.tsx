import { atom } from 'recoil';

import type { OptionItemType } from './InterfaceState';

export const OptionsItemFilterState = atom<OptionItemType>({
    key: 'OptionItem',
    default: {value:'Show All', label:'Show All'}
});