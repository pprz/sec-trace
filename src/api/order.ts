import type { OrderStatistic } from '@/types/order';

export const getOrderFilters = (): Record<string, string> => ({
  day365: '365天',
  day30: '30天',
  day1: '24小时',
});

// 新增：不同天数的模拟数据
export const orderStatisticsMap: Record<string, Record<string, OrderStatistic>> = {
  day365: {
    highRisk: { value: 203, label: '高危', color: 'red' },
    urgent: { value: 145, label: '危急', color: '#f67069ff' },
    mediumRisk: { value: 230, label: '中危', color: '#1950c4' },
    lowRisk: { value: 800, label: '低危', color: '#36be90' },
  },
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