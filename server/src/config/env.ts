// 从环境变量中读取配置
export const JWT_SECRET = process.env.JWT_SECRET || 'sec_trace_jwt_secret';  // 建议在生产环境中通过环境变量配置

// CORS 配置 - 限制允许的来源
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';  // 默认只允许本地开发前端