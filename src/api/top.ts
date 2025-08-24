import type { TopItem, Province } from '@/types/top';
import faultData from "./faultData.js";


/**
 * 统计 faultData 中 assetIP 重复次数的前五名
 * @returns 包含前五名 assetIP 信息的 TopItem 数组
 */
 export const getTopItems = (): TopItem[] => {
  // 统计每个 assetIP 的出现次数
  const ipCountMap: Record<string, number> = {};
  for (const item of faultData) {
    const assetIP = item.assetIP;
    ipCountMap[assetIP] = (ipCountMap[assetIP] || 0) + 1;
  }

  // 将统计结果转换为数组并按出现次数降序排序
  const sortedIPs = Object.entries(ipCountMap).sort((a, b) => b[1] - a[1]);

  // 取前五名
  const topFiveIPs = sortedIPs.slice(0, 5);

  // 计算最大出现次数，用于计算宽度百分比
  const maxCount = topFiveIPs.length > 0 ? topFiveIPs[0][1] : 1;

  // 生成符合格式的结果数组
  return topFiveIPs.map(([ip, count], index) => ({
    id: index + 1,
    rank: index + 1,
    title: ip,
    width: `${(count / maxCount * 100).toFixed(0)}%`,
    value: count
  }));
};

export const getProvinces = (): Province[] => [
  { name: '192.168.130.2', sales: '25,179', trend: 'icon-up' },
  { name: '10.14.5.168', sales: '23,252', trend: 'icon-down' },
  { name: '192.168.140.167', sales: '20,760', trend: 'icon-up' },
  { name: '111.7.100.66', sales: '23,252', trend: 'icon-down' },
  { name: '112.7.156.68', sales: '20,760', trend: 'icon-up' },
];