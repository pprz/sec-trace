// 从环境变量中读取配置
export const JWT_SECRET = process.env.JWT_SECRET || 'sec_trace_jwt_secret';  // 建议在生产环境中通过环境变量配置