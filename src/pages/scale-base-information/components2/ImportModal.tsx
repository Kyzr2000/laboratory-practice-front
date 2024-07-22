import './style.less';

// import { DeleteFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';

import type { PeopleType } from './Atom/InterfaceState';
import { TableDataFilterState_2 } from './Selector/TableDataFilterStateByInput';

const ImportModal: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const tableDataFiltedFinal = useRecoilValue(TableDataFilterState_2);

    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    // 导出数据的函数
    const exportToCSV = (dataToExport: PeopleType[]) => {
        const exportData = dataToExport.map((item) => ({
            id: item.id,
            account: item.account,
            name: item.name,
            gender: item.gender,
            age: item.age,
            is_enabled: item.is_enabled,
        }));

        return exportData;
    };

    const onClick = () => {
        showLoading();
        exportToCSV(tableDataFiltedFinal);
    };

    return (
        <>
            {/* <Button className="button-box" onClick={showLoading}
                type="primary" icon={<DeleteFilled />} size={'large'}>
                导出信息
            </Button> */}
            <Modal
                title={<h2>导入信息</h2>}
                footer={
                    <Button type="primary" onClick={onClick}>
                        确 认
                    </Button>
                }
                loading={loading}
                open={open}
                onCancel={() => setOpen(false)}
            >
            </Modal>
        </>
    );
};

export default ImportModal;