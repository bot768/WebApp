import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const LanguageSwitcher = ({ currentLanguage, changeLanguage }) => {
  return (
    <Select 
      defaultValue={currentLanguage}
      style={{ width: 120 }}
      onChange={changeLanguage}
    >
      <Option value="zh">中文</Option>
      <Option value="en">English</Option>
    </Select>
  );
};

export default LanguageSwitcher;