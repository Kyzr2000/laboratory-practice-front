// import React, { useState, useEffect } from 'react';
// import { Cascader } from 'antd';
// import type { CascaderProps } from 'antd/es/cascader';
// import { provinces, cities, areas } from 'china-division';

// // 定义行政区划类型
// interface Region {
//   code: string;
//   name: string;
// }

// interface Province extends Region {}

// interface City extends Region {
//   provinceCode: string;
// }

// interface Area extends Region {
//   cityCode: string;
// }

// // 定义级联选择器选项类型
// interface CascaderOption {
//   value: string;
//   label: string;
//   isLeaf?: boolean;
//   loading?: boolean;
//   children?: CascaderOption[];
// }

// const ChinaRegionCascader: React.FC<{
//   value?: string[];
//   onChange?: (value: string[], selectedOptions?: CascaderOption[]) => void;
//   placeholder?: string;
//   style?: React.CSSProperties;
//   disabled?: boolean;
// }> = ({
//   value = [],
//   onChange,
//   placeholder = '请选择地区',
//   style = { width: '100%' },
//   disabled = false
// }) => {
//   const [options, setOptions] = useState<CascaderOption[]>([]);

//   // 初始化省份数据
//   useEffect(() => {
//     const provinceOptions: CascaderOption[] = provinces.map((prov: Province) => ({
//       value: prov.code,
//       label: prov.name,
//       isLeaf: false // 标记有下级
//     }));
//     setOptions(provinceOptions);
//   }, []);

//   // 动态加载下级
//   const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
//     const targetOption = selectedOptions[selectedOptions.length - 1];
//     if (!targetOption) return;

//     targetOption.loading = true;
//     // 创建新的数组引用触发重新渲染
//     const newOptions = [...options];
//     setOptions(newOptions);

//     try {
//       let children: CascaderOption[] = [];

//       if (selectedOptions.length === 1) {
//         // 加载市级数据
//         children = cities
//           .filter(city => city.provinceCode === targetOption.value)
//           .map(city => ({
//             value: city.code,
//             label: city.name,
//             isLeaf: false
//           }));
//       } else if (selectedOptions.length === 2) {
//         // 加载区县级数据
//         children = areas
//           .filter(area => area.cityCode === targetOption.value)
//           .map(area => ({
//             value: area.code,
//             label: area.name,
//             isLeaf: true
//           }));
//       }

//       targetOption.children = children;
//     } catch (error) {
//       console.error('加载地区数据失败:', error);
//     } finally {
//       targetOption.loading = false;
//       // 再次更新选项以反映变化
//       setOptions([...newOptions]);
//     }
//   };

//   // 处理选择变化
//   const handleChange: CascaderProps['onChange'] = (value, selectedOptions) => {
//     if (onChange) {
//       onChange(value as string[], selectedOptions as CascaderOption[]);
//     }
//   };

//   return (
//     <Cascader
//       options={options}
//       loadData={loadData}
//       onChange={handleChange}
//       value={value}
//       placeholder={placeholder}
//       displayRender={(labels) => labels.join(' / ')}
//       changeOnSelect
//       style={style}
//       disabled={disabled}
//     />
//   );
// };

// export default ChinaRegionCascader;
