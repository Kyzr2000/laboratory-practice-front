import './style.less';

import { FileSearchOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { GET_PEOPLE } from '@/pages/graphql/people.graphql';

import type {OptionItemType, PeopleType } from './Atom/InterfaceState';
import { InputState} from './Atom/InterfaceState';
import { OptionsItemFilterState } from './Atom/OptionsItemFilterState';
import { OptionsState } from './Atom/OptionsState';

const SearchPractice: React.FC = () => {

    const { data, error, loading } = useQuery(GET_PEOPLE);
    const [options, setOptions] = useRecoilState<OptionItemType[]>(OptionsState);
    const setOptionItem = useSetRecoilState<OptionItemType>(OptionsItemFilterState);
    const setInputValue = useSetRecoilState<string>(InputState);
    const [localInput, setLocalInput] = useState<string>('');


    useEffect(() => {
        if (data) {
            const newOptions = data.getPeople.map((person: PeopleType) => ({
                value: person.is_enabled,
                label: person.is_enabled,
            }));
            // 使用 Map 进行去重
            const optionsMap = new Map<string, OptionItemType>();
            newOptions.forEach(option => {
                optionsMap.set(option.value, option);
            });
            const uniqueOptions = Array.from(optionsMap.values());

            // 在去重后的数组前添加 'Show All' 选项
            const finalOptions: OptionItemType[] = [
                { value: 'Show All', label: 'Show All' },
                ...uniqueOptions,
            ];
            setOptions(finalOptions);
        }
        // input框功能优化，当删除后自动刷新selector筛选值
        if (localInput.length <= 0) {setInputValue(localInput);}
    }, [data, setOptions, localInput, setInputValue]);


    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p>Loading...</p>;

    // 合并 onChange 和 onSearch 到一个函数中，并在选中选项时立即更新筛选状态
    const onChange = (value: string) => {
        // 当下拉框的值变更时，立即设置筛选项状态
        setOptionItem({ value, label: value });
    };

    // 点击函数用来获取第二次过滤后的filterData
    const onClick = () => {
        setInputValue(localInput);
    };

    return (
        <>
            <Col span={12} offset={1}>
                <Space size={'large'}>

                    <Select
                        showSearch
                        placeholder="请输入人员状态"
                        optionFilterProp="label"
                        onChange={onChange} // 使用 onChange 处理下拉框的变更
                        options={options}
                        filterOption={(input, option) => {
                            const opt = option as OptionItemType;
                            return opt.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                        className='select-box'
                    />

                    <Input className="input-box" placeholder="请输入账号"
                        value={localInput}
                        onChange={(e) => {
                            setLocalInput(e.target.value);
                            // setInputValue(e.target.value);
                        }} // 更新输入框的值，并保持状态同步
                    />

                    {/* 搜索按钮现在不需要，因为我们已经实现了即时筛选 */}
                    <Button className="button-box" type="primary" onClick={() => onClick()}>
                        <FileSearchOutlined />
                        <span>搜 索</span>
                    </Button>
                </Space>
            </Col>
        </>
    );
};

export default SearchPractice;