import React, {useState, useEffect} from 'react';
import {Card, Row, Col, Typography} from 'antd';
import lunisolar from 'lunisolar';
import { useTranslation } from 'react-i18next';
const {Title, Text} = Typography;
let solarTerm = null
const SolarTerms = (currentLanguage) => {
    const { t } = useTranslation(); // 使用翻译钩子
    const [currentDate, setCurrentDate] = useState(null);
    const [Suggestion, setSuggestion] = useState(null);
    const [currentTerm, setCurrentTerm] = useState(null);
    const [error, setError] = useState(null);
    const solarTermKeys = {
        "小满": "xiaoMan",
        "芒种": "mangZhong",
        "处暑": "chuShu",
        "立春": "liChun",
        "雨水": "yuShui",
        "驚蟄": "jingZhe",
        "春分": "chunFen",
        "清明": "qingMing",
        "谷雨": "guYu",
        "立夏": "liXia",
        "小滿": "xiaoMan",
        "芒種": "mangZhong",
        "夏至": "xiaZhi",
        "小暑": "xiaoShu",
        "大暑": "daShu",
        "立秋": "liQiu",
        "處暑": "chuShu",
        "白露": "baiLu",
        "秋分": "qiuFen",
        "寒露": "hanLu",
        "霜降": "shuangJiang",
        "立冬": "liDong",
        "小雪": "xiaoXue",
        "大雪": "daXue",
        "冬至": "dongZhi",
        "小寒": "xiaoHan",
        "大寒": "daHan"
    };
    useEffect(() => {
        if (currentLanguage) {
            setCurrentTerm(t(`solarTerms.${solarTermKeys[solarTerm]}`));
            setSuggestion(t(`solarTermAdvice.${solarTermKeys[solarTerm]}`))
            setCurrentDate(new Date().toLocaleDateString('zh-CN'))
        }
    }, [currentLanguage]);
    // 获取节气数据
    useEffect(() => {
        try {
            let now = new Date();
            while (true) {
                now = new Date(now.setDate(now.getDate() - 1));
                solarTerm = lunisolar(now).solarTerm?.toString()
                if (solarTerm != null) {
                    break;
                }
            }
            setCurrentTerm(t(`solarTerms.${solarTermKeys[solarTerm]}`));
            setSuggestion(t(`solarTermAdvice.${solarTermKeys[solarTerm]}`))
            setCurrentDate(new Date().toLocaleDateString('zh-CN'))
        } catch (err) {
            setError(err.message || '获取节气信息失败');
        }
    }, []);

    // 格式化当前日期
    const formatDate = (date) => {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    return (
        <Card bodyStyle={{ padding: 16 }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row gutter={16}>
                        <Col>
                            <Text strong>{t('solarTerms.dateLabel')}</Text>
                            <Text>{currentDate}</Text>
                        </Col>
                        <Col>
                            <Text strong>{t('solarTerms.solarTermLabel')}</Text>
                            <Text type="secondary">{currentTerm}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Text
                        style={{
                            display: 'inline-block',
                            whiteSpace: 'pre-line',
                            wordBreak: 'break-word',
                            lineHeight: 1.6,
                            width: '100%'
                        }}
                    >
                        <Text>{t('solarTerms.suggestionLabel')}</Text>
                        {Suggestion}
                    </Text>
                </Col>
            </Row>
        </Card>
    );
};

export default SolarTerms;