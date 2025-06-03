import { Input } from 'antd';
import { translations } from '../../translations.jsx';  // Changed from '../translations.jsx'

const WeatherSearch = ({ currentLanguage, getWeather, cityName, setCityName }) => {
  return (
    <Input.Search
      placeholder={translations[currentLanguage].searchPlaceholder}
      enterButton
      size="large"
      style={{ width: 400 }}
      onSearch={getWeather}
      value={cityName}
      onChange={(e) => setCityName(e.target.value)}
    />
  );
};

export default WeatherSearch;