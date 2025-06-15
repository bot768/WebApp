import React, {useState, useEffect} from 'react';
import {Select, Button, Modal, Form, Input, message, Typography, Space} from 'antd';
import {useTranslation} from 'react-i18next';

const {Option} = Select;
const {Text} = Typography;

// 可配置API地址
const API_BASE_URL = 'https://lxyz.qifudaren.net/demoapi';

const LanguageSwitcher = ({currentLanguage, changeLanguage}) => {
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const {t} = useTranslation(); // 使用翻译钩子

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (data.code === 200) {
                localStorage.setItem('user', JSON.stringify(data.data));
                setUser(data.data);
                message.success(t('login_success'));
                setLoginVisible(false);
            } else {
                message.error(data.msg || t('network_error'));
            }
        } catch (err) {
            message.error(t('network_error'));
        }
        setLoading(false);
    };

    const onRegisterFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (data.code === 200) {
                message.success(t('register_success'));
                setRegisterVisible(false);
                setLoginVisible(true);
            } else {
                message.error(data.msg || t('network_error'));
            }
        } catch (err) {
            message.error(t('network_error'));
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/logout?id=${user.id}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (data.code === 200) {
                localStorage.removeItem('user');
                setUser(null);
                message.success(t('logout'));
            } else {
                message.error('退出登录失败');
            }
        } catch (err) {
            message.error(t('network_error'));
        }
        setLoading(false);
    };

    return (
        <Space>
            <Select
                defaultValue={currentLanguage}
                style={{width: 120, top: 15}}
                onChange={changeLanguage}
                placeholder={t(changeLanguage)}
            >
                <Option value="zh">{t('chinese')}</Option>
                <Option value="en">{t('english')}</Option>
            </Select>

            {user ? (
                <>
                    <Text style={{marginLeft: 3, marginRight: 4, marginTop: 5, marginBottom: 10, position: 'absolute'}}>
                        {t('welcome') + ":" + user.username}
                    </Text>
                    <Button onClick={handleLogout} style={{marginLeft: 88, top: 15}} loading={loading}>
                        {t('logout')}
                    </Button>
                </>
            ) : (
                <>
                    <Button type="primary" onClick={() => setLoginVisible(true)} style={{top: 15}}>
                        {t('login')}
                    </Button>
                    <Button onClick={() => setRegisterVisible(true)} style={{top: 15}}>
                        {t('register')}
                    </Button>
                </>
            )}

            {/* 登录弹窗 */}
            <Modal
                title={t('login')}
                open={loginVisible}
                onCancel={() => setLoginVisible(false)}
                footer={null}
            >
                <Form name="login" onFinish={onLoginFinish} autoComplete="off">
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: t('required_username')}]}
                    >
                        <Input placeholder={t('username')}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: t('required_password')}]}
                    >
                        <Input.Password placeholder={t('password')}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {t('submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 注册弹窗 */}
            <Modal
                title={t('register')}
                open={registerVisible}
                onCancel={() => setRegisterVisible(false)}
                footer={null}
            >
                <Form name="register" onFinish={onRegisterFinish} autoComplete="off">
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: t('required_username')}]}
                    >
                        <Input placeholder={t('username')}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: t('required_password')}]}
                    >
                        <Input.Password placeholder={t('password')}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {t('submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default LanguageSwitcher;
