import type { QuarterStat } from '@/types/quarter';

export const getQuarterStats = (): { progress: number; stats: QuarterStat[] } => ({
  progress: 75,
  stats: [
    { value: '1,321', label: '销售额(万元)', color: '#6acca3' },
    { value: '150%', label: '同比增长', color: '#ed3f35' },
  ],
});