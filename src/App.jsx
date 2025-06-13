import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Alert } from 'antd';
import LanguageSwitcher from './components/LanguageSwitcher';
import WeatherSearch from './components/WeatherSearch';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import Recommendations from './components/Recommendations';
import { translations } from './translations.jsx';
import SolarTerms from "./components/SolarTerms";

const { Header } = Layout;

function App() {
    const [currentLanguage, setCurrentLanguage] = useState('zh');
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [token, setToken] = useState(''); // 假设从本地存储或状态中获取 JWT 令牌

    useEffect(() => {
        loadAMapScript()
           .then(() => getLocation())
           .catch(console.error);
    }, []);

    const changeLanguage = (language) => {
        setCurrentLanguage(language);
    };

    const loadAMapScript = () => {
        if (typeof window.AMap !== 'undefined') {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://webapi.amap.com/maps?v=2.0&key=c89331b23f0b405800df401402b4b04d';
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    };

    const convertChineseToPinyin = (cityName) => {
        const cityMap = {
            '北京': 'beijing',
            '上海': 'shanghai',
            // ... 其他城市映射
        };
        return cityMap[cityName] || cityName;
    };

    const getAiRecommendations = async (cityName, weatherData) => {
        if (!weatherData || !weatherData.weather) {
            console.error('无效的天气数据');
            return;
        }
        setLoadingRecommendations(true);
        try {
            const response = await fetch('http://localhost:5000/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    city: cityName,
                    weatherData,
                    language: currentLanguage
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            if (!data) {
                throw new Error('无效的API响应格式');
            }

            setAiRecommendations(data);
        } catch (err) {
            console.error('获取AI建议失败:', err);
            setError(currentLanguage === 'zh' ? `获取建议失败: ${err.message}` : `Failed to get recommendations: ${err.message}`);
        } finally {
            setLoadingRecommendations(false);
        }
    };

    const getWeather = async (cityName) => {
        if (!cityName) {
            setError(translations[currentLanguage].errorMsg);
            return;
        }

        try {
            let formattedCityName = cityName;
            if (/[\u4e00-\u9fa5]/.test(cityName)) {
                formattedCityName = convertChineseToPinyin(cityName);
            }
            const response = await fetch(`http://localhost:5000/weather?city=${formattedCityName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setWeatherData(null);
                setHourlyData([]);
            } else {
                setError(null);
                setWeatherData(data.current);
                setHourlyData(data.forecast.list);
                getAiRecommendations(cityName, data.current);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('获取天气信息失败');
            setWeatherData(null);
            setHourlyData([]);
        }
    };

    const getLocation = async () => {
        if ("geolocation" in navigator) {
            const options = {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            };
            await navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log("纬度和经度:", latitude, longitude);
                    await window.AMap.plugin('AMap.Geocoder', async function () {
                        var geocoder = new window.AMap.Geocoder({})
                        var lnglat = [longitude, latitude]
                        await geocoder.getAddress(lnglat, async function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                setCityName(result["regeocode"]["addressComponent"]["city"])
                                getWeather(result["regeocode"]["addressComponent"]["city"])
                            }
                        })
                    })
                },
                (error) => {
                    console.log(error)
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("用户拒绝了位置权限");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("无法获取位置信息（设备无信号）");
                            break;
                        case error.TIMEOUT:
                            console.error("请求超时");
                            break;
                    }
                },
                options
            );
        } else {
            console.error("当前浏览器不支持地理位置功能");
        }
    }

    return (
        <Layout className="App" style={{
            minHeight: '100vh',
            maxWidth: '414px',
            margin: '0 auto',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <Header style={{
                background: '#fff',
                padding: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Row gutter={16} justify="center" align="middle">
                    <Col>
                        <LanguageSwitcher
                            currentLanguage={currentLanguage}
                            changeLanguage={changeLanguage}
                        />
                    </Col>
                    <Col>
                        <WeatherSearch
                            currentLanguage={currentLanguage}
                            getWeather={getWeather}
                            cityName={cityName}
                            setCityName={setCityName}
                        />
                    </Col>
                </Row>
            </Header>
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ margin: '16px', width: 'calc(100% - 32px)' }}
                />
            )}
            <div style={{
                padding: '16px'
            }}>
                <div style={{
                    marginTop: '16px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                }}>
                    <SolarTerms />
                </div>
            </div>
            {weatherData && (
                <div style={{ padding: '16px' }}>
                    <CurrentWeather
                        currentLanguage={currentLanguage}
                        weatherData={weatherData}
                    />
                    <div style={{
                        marginTop: '16px',
                        overflowX: 'auto',
                    }}>
                        <HourlyForecast
                            currentLanguage={currentLanguage}
                            hourlyData={hourlyData}
                        />
                    </div>
                    <Recommendations
                        recommendations={aiRecommendations}
                        loading={loadingRecommendations}
                        currentLanguage={currentLanguage}
                    />
                </div>
            )}
        </Layout>
    );
}

export default App;