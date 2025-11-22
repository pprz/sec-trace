
// 登录请求类型
export type LoginRequest = {
  username?: string;
  password?: string;
};

export type ChangePasswordRequest = {
  username: string;
  oldPassword: string;
  newPassword: string;
};

export interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

// 登录响应类型
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