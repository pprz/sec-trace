import type { TwoPointStat } from '@/types/twopoint';
import faultData from './faultData';

export const getPointStats = (): TwoPointStat[] => [
  { value: '320,11', label: '攻击利用', color: '#ed3f35' },
  { value: '418', label: '拒绝服务', color: '#eacf19' },
  { value: '320', label: '恶意软件', color: '#eacf19' },
  { value: '280', label: '可疑活动', color: '#eacf19' },
];

/**
 * 统计 faultData 中 level2Type 的种类及各自重复次数
 * @returns 包含统计结果的对象数组
 */
 export const getLevel2TypeStats = (): { name: string; value: number }[] => {
  // 用于存储每个 level2Type 的出现次数
  const level2TypeCount: Record<string, number> = {};

  // 遍历 faultData 统计 level2Type 出现次数
  for (const item of faultData) {
    const level2Type = item.level2Type;
    if (level2Type) {
      level2TypeCount[level2Type] = (level2TypeCount[level2Type] || 0) + 1;
    }
  }


  // 将统计结果转换为数组并按出现次数降序排序
  const sortedStats = Object.entries(level2TypeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 取前七个结果
  return sortedStats.slice(0, 7);
};