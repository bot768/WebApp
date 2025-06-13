const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = 5000;
const cache = new NodeCache({ stdTTL: 3600 }); // 缓存有效期为 1 小时
const secretKey = 'your-secret-key'; // 用于 JWT 签名

// 允许跨域请求
app.use(cors());
app.use(express.json());

// 用户数据库模拟
const users = [];

// 注册用户
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// 用户登录
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// 验证 JWT 中间件
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// 代理天气 API 请求
app.get('/weather', verifyToken, async (req, res) => {
    const { city } = req.query;
    const cacheKey = `weather:${city}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }
    const apiKey = 'd2e1741a702fa6f7be95ea9126bd5667';
    try {
        const [currentData, forecastData] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`),
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&cnt=8`)
        ]);
        const data = {
            current: currentData.data,
            forecast: forecastData.data
        };
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// 代理 AI 推荐 API 请求
app.post('/recommendations', verifyToken, async (req, res) => {
    const { city, weatherData, language } = req.body;
    const cacheKey = `recommendations:${city}:${JSON.stringify(weatherData)}:${language}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [{
                role: "user",
                content: `作为天气助手，请为${city}的游客提供建议：
今日天气：${weatherData.weather[0].description}，温度：${Math.round(weatherData.main.temp - 273.15)}°C

请用${language === 'zh' ? '中文' : 'English'}回答：
1. 3个适合的活动建议
2. 3种当地特色饮食
3. 简要说明推荐理由`
            }],
            temperature: 0.7,
            max_tokens: 1000
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-036fd619e34046c8ba4f2fd7f078632a'
            }
        });
        const data = response.data.choices[0].message.content;
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI recommendations' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});