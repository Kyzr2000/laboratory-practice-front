import { atom } from 'recoil';
const role = localStorage.getItem('role') || '';
const username = localStorage.getItem('username') || '';
console.log('role', role);
console.log('username', username);
export const userType = atom({
  key: 'userType',
  default: role,
});

export const USERNAME = atom({
  key: 'USERNAME',
  default: username,
});
