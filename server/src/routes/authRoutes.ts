import { Hono } from 'hono';
import { AuthController } from '../controllers/AuthController';
import { standerUser } from '../middleware/authMiddleware';

const authRoutes = new Hono();
const authController = new AuthController();
authRoutes.use('*/change-password', standerUser);
// 登录路由 - 不需要权限校验
authRoutes.post('/login', authController.login);

// 修改密码 - 需要权限校验
authRoutes.post('/change-password', authController.changePassword);

export default authRoutes;