import type { OrderStatistic } from '@/types/order';
import faultData from "./faultData.js";
export const getOrderFilters = (): Record<string, string> => ({
  day30: '30天',
  day1: '24小时',
});

// 新增：不同天数的模拟数据
export const orderStatisticsMap: Record<string, Record<string, OrderStatistic>> = {
  day30: {
    highRisk: { value: 50, label: '高危', color: 'red' },
    urgent: { value: 30, label: '危急', color: '#f67069ff' },
    mediumRisk: { value: 40, label: '中危', color: '#1950c4' },
    lowRisk: { value: 150, label: '低危', color: '#36be90' },
  },
  day1: {
    highRisk: { value: 5, label: '高危', color: 'red' },
    urgent: { value: 2, label: '危急', color: '#f67069ff' },
    mediumRisk: { value: 3, label: '中危', color: '#1950c4' },
    lowRisk: { value: 10, label: '低危', color: '#36be90' },
  },
};

/**
 * 根据传入的类型参数统计不同风险级别的出现次数
 * @param type 统计类型，支持 'day30' 和 'day1'
 * @returns 包含不同风险级别统计结果的对象
 */
 export const getOrderStatistics = (type: string): Record<string, OrderStatistic> => {
  const result: Record<string, OrderStatistic> = {
    highRisk: { value: 0, label: '高危', color: 'red' },
    urgent: { value: 0, label: '危急', color: '#f67069ff' },
    mediumRisk: { value: 0, label: '中危', color: '#1950c4' },
    lowRisk: { value: 0, label: '低危', color: '#36be90' },
  };

  if (type === 'day30') {
    for (const alert of faultData) {
      const { threatLevel, occurrence } = alert;
      const [year, month] = occurrence.split(' ')[0].split('-');
      if (year === '2025' && month === '05') {
        switch (threatLevel) {
          case '高危':
            result.highRisk.value++;
            break;
          case '危急':
            result.urgent.value++;
            break;
          case '中危':
            result.mediumRisk.value++;
            break;
          case '低危':
            result.lowRisk.value++;
            break;
        }
      }
    }
  } else if (type === 'day1') {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

    for (const alert of faultData) {
      const { threatLevel, occurrence } = alert;
      const alertDate = new Date(occurrence);
      if (alertDate >= yesterdayStart && alertDate <= yesterdayEnd) {
        switch (threatLevel) {
          case '高危':
            result.highRisk.value++;
            break;
          case '危急':
            result.urgent.value++;
            break;
          case '中危':
            result.mediumRisk.value++;
            break;
          case '低危':
            result.lowRisk.value++;
            break;
        }
      }
    }
  }

  return result;
};