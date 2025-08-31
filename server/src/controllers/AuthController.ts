import { Context } from 'hono';
import { UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ChangePasswordRequest, LoginRequest, LoginResponse } from '../types';
import { JWT_SECRET } from '../config/env';  // 导入JWT密钥配置

export class AuthController {
  private userModel: UserModel;
  private jwtSecret: string;

  constructor() {
    // 添加错误处理和初始化验证
    this.userModel = new UserModel();
    this.jwtSecret = JWT_SECRET;
    // 绑定方法上下文
    this.login = this.login.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  // 登录处理
  async login(c: Context) {
    try {
      // 添加上下文验证
      if (!this.userModel) {
        console.error('userModel未正确初始化');
        return c.json<LoginResponse>({ success: false, error: '系统错误，请联系管理员' }, 500);
      }

      const { username, password } = await c.req.json<LoginRequest>();

      // 验证输入
      if (!username || !password) {
        return c.json<LoginResponse>({ success: false, error: '用户名和密码不能为空' }, 400);
      }

      // 查找用户 - 确保使用正确的属性名
      const user = await this.userModel.findByUsername(username);
      if (!user) {
        return c.json<LoginResponse>({ success: false, error: '用户不存在' }, 401);
      }

      // 验证密码
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return c.json<LoginResponse>({ success: false, error: '密码错误' }, 401);
      }

      // 生成JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      // 返回成功响应
      return c.json<LoginResponse>({
        success: true,
        token,
        user: {
          id: user.id as string,
          username: user.username,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      return c.json<LoginResponse>({ success: false, error: '登录失败' }, 500);
    }
  }

  // 修改密码处理
  async changePassword(c: Context) {
    try {
      // 添加上下文验证
      if (!this.userModel) {
        console.error('userModel未正确初始化');
        return c.json<LoginResponse>({ success: false, error: '系统错误，请联系管理员' }, 500);
      }

      const { username, oldPassword, newPassword } = await c.req.json<ChangePasswordRequest>();

      // 验证输入
      if (!username || !oldPassword || !newPassword) {
        return c.json<LoginResponse>({ success: false, error: '用户名、旧密码和新密码都不能为空' }, 400);
      }

      // 查找用户 - 确保使用正确的属性名
      const user = await this.userModel.findByUsername(username);
      if (!user) {
        return c.json<LoginResponse>({ success: false, error: '用户不存在' }, 401);
      }

      // 验证旧密码
      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return c.json<LoginResponse>({ success: false, error: '旧密码错误' }, 401);
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 更新密码
      const updatedUser = await this.userModel.update(user.id!, { password: hashedPassword });

      if (!updatedUser) {
        return c.json<LoginResponse>({ success: false, error: '密码更新失败' }, 500);
      }

      // 返回成功响应
      return c.json({
        success: true,
        message: '密码修改成功'
      });
    } catch (error) {
      console.error('密码修改失败:', error);
      return c.json<LoginResponse>({ success: false, error: '密码修改失败' }, 500);
    }
  }
}

