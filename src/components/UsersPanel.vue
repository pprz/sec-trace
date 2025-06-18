<template>
  <div class="users panel">
    <div class="inner">
      <h3>全国用户总量统计</h3>
      <div class="chart">
        <!-- ECharts 图表容器 -->
        <div ref="chartRef" class="bar"></div>
        <div class="data">
          <div class="item" v-for="(stat, index) in userStats" :key="index">
            <h4>{{ stat.value }}</h4>
            <span>
              <i class="icon-dot" :style="{ color: stat.color }"></i>
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { getUserStats } from '@/api/users';
import type { UserStat } from '@/types/users';

export default defineComponent({
  name: 'UsersPanel',
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    const userStats = ref<UserStat[]>([]);

    const initChart = () => {
      if (chartRef.value) {
        const chart = echarts.init(chartRef.value);

        // 配置 ECharts 图表数据和样式
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: ['上海', '广州', '北京', '深圳', '合肥', '杭州', '厦门', '济南', '成都', '重庆'],
            axisLine: {
              lineStyle: {
                color: '#4c9bfd',
              },
            },
            axisLabel: {
              color: '#fff',
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#4c9bfd',
              },
            },
            axisLabel: {
              color: '#fff',
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
          series: [
            {
              name: '用户总量',
              type: 'bar',
              barWidth: '60%',
              data: [2000, 1800, 1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00c9ff' },
                  { offset: 1, color: '#005fc1' },
                ]),
              },
            },
          ],
        };

        // 设置图表配置
        chart.setOption(option);

        // 响应式调整图表大小
        window.addEventListener('resize', () => {
          chart.resize();
        });
      }
    };

    onMounted(() => {
      userStats.value = getUserStats();
      initChart();
    });

    return {
      chartRef,
      userStats,
    };
  },
});
</script>

<style scoped>
.bar {
  width: 100%;
  height: 12rem; /* 设置图表高度 */
}
</style>