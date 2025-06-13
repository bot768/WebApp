const express = require('express');
const app = express();
const port = 5000;

// 解析 JSON 格式的请求体
app.use(express.json());

// 一个简单的测试路由
app.get('/api/test', (req, res) => {
    res.json({ message: '后端服务器正常运行！' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在监听端口 ${port}`);
});