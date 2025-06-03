import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 引入全局样式表

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);