import './App.scss';

import AddUser from './components/add-user';
import UserSearch from './components/user-search';
import UserTable from './components/user-table';

function TestDemo() {
  return (
    <>
      <div className="User-Information-Ctrl">
        <div className="User-Search-Input">
          <UserSearch></UserSearch>
        </div>
        <div className="Add-User">
          <AddUser></AddUser>
        </div>
        <div className="User-Information-Show">
          <UserTable></UserTable>
        </div>
      </div>
    </>
  );
}

export default TestDemo;
