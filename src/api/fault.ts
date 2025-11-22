// import faultData from "./faultData.js";
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

// 获取所有故障日志
export const fetchFaultLogs = async (): Promise<FaultLog[]> => {
  try {
    const response = await fetch(API_BASE_URL);
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
    const response = await fetch(`${API_BASE_URL}/${id}`);
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
    const response = await fetch(`${API_BASE_URL}/asset/${assetIP}`);
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
    const response = await fetch(`${API_BASE_URL}/attacker/${attackerIP}`);
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
    const response = await fetch(`${API_BASE_URL}/threat/${threatLevel}`);
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    });

    if (!response.ok) {
      throw new Error(`Failed to delete fault log: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting fault log:', error);
    return false;
  }
};

// 保存faultData数组到数据库
export const saveFaultLogs = async (): Promise<{ count: number; faultLogs: FaultLog[] } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to save fault logs: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      count: data.count,
      faultLogs: data.faultLogs
    };
  } catch (error) {
    console.error('Error saving fault logs:', error);
    return null;
  }
};
export const saveNewFaultLogs = async (): Promise<{ count: number; faultLogs: FaultLog[] } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-new`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to save fault logs: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      count: data.count,
      faultLogs: data.faultLogs
    };
  } catch (error) {
    console.error('Error saving fault logs:', error);
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

// export const getAlertData = (): Promise<{ data: AlertItem[] }> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: faultData as AlertItem[],
//       });
//     }, 300);
//   });
// };

// export const getLinerCharttData = (type: string) => {
//   let result: Record<string, number[]> = {};


//   if (type === 'day30') {
//     // 之前 30 天（5 月）的统计逻辑
//     result = getMothData();
//   } else if (type === 'day1') {
//     // 前一天 0 到 24 时的统计逻辑
//     result = getLastDayData();
//   }

//   return result;
// };
// const getMothData = () => {
//   const day30Result: Record<string, number[]> = {};
//   const threatLevels = new Set(faultData.map(alert => alert.threatLevel));
//   threatLevels.forEach(level => {
//     day30Result[level] = new Array(31).fill(0);
//   });

//   for (const alert of faultData) {
//     const { threatLevel, occurrence } = alert;
//     const [year, month, dayStr] = occurrence.split(' ')[0].split('-');
//     if (year === '2025' && month === '05') {
//       const day = parseInt(dayStr, 10) - 1;
//       if (day30Result[threatLevel]) {
//         day30Result[threatLevel][day]++;
//       }
//     }
//   }
//   return day30Result;

// }

// const getLastDayData = () => {
//   const day1Result: Record<string, number[]> = {};
//   const threatLevels = new Set(faultData.map(alert => alert.threatLevel));
//   threatLevels.forEach(level => {
//     day1Result[level] = new Array(24).fill(0);
//   });

//   const now = new Date();
//   const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
//   const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
//   const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

//   for (const alert of faultData) {
//     const { threatLevel, occurrence } = alert;
//     const alertDate = new Date(occurrence);
//     if (alertDate >= yesterdayStart && alertDate <= yesterdayEnd) {
//       const hour = alertDate.getHours();
//       if (day1Result[threatLevel]) {
//         day1Result[threatLevel][hour]++;
//       }
//     }
//   }
//   return day1Result;
// }

