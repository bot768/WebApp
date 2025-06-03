import React from 'react';
import { Card, Row, Col, Typography, Image } from 'antd';

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

const { Title, Text } = Typography;

const CurrentWeather = ({ currentLanguage, weatherData }) => {
  if (!weatherData) return null;

  const cityName = weatherData.name;
  const temperature = Math.round(weatherData.main.temp - 273.15);
  const description = weatherData.weather[0].description;
  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Title level={2}>{cityName}</Title>
          <Text strong>{translations[currentLanguage].currentWeather}</Text>
          <Text>{temperature}°C</Text>
          <Text>{description}</Text>
        </Col>
        <Col span={12}>
          <Image src={iconUrl} preview={false} />
        </Col>
      </Row>
    </Card>
  );
};

export default CurrentWeather;