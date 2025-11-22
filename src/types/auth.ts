// 登录请求和响应类型定义
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  error?: string;
}

// JWT解码后的用户信息
export interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}