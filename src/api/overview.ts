import type { OverviewItem } from '@/types/overview';

export const getOverviewData = (): OverviewItem[] => [
  { value: '2,190', label: '高危', color: 'red', class: 'high-risk-gw' },
  { value: '190', label: '危急', color: '#f67069ff', class: 'high-risk-wj' },
  { value: '3,001', label: '中危', color: '#1950c4', class: 'high-risk-zw' },
  { value: '108', label: '低危', color: '#36be90', class: 'high-risk-dw' },
];