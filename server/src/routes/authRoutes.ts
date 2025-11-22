import { Hono } from 'hono';
import { AuthController } from '../controllers/AuthController';

const authRoutes = new Hono();
const authController = new AuthController();

// 登录路由
authRoutes.post('/login', authController.login);

// 修改密码
authRoutes.post('/change-password', authController.changePassword);

export default authRoutes;