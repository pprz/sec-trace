import type { UserStat } from '@/types/users';

// 定义用户类型，与后端保持一致
export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API基础URL
const API_BASE_URL = 'http://localhost:8080/api/users';

// 获取所有用户
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // 出错时返回本地数据
    return [
      { id: '1', name: '张三', email: 'zhangsan@example.com', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: '2', name: '李四', email: 'lisi@example.com', createdAt: '2023-01-02', updatedAt: '2023-01-02' },
    ];
  }
};

// 根据ID获取用户
export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// 创建用户
export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// 更新用户
export const updateUser = async (id: string, user: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// 删除用户
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// 原有的本地数据方法保持不变
export const getUserStats = (): UserStat[] => [
  { value: '120,899', label: '威胁总量', color: '#ed3f35' },
  { value: '248', label: '本月新增', color: '#eacf19' },
];