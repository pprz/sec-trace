import type { MonitorData } from '@/types/monitor';
import type { OrderStatistic } from '@/types/order';
import type { TopItem } from '@/types/top';
import type { TwoPointStat } from '@/types/twopoint';
import { reactive, readonly } from 'vue';

// 定义FaultLog接口
export interface FaultLog {
  id?: string;
  occurrence: string;
  assetIP: string;
  attackerIP: string;
  level1Type: string;
  level2Type: string;
  attackResult: string;
  threatLevel: string;
  threatName: string;
  payload?: string;
  requestHeader?: string;
  responseHeader?: string;
  responseBody?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 定义状态接口
interface GlobalState {
  faultLogs: FaultLog[];
  loading: boolean;
  error: string | null;
}

// 创建响应式状态
const state = reactive<GlobalState>({
  faultLogs: [],
  loading: false,
  error: null
});

// 定义操作状态的方法
const mutations = {
  /**
   * 设置故障日志列表
   * @param faultLogs 故障日志数组
   */
  setFaultLogs(faultLogs: FaultLog[]) {
    state.faultLogs = faultLogs;
  },

  /**
   * 设置加载状态
   * @param loading 是否正在加载
   */
  setLoading(loading: boolean) {
    state.loading = loading;
  },

  /**
   * 设置错误信息
   * @param error 错误信息，可以为null表示无错误
   */
  setError(error: string | null) {
    state.error = error;
  },

  /**
   * 添加新的故障日志
   * @param faultLog 要添加的故障日志
   */
  addFaultLog(faultLog: FaultLog) {
    state.faultLogs.push(faultLog);
  },

  /**
   * 更新指定ID的故障日志
   * @param id 要更新的日志ID
   * @param updatedFaultLog 更新的日志部分数据
   */
  updateFaultLog(id: string, updatedFaultLog: Partial<FaultLog>) {
    const index = state.faultLogs.findIndex((log: FaultLog) => log.id === id);
    if (index !== -1) {
      state.faultLogs[index] = { ...state.faultLogs[index], ...updatedFaultLog };
    }
  },

  /**
   * 删除指定ID的故障日志
   * @param id 要删除的日志ID
   */
  removeFaultLog(id: string) {
    const index = state.faultLogs.findIndex((log: FaultLog) => log.id === id);
    if (index !== -1) {
      state.faultLogs.splice(index, 1);
    }
  }
};

// 定义读取状态的方法
const getters = {
  /**
   * 获取所有故障日志
   * @returns 故障日志数组
   */
  getFaultLogs(): FaultLog[] {
    return state.faultLogs;
  },

  /**
   * 根据ID获取故障日志
   * @param id 日志ID
   * @returns 匹配的故障日志或undefined
   */
  getFaultLogById(id: string): FaultLog | undefined {
    return state.faultLogs.find(log => log.id === id);
  },

  /**
   * 根据攻击者IP获取故障日志
   * @param attackerIP 攻击者IP地址
   * @returns 匹配的故障日志数组
   */
  getFaultLogsByAttackerIP(attackerIP: string): FaultLog[] {
    return state.faultLogs.filter(log => log.attackerIP === attackerIP);
  },

  /**
   * 根据受害IP获取故障日志
   * @param assetIP 受害者IP地址
   * @returns 匹配的故障日志数组
   */
  getFaultLogsByAssetIP(assetIP: string): FaultLog[] {
    return state.faultLogs.filter(log => log.assetIP === assetIP);
  },

  /**
   * 根据威胁等级获取故障日志
   * @param threatLevel 威胁等级
   * @returns 匹配的故障日志数组
   */
  getFaultLogsByThreatLevel(threatLevel: string): FaultLog[] {
    return state.faultLogs.filter(log => log.threatLevel === threatLevel);
  },

  /**
   * 获取当前加载状态
   * @returns 是否正在加载数据
   */
  isLoading(): boolean {
    return state.loading;
  },

  /**
   * 获取当前错误信息
   * @returns 错误信息或null
   */
  getError(): string | null {
    return state.error;
  },

  /**
   * 获取30天数据统计
   * @returns 以威胁等级为键，每日计数数组为值的对象
   */
  getMothData() {
    const day30Result: Record<string, number[]> = {};
    if (state.faultLogs.length === 0) {
      console.log("No fault logs available");
      return day30Result;
    }

    const threatLevels = new Set(state.faultLogs.map(alert => alert.threatLevel));
    threatLevels.forEach(level => {
      day30Result[level] = new Array(31).fill(0);
    });

    for (const alert of state.faultLogs) {
      const { threatLevel, occurrence } = alert;
      const [year, month, dayStr] = occurrence.split(' ')[0].split('-');
      if (year === '2025' && month === '10') {
        const day = parseInt(dayStr, 10) - 1;
        if (day30Result[threatLevel]) {
          day30Result[threatLevel][day]++;
        }
      }
    }
    return day30Result;
  },

  /**
   * 获取前一天数据统计
   * @returns 以威胁等级为键，每小时计数数组为值的对象
   */
  getLastDayData() {
    const day1Result: Record<string, number[]> = {};
    if (state.faultLogs.length === 0) {
      console.log("No fault logs available");
      return day1Result;
    }

    const threatLevels = new Set(state.faultLogs.map(alert => alert.threatLevel));
    threatLevels.forEach(level => {
      day1Result[level] = new Array(24).fill(0);
    });

    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    // const yesterday = new Date('2025-05-31');
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);


    for (const alert of state.faultLogs) {
      const { threatLevel, occurrence } = alert;
      const alertDate = new Date(occurrence);
      if (alertDate >= yesterdayStart && alertDate <= yesterdayEnd) {
        const hour = alertDate.getHours();
        if (day1Result[threatLevel]) {
          day1Result[threatLevel][hour]++;
        }
      }
    }
    return day1Result;
  },

  /**
   * 获取折线图数据
   * @param type 数据类型: 'day30'表示30天数据, 'day1'表示1天数据
   * @returns 以威胁等级为键，计数数组为值的对象
   */
  getLinerCharttData(type: string) {
    let result: Record<string, number[]> = {};

    if (type === 'day30') {
      // 之前 30 天（5 月）的统计逻辑
      result = this.getMothData();
    } else if (type === 'day1') {
      // 前一天 0 到 24 时的统计逻辑
      result = this.getLastDayData();
    }
    return result;
  },

  /**
   * 获取订单统计信息
   * @param type 统计类型: 'day30'表示统计5月所有数据, 'day1'表示统计5月31日数据
   * @returns 包含各威胁等级统计信息的对象
   */
  getOrderStatistics(type: string): Record<string, OrderStatistic> {
    const result: Record<string, OrderStatistic> = {
      highRisk: { value: 0, label: '高危', color: 'red' },
      urgent: { value: 0, label: '危急', color: '#f67069ff' },
      mediumRisk: { value: 0, label: '中危', color: '#1950c4' },
      lowRisk: { value: 0, label: '低危', color: '#36be90' },
    };

    if (type === 'day30') {
      for (const alert of state.faultLogs) {
        const { threatLevel, occurrence } = alert;
        const [year, month] = occurrence.split(' ')[0].split('-');
        if (year === '2025' && month === '10') {
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
      // const now = new Date('2025-06-01');
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

      for (const alert of state.faultLogs) {
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
  },

  /**
   * 根据传入参数'day30'或'day1'返回威胁等级统计和占比
   * @param type 统计类型: 'day30'表示统计5月所有数据, 'day1'表示统计5月31日数据
   * @returns 包含各威胁等级数量和占比的对象
   */
  getOrderStatisticsWithRatio(type: string) {
    // 先获取基础统计数据
    const stats = this.getOrderStatistics(type);

    // 计算总数
    const total = Object.values(stats).reduce((sum, stat) => sum + stat.value, 0);

    // 构造包含占比的结果
    const result: Record<string, OrderStatistic & { ratio: number }> = {};

    for (const [key, stat] of Object.entries(stats)) {
      result[key] = {
        ...stat,
        ratio: total > 0 ? Number(((stat.value / total) * 100).toFixed()) : 0
      };
    }

    return { ...result, total };
  },

  /**
   * 获取监控数据
   * @returns 包含标签页和数据的监控对象
   */
  getMonitorData(): { tabs: string[]; data: MonitorData[] } {
    return {
      tabs: ['故障设备监控'],
      data: [
        {
          columns: ['发生时间', '受害IP', '攻击IP', '告警类型', '攻击结果', '操作'],
          rows: this.getRowData() as any,
        },

      ],
    }
  },

  /**
   * 获取行数据
   * @returns 前20条故障日志的表格行数据
   */
  getRowData() {
    const top20Data = state.faultLogs.slice(0, 20);
    // 将每条数据映射成指定格式的数组
    return top20Data.map((item) => [
      item.occurrence,
      item.assetIP,
      item.attackerIP,
      item.level1Type,
      item.attackResult,
      '查看'
    ]);
  },
  getFaultLogToP20() {
    const top20Data = state.faultLogs.slice(0, 20);
    // 将每条数据映射成指定格式的数组
    return top20Data;
  },

  /**
   * 统计 faultData 中 assetIP 重复次数的前五名
   * @returns 包含前五名 assetIP 信息的 TopItem 数组
   */
  getTopItems(type: string = 'day30'): TopItem[] {
    // 统计每个 assetIP 的出现次数
    const ipCountMap: Record<string, number> = {};

    // 根据 type 参数筛选数据
    const filteredLogs = state.faultLogs.filter(item => {
      if (type === 'day30') {
        // day30: 统计所有数据（5月数据）
        const [year, month] = item.occurrence.split(' ')[0].split('-');
        return year === '2025' && month === '10';
      } else if (type === 'day1') {
        // day1: 统计 2025年5月31日 的数据
        const [date] = item.occurrence.split(' ');
        return date === '2025-10-28';
      }
      return false;
    });

    for (const item of filteredLogs) {
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
  },
  getPointStats(type: string = 'day30'): TwoPointStat[] {
    // 统计每个 level1Type 的出现次数
    const colorMap: Record<string, string> = {
      '攻击利用': '#ed3f35',
      '拒绝服务': '#eacf19',
      '恶意软件': '#eacf19',
      '可疑活动': '#eacf19',
      // 可添加更多 level1Type 对应的颜色
    };

    const level1TypeCount: Record<string, number> = {};

    // 根据 type 参数筛选数据
    const filteredLogs = state.faultLogs.filter(item => {
      if (type === 'day30') {
        // day30: 统计所有数据（5月数据）
        const [year, month] = item.occurrence.split(' ')[0].split('-');
        return year === '2025' && month === '10';
      } else if (type === 'day1') {
        // day1: 统计 2025年5月31日 的数据
        const [date] = item.occurrence.split(' ');
        return date === '2025-10-28';
      }
      return false;
    });

    for (const item of filteredLogs) {
      const level1Type = item.level1Type;
      level1TypeCount[level1Type] = (level1TypeCount[level1Type] || 0) + 1;
    }

    // 生成符合格式的结果数组
    return Object.entries(level1TypeCount).map(([label, value]) => ({
      value: value.toString(),
      label,
      color: colorMap[label] || '#eacf19' // 如果没有对应的颜色，使用默认颜色
    }));
  },
  getLevel2TypeStats(type: string = 'day30'): { name: string; value: number }[] {
    // 用于存储每个 level2Type 的出现次数
    const level2TypeCount: Record<string, number> = {};
    const filteredLogs = state.faultLogs.filter(item => {
      if (type === 'day30') {
        // day30: 统计所有数据（5月数据）
        const [year, month] = item.occurrence.split(' ')[0].split('-');
        return year === '2025' && month === '10';
      } else if (type === 'day1') {
        // day1: 统计 2025年5月31日 的数据
        const [date] = item.occurrence.split(' ');
        return date === '2025-10-28';
      }
      return false;
    });

    // 遍历 faultData 统计 level2Type 出现次数
    for (const item of filteredLogs) {
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
  },

  /**
   * 根据过滤条件获取故障日志
   * @param filter 过滤条件对象
   * @returns 符合条件的故障日志数组
   */
  getFaultLogsByFilter(filter: {
    type: string,
    threatLevel?: string,
    level1Type?: string,
    level2Type?: string,
    assetIP?: string
  }): FaultLog[] {
    // 根据type参数筛选基础数据集
    let filteredLogs = state.faultLogs;

    // 处理时间范围筛选
    if (filter.type === 'day30') {
      // day30: 筛选2025年5月的所有数据
      filteredLogs = state.faultLogs.filter(log => {
        const [year, month] = log.occurrence.split(' ')[0].split('-');
        return year === '2025' && month === '10';
      });
    } else if (filter.type === 'day1') {
      // day1: 筛选2025年5月31日的数据
      filteredLogs = state.faultLogs.filter(log => {
        const [date] = log.occurrence.split(' ');
        return date === '2025-10-28';
      });
    }

    // 应用其他过滤条件
    if (filter.threatLevel) {
      filteredLogs = filteredLogs.filter(log =>
        log.threatLevel === filter.threatLevel
      );
    }

    if (filter.level1Type) {
      filteredLogs = filteredLogs.filter(log =>
        log.level1Type === filter.level1Type
      );
    }

    if (filter.level2Type) {
      filteredLogs = filteredLogs.filter(log =>
        log.level2Type === filter.level2Type
      );
    }

    if (filter.assetIP) {
      filteredLogs = filteredLogs.filter(log =>
        log.assetIP === filter.assetIP
      );
    }

    return filteredLogs;
  },

};

// 创建全局状态管理对象
const store = {
  state: readonly(state),
  ...mutations,
  ...getters
};

export default store;