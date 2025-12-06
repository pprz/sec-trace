import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'
import { JwtPayload } from '../types'

/**
 * Token 验证中间件
 * 验证请求中的 JWT token 并将解码后的用户信息添加到上下文中
 * 
 * @param c - Hono 上下文对象
 * @param next - 下一步函数
 * @returns Promise<void>
 */
export const standerUser = async (c: Context, next: Next) => {
  // 获取 Authorization header
  const authHeader = c.req.header('Authorization')

  // 检查是否存在 Authorization header
  if (!authHeader) {
    return c.json({ error: 'Missing authorization header' }, 401)
  }

  // 检查是否是 Bearer token 格式
  const tokenParts = authHeader.split(' ')
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return c.json({ error: 'Invalid authorization format' }, 401)
  }

  const token = tokenParts[1]

  try {
    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    // 将用户信息添加到 context 中供后续使用
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}


export const adminUser = async (c: Context, next: Next) => {
  // 获取 Authorization header
  const authHeader = c.req.header('Authorization')

  // 检查是否存在 Authorization header
  if (!authHeader) {
    return c.json({ error: 'Missing authorization header' }, 401)
  }

  // 检查是否是 Bearer token 格式
  const tokenParts = authHeader.split(' ')
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return c.json({ error: 'Invalid authorization format' }, 401)
  }

  const token = tokenParts[1]

  try {
    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    // 将用户信息添加到 context 中供后续使用
    c.set('user', decoded)
    if (decoded.username !== 'admin') {
      return c.json({ error: 'Invalid user' }, 401)
    }
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}