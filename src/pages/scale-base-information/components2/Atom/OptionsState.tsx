import { atom } from 'recoil';

import type { OptionItemType } from './InterfaceState';

export const OptionsState = atom<OptionItemType[]>({
    key: 'OptionsState',
    default: []
});