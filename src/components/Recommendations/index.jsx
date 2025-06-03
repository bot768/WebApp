import React from 'react';
import { Card, Spin, Typography } from 'antd';

const { Text } = Typography;

const Recommendations = ({ recommendations, loading, currentLanguage }) => {
  if (loading) return <Spin />;
  if (!recommendations) return null;

  // 处理AI返回内容，保留换行但去除Markdown标记
  const formatRecommendations = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // 去除加粗标记
      .replace(/\*(.*?)\*/g, '$1')     // 去除斜体标记
      .replace(/```[^]*?```/g, '')     // 去除代码块
      .replace(/#+\s/g, '');           // 去除标题标记
  };

  return (
    <Card 
      title={currentLanguage === 'zh' ? 'AI建议' : 'AI Recommendations'}
      style={{ marginTop: 16 }}
    >
      <div style={{ 
        padding: 12,
        background: '#f9f9f9',
        borderRadius: 4,
        lineHeight: 1.6,
        fontSize: 15,
        whiteSpace: 'pre-line' // 保留自然换行
      }}>
        <Text>{formatRecommendations(recommendations)}</Text>
      </div>
    </Card>
  );
};

export default Recommendations;