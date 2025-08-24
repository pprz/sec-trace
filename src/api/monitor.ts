import type { MonitorData } from '@/types/monitor';
import faultData from './faultData.js';
export const getMonitorData = (): { tabs: string[]; data: MonitorData[] } => ({
  tabs: ['故障设备监控'],
  data: [
    {
      columns: ['发生时间', '受害IP', '攻击IP', '告警类型', '攻击结果', '操作'],
      rows: getRowData() as any,
    },

  ],
});

function getRowData(){
  const top20Data = faultData.slice(0, 20);
  // 将每条数据映射成指定格式的数组
  return top20Data.map((item) => [
    item.occurrence,
    item.assetIP,
    item.attackerIP,
    item.level1Type,
    item.attackResult,
    '查看'
  ]);
};