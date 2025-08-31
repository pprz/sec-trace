export interface OrderStatistic {
  value: number;
  label: string;
  color: string;
}

export interface OrderStatisticWithRatio extends OrderStatistic {
  ratio: number;
}

export type OrderStatisticsWithRatio = Record<
  'highRisk' | 'urgent' | 'mediumRisk' | 'lowRisk' | 'total',
  OrderStatisticWithRatio | number
>;