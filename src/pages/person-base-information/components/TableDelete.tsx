import './style.less';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Modal, Space } from 'antd';
import { useRecoilValue } from 'recoil';

import { DELETE_PERSON, GET_PERSONS } from '@/pages/graphql/person.graphql';

import { accountAtom, selectState } from './Atom/AccountAtom';
import { currentPageAtom, pageSizeAtom } from './Atom/pageAtom';
import type { PersonType } from './Atom/PersonType';
const TableDelete: React.FC<{ record: PersonType }> = ({ record }) => {
  // 使用 Ant Design 的 Modal.useModal() 钩子来创建一个弹窗,
  // contextHolder 是一个 React 节点，用于在组件树中挂载模态框。
  const [modal, contextHolder] = Modal.useModal();

  const isEnabled = useRecoilValue(selectState);
  const account = useRecoilValue(accountAtom);
  const currentPage = useRecoilValue(currentPageAtom);
  const pageSize = useRecoilValue(pageSizeAtom);

  // 当用户点击删除按钮时会被调用，用于显示确认删除的弹窗,用于显示弹窗内容。
  const deletetable = () => {
    // 弹窗的具体内容,调用 modal 对象的 confirm 方法来显示一个确认框
    modal.confirm({
      // ExclamationCircleOutlined style={{ color: 'red' }}:图标组件，设置为红色，为警告图标
      title: (
        <h3>
          <ExclamationCircleOutlined style={{ color: 'red' }} /> 删除用户信息
        </h3>
      ),
      icon: <ExclamationCircleOutlined style={{ display: 'none' }} />,
      content: <h3>你确定要删除用户({record.account})的信息吗?</h3>,
      okText: '确认',
      cancelText: '取消',
      // 用户点击确认按钮时，调用 handleDeletePerson 函数，并传入当前记录。
      onOk() {
        handleDeletePerson(record);
      },
    });
  };
  // 用useMutation钩子来和后端建立联系进行删除，refetchQueries：删除成功后，返回查询全部
  const [deletePerson] = useMutation(DELETE_PERSON);

  // record:用于父子联系的参数，表示表格中的数据记录，每一条记录的类型是PersonType类型
  // 在弹窗中点击确认按钮，将会调用下面的方法
  const handleDeletePerson = async (record: PersonType) => {
    try {
      await deletePerson(
        // 根据account进行删除
        {
          variables: { account: record.account },
          refetchQueries: [
            {
              query: GET_PERSONS,
              variables: {
                page: currentPage,
                pageSize: pageSize,
                account,
                isEnabled:
                  isEnabled === 'work' ? true : isEnabled === 'rest' ? false : undefined,
              },
            },
          ],
        },
      );
    } catch (error) {
      console.error(`Error deleting person:${error}`);
    }
  };

  // 渲染界面上的删除按钮
  return (
    <>
      <Space>
        <Button
          className="button-box"
          type="primary"
          onClick={deletetable}
          size={'small'}
        >
          删 除
        </Button>
      </Space>
      {contextHolder}
    </>
  );
};

export default TableDelete;
