import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import Database from './config/db'
import userRoutes from './routes/userRoutes'
import faultLogRoutes from './routes/faultLogRoutes'
import { serve } from '@hono/node-server'

// 创建 Hono 应用实例
const app = new Hono()

// 中间件
app.use(logger())
app.use(cors())

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
app.route('/api/users', userRoutes)
app.route('/api/fault-logs', faultLogRoutes)

// 启动服务器
const startServer = async () => {
  const port = parseInt(process.env.PORT || '3000')

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