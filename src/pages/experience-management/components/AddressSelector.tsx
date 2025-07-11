import { Cascader } from 'antd';
import { addressOptions } from './addressData';

// 地址选择器组件
interface AddressSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const AddressSelector = ({ value, onChange }: AddressSelectorProps) => {
  const handleChange = (value: (string | number)[]) => {
    // 确保我们只处理字符串数组
    const stringValue = value.map((v) => v.toString());
    onChange?.(stringValue);
  };

  return (
    <Cascader
      options={addressOptions}
      placeholder="请选择省市区"
      showSearch
      value={value}
      onChange={handleChange}
    />
  );
};

export default AddressSelector;
