import faultData from "./faultData.js";
export interface AlertItem {
  occurrence: string;
  attackerIP: string;
  assetIP: string;
  level1Type: string;
  level2Type: string;
  attackResult: string;
  threatLevel: string;
  threatName: string;
  payload: string;
  requestHeader?: string;
  requestBody?: string;
  responseHeader?: string;
  responseBody?: string;
}

export const getAlertData = (): Promise<{ data: AlertItem[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: faultData as AlertItem[],
      });
    }, 300);
  });
};

export const getLinerCharttData = (type:string) => {
   let  result: Record<string, number[]> = {};

  
    if (type === 'day30') {
        // 之前 30 天（5 月）的统计逻辑
        result = getMothData();
      } else if (type === 'day1') {
        // 前一天 0 到 24 时的统计逻辑
        result = getLastDayData();
      }

  return result;
};
 const getMothData= ()=> {
    const day30Result: Record<string, number[]> = {};
    const threatLevels = new Set(faultData.map(alert => alert.threatLevel));
    threatLevels.forEach(level => {
        day30Result[level] = new Array(31).fill(0);
    });

    for (const alert of faultData) {
        const { threatLevel, occurrence } = alert;
        const [year, month, dayStr] = occurrence.split(' ')[0].split('-');
        if (year === '2025' && month === '05') {
            const day = parseInt(dayStr, 10) - 1;
            if (day30Result[threatLevel]) {
                day30Result[threatLevel][day]++;
            }
        }
    }
    return day30Result;
    
}

const getLastDayData=()=> {
    const day1Result: Record<string, number[]> = {};
    const threatLevels = new Set(faultData.map(alert => alert.threatLevel));
    threatLevels.forEach(level => {
        day1Result[level] = new Array(24).fill(0);
    });

    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

    for (const alert of faultData) {
        const { threatLevel, occurrence } = alert;
        const alertDate = new Date(occurrence);
        if (alertDate >= yesterdayStart && alertDate <= yesterdayEnd) {
            const hour = alertDate.getHours();
            if (day1Result[threatLevel]) {
                day1Result[threatLevel][hour]++;
            }
        }
    }
    return day1Result;
}

