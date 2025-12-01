import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import Database from './config/db'
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';  // 导入认证路由
import faultLogRoutes from './routes/faultLogRoutes';  // 恢复faultLogRoutes导入

import { serve } from '@hono/node-server'
// 创建 Hono 应用实例
const app = new Hono()

// 中间件
app.use(logger())
// 配置CORS - 严格限制来源和方法，移除credentials配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // 从环境变量读取允许的来源
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 仅允许必要HTTP方法
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // 限制允许的请求头
}))

// 数据库连接
const database = Database.getInstance()

// 基础路由
app.get('/', (c) => {
  return c.json({
    message: 'Sec-Trace API Server',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API 路由
app.route('/api/users', userRoutes);
app.route('/api/auth', authRoutes);  // 添加认证路由
app.route('/api/fault-logs', faultLogRoutes);  // 恢复faultLogRoutes注册

// 启动服务器
const startServer = async () => {
  const port = parseInt(process.env.PORT || '8080')

  // 连接数据库
  await database.connect()

  // 启动服务器
  const server = serve({
    fetch: app.fetch,
    port
  }, () => {
    // 在开发环境中直接启动
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 Server is running on port ${port}`)
      console.log(`📝 Health check at: http://localhost:${port}/health`)
      console.log(`📚 API docs at: http://localhost:${port}/api/users`)
      console.log(`📊 Fault logs API at: http://localhost:${port}/api/fault-logs`)
    }
  })

  return server
}

// 如果直接运行此文件，则启动服务器
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })
}

export default startServer