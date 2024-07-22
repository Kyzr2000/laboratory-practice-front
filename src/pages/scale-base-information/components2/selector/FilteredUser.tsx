import { selector } from 'recoil';

import type { DataType } from '../atom/UsersManagement';
import { accountAtom, selectState, usersAll } from '../atom/UsersManagement';

export const filteredUser = selector<DataType[]>({
    key: 'filteredUser',
    get: ({ get }) => {
        const getUsersAll = get(usersAll);
        const getSelect = get(selectState);
        const accountName = get(accountAtom);
        console.log('11');


        if (!Array.isArray(getUsersAll)) {
            return [];
        }

        let filteredUsers = getUsersAll;

        if (accountName) {
            filteredUsers = filteredUsers.filter((item) => item.account.includes(accountName));
        }

        if (getSelect === 'start') {
            filteredUsers = filteredUsers.filter((item) => item.is_enabled);
        } else if (getSelect === 'end') {
            filteredUsers = filteredUsers.filter((item) => !item.is_enabled);
        }

        return filteredUsers;
    },
});