export interface FaultLog {
  id?: string;
  occurrence: string;
  assetIP: string;
  attackerIP: string;
  level1Type: string;
  level2Type: string;
  attackResult: string;
  threatLevel: string;
  threatName: string;
  eventNamet: string
  safety: string
  disposalstatus: string
  terminalDetails: string
  payload?: string;
  requestHeader?: string;
  responseHeader?: string;
  responseBody?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API基础URL
const API_BASE_URL = 'http://localhost:8080/api/fault-logs';

// 获取认证头
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// 获取所有故障日志
export const fetchFaultLogs = async (): Promise<FaultLog[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch fault logs: ${response.statusText}`);
    }
    const data = await response.json();
    return data.faultLogs;
  } catch (error) {
    console.error('Error fetching fault logs:', error);
    return []
  }
};

// 根据ID获取特定故障日志
export const fetchFaultLogById = async (id: string): Promise<FaultLog | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch fault log: ${response.statusText}`);
    }
    const data = await response.json();
    return data.faultLog;
  } catch (error) {
    console.error('Error fetching fault log:', error);
    return null;
  }
};

// 根据资产IP获取故障日志
export const fetchFaultLogsByAssetIP = async (assetIP: string): Promise<FaultLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/asset/${assetIP}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch fault logs by asset IP: ${response.statusText}`);
    }
    const data = await response.json();
    return data.faultLogs;
  } catch (error) {
    console.error('Error fetching fault logs by asset IP:', error);
    return [];
  }
};

// 根据攻击者IP获取故障日志
export const fetchFaultLogsByAttackerIP = async (attackerIP: string): Promise<FaultLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attacker/${attackerIP}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch fault logs by attacker IP: ${response.statusText}`);
    }
    const data = await response.json();
    return data.faultLogs;
  } catch (error) {
    console.error('Error fetching fault logs by attacker IP:', error);
    return [];
  }
};

// 根据威胁等级获取故障日志
export const fetchFaultLogsByThreatLevel = async (threatLevel: string): Promise<FaultLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/threat/${threatLevel}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch fault logs by threat level: ${response.statusText}`);
    }
    const data = await response.json();
    return data.faultLogs;
  } catch (error) {
    console.error('Error fetching fault logs by threat level:', error);
    return [];
  }
};

// 创建新的故障日志
export const createFaultLog = async (faultLog: Omit<FaultLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<FaultLog | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(faultLog),
    });

    if (!response.ok) {
      throw new Error(`Failed to create fault log: ${response.statusText}`);
    }

    const data = await response.json();
    return data.faultLog;
  } catch (error) {
    console.error('Error creating fault log:', error);
    return null;
  }
};

// 更新故障日志
export const updateFaultLog = async (id: string, faultLog: Partial<FaultLog>): Promise<FaultLog | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(faultLog),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to update fault log: ${response.statusText}`);
    }

    const data = await response.json();
    return data.faultLog;
  } catch (error) {
    console.error('Error updating fault log:', error);
    return null;
  }
};

// 删除故障日志
export const deleteFaultLog = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      throw new Error(`Failed to delete fault log: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting fault log:', error);
    return false;
  }
};

// 保存故障数据
export const saveFaultLogs = async (): Promise<{ message: string; count: number } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to save fault logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving fault logs:', error);
    return null;
  }
};

// 保存新故障数据
export const saveNewFaultLogs = async (): Promise<{ message: string; count: number } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-new`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to save new fault logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving new fault logs:', error);
    return null;
  }
};

export interface AlertItem {
  occurrence: string;
  attackerIP: string;
  assetIP: string;
  level1Type: string;
  level2Type: string;
  attackResult: string;
  threatLevel: string;
  threatName: string;
  eventNamet: string
  safety: string
  disposalstatus: string
  terminalDetails: string
  payload: string;
  requestHeader?: string;
  requestBody?: string;
  responseHeader?: string;
  responseBody?: string;
}