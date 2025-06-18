import type { TwoPointStat } from '@/types/twopoint';

export const getPointStats = (): TwoPointStat[] => [
  { value: '320,11', label: '攻击利用', color: '#ed3f35' },
  { value: '418', label: '拒绝服务', color: '#eacf19' },
  { value: '320', label: '恶意软件', color: '#eacf19' },
  { value: '280', label: '可疑活动', color: '#eacf19' },
];