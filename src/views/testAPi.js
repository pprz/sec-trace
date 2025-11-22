const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

// 密钥（需安全存储，如环境变量）
const JWT_SECRET = 'your_jwt_secret_key';

// 用户注册
app.post('/api/auth/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // 存储用户到数据库...
    res.status(201).json({ message: '注册成功', userId: '123' });
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    // 从数据库查询用户...
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: '密码错误' });

    const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ token, expiresIn: 3600 });
});

// 受保护的接口（需 Token）
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: '缺少 Token' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token 无效' });
        req.user = user;
        next();
    });
}

// 日志查询
app.get('/api/logs', authenticateToken, (req, res) => {
    // 查询日志...
    res.json({ logs: [...] });
});

// 报表下载
app.get('/api/reports/download', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: '无权限访问' });
    }
    // 返回文件流或下载链接...
});