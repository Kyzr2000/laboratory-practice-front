import './style.less';

import { FileSearchOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { GET_PEOPLE } from '@/pages/graphql/people.graphql';

import type { OptionItemType, PeopleType } from './Atom/InterfaceState';
import { InputState } from './Atom/InterfaceState';
import { OptionsItemFilterState } from './Atom/OptionsItemFilterState';
import { OptionsState } from './Atom/OptionsState';

const SearchPractice: React.FC = () => {

    const { data, error, loading } = useQuery(GET_PEOPLE);
    const [options, setOptions] = useRecoilState<OptionItemType[]>(OptionsState);
    const [searchValue, setSearchValue] = useState<string>('');  // 用于存储输入框的值
    const setOptionItem = useSetRecoilState<OptionItemType>(OptionsItemFilterState);
    const [inputValue, setInputValue] = useState<string>('');
    const setInputValue1 = useSetRecoilState<string>(InputState);

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
    }, [data, setOptions]);


    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p>Loading...</p>;

    const onChange = (value: string) => {
        setSearchValue(value);
    };

    const onSearch = (value: string) => {
        setSearchValue(value);
    };

    const onClick = () => {
        setOptionItem({
            value: searchValue,
            label: searchValue
        });
        console.log(inputValue);
        setInputValue1(inputValue);
    };

    return (
        <>
            <Col span={12} offset={1}>
                <Space size={'large'}>

                    <Select
                        showSearch
                        placeholder="请输入人员状态"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        options={options}
                        filterOption={(input, option) => {
                            const opt = option as OptionItemType;
                            return opt.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }
                        }
                        className='select-box'
                    />

                    <Input className="input-box" placeholder="请输入账号"
                        value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                    />

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
