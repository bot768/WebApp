import React from 'react';
const translations = {
    en: {
      title: 'Weather App',
      placeholder: 'Enter city name',
      searchBtn: 'Search',
      errorMsg: 'Please enter a city name',
      notFound: 'City not found',
      currentWeather: 'Current Weather',
      hourlyForecast: 'Hourly Forecast',
      weatherInfo: {
        temperature: 'Temperature',
        description: 'Description'
      }
    },
    zh: {
      title: '天气应用',
      placeholder: '请输入城市名称',
      searchBtn: '搜索',
      errorMsg: '请输入城市名称',
      notFound: '城市未找到',
      currentWeather: '当前天气',
      hourlyForecast: '小时预报',
      weatherInfo: {
        temperature: '温度',
        description: '天气描述'
      }
    }
};

function HourlyForecast({ currentLanguage, hourlyData }) {
  if (hourlyData.length === 0) return null;

  const next24Hours = hourlyData.slice(0, 8);

  return (
    <div>
      <h2>{translations[currentLanguage].hourlyForecast}</h2>
      {/* 创建带有 hourly-forecast 类名的容器 */}
      <div className="hourly-forecast"> 
        {next24Hours.map((item, index) => {
          const dateTime = new Date(item.dt * 1000);
          const hour = dateTime.getHours();
          const temperature = Math.round(item.main.temp - 273.15);
          const iconCode = item.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

          return (
            <div key={index} className="hourly-item">
              <span>{hour}:00</span>
              <img src={iconUrl} alt="Hourly Weather Icon" />
              <span>{temperature}°C</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;