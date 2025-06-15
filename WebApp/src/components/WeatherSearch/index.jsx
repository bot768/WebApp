import React, { useState, useRef } from 'react';
import { AutoComplete, Input, message } from 'antd';
import { translations } from '../../translations.jsx';

// 可配置API地址，需与LanguageSwitcher一致
const API_BASE_URL = 'https://lxyz.qifudaren.net/demoapi';

const WeatherSearch = ({ currentLanguage, getWeather, cityName, setCityName }) => {
  const [options, setOptions] = useState([]);
  const userRef = useRef(null);

  // 获取当前登录用户
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      userRef.current = JSON.parse(storedUser);
    } else {
      userRef.current = null;
    }
  }, []);

  // 输入时调用历史补全接口
  const handleSearch = async (value) => {
    setCityName(value);
	const storedUser = localStorage.getItem('user');
	if (storedUser) {
	  userRef.current = JSON.parse(storedUser);
	} else {
	  userRef.current = null;
	}
    const user = userRef.current;
    if (user && value) {
      try {
        const param = { userId: user.id, name: value };
        const res = await fetch(`${API_BASE_URL}/history/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(param),
        });
        const data = await res.json();
        if (data.code === 200) {
          setOptions((data.data || []).map((item) => ({ value: item.name })));
        } else {
          setOptions([]);
        }
      } catch {
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  };

  // 搜索时调用增加搜索记录接口
  const handleSearchClick = async (value) => {
    setCityName(value);
    const user = userRef.current;
    if (user && value) {
      try {
        await fetch(`${API_BASE_URL}/history/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, name: value }),
        });
      } catch {
        // 可选：message.warning('记录搜索历史失败');
      }
    }
    getWeather(value);
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 400 }}
      onSearch={handleSearch}
      value={cityName}
      onChange={handleSearch}
    >
      <Input.Search
        placeholder={translations[currentLanguage].searchPlaceholder}
        enterButton
        size="large"
        onSearch={handleSearchClick}
      />
    </AutoComplete>
  );
};

export default WeatherSearch;