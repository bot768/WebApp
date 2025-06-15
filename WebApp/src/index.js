import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'; // 引入 i18n 配置
import App from './App';
import './App.css'; // 引入全局样式表

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
