import type { LoginResponse } from '../types/auth';

// API基础URL
const API_BASE_URL = 'http://localhost:8080/api/auth';

/**
 * 登录接口
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据或null（失败时）
 */
export const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`登录失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('登录错误:', error);
    return null;
  }
};

export const changePassword = async (username: string, oldPassword: string, newPassword: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, oldPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error(`修改密码失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('修改密码错误:', error);
    return null;
  }
};