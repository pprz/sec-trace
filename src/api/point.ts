import type { TwoPointStat } from '@/types/twopoint';
import faultData from "./faultData.js";

// 颜色映射表，可根据需要添加更多颜色
const colorMap: Record<string, string> = {
  '攻击利用': '#ed3f35',
  '拒绝服务': '#eacf19',
  '恶意软件': '#eacf19',
  '可疑活动': '#eacf19',
  // 可添加更多 level1Type 对应的颜色
};

/**
 * 统计 faultData 中 level1Type 的种类及各自重复次数
 * @returns 包含统计结果的 TwoPointStat 数组
 */
export const getPointStats = (): TwoPointStat[] => {
  // 统计每个 level1Type 的出现次数
  const level1TypeCount: Record<string, number> = {};
  for (const item of faultData) {
    const level1Type = item.level1Type;
    level1TypeCount[level1Type] = (level1TypeCount[level1Type] || 0) + 1;
  }

  // 生成符合格式的结果数组
  return Object.entries(level1TypeCount).map(([label, value]) => ({
    value: value.toString(),
    label,
    color: colorMap[label] || '#eacf19' // 如果没有对应的颜色，使用默认颜色
  }));
};
