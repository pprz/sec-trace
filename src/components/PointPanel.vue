<template>
  <div class="point panel2">
    <div class="inner">
      <h3>一级告警类型统计</h3>
      <div class="chart">
        <!-- ECharts 图表容器 -->
        <div ref="chartRef" class="pie"></div>
        <div class="data">
          <div class="item" v-for="(stat, index) in pointStats" :key="index">
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
import { defineComponent, ref, onMounted } from "vue";
import * as echarts from "echarts";
import { getPointStats } from "@/api/point";
import type { PointStat } from "@/types/point";

export default defineComponent({
  name: "PointPanel",
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    const pointStats = ref<PointStat[]>([]);

    const initChart = () => {
      if (chartRef.value) {
        const chart = echarts.init(chartRef.value);

        // 准备图表数据
        const chartData = pointStats.value.map((stat) => ({
          value: parseFloat(stat.value.replace(",", "")), // 转换为数字
          name: stat.label,
        }));

        // 配置 ECharts 图表
        const option = {
          // 控制提示
          tooltip: {
            // 非轴图形，使用item的意思是放到数据对应图形上触发提示
            trigger: "item",
            // 格式化提示内容：
            // a 代表图表名称 b 代表数据名称 c 代表数据  d代表  当前数据/总数据的比例
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          // 控制图表
          series: [
            {
              // 图表名称
              name: "一级告警统计",
              // 图表类型
              type: "pie",
              // 南丁格尔玫瑰图 有两个圆  内圆半径10%  外圆半径70%
              // 百分比基于  图表DOM容器的半径
              radius: ["60%", "90%"],
              // 图表中心位置 left 50%  top 50% 距离图表DOM容器
              center: ["50%", "53%"],
              // 半径模式，另外一种是 area 面积模式
              // roseType: 'area',
              // 数据集 value 数据的值 name 数据的名称
              data: chartData,
              //文字调整
              label: {
                fontSize: 12,
                rotate: 0, // 设置文字水平显示
                alignTo: "labelLine", // 对齐到引导线
                position: "outside", // 显示在饼图外部
              },
              //引导线
              labelLine: {
                length: 8,
                length2: 10,
              },
            },
          ],
          color: [
            "#006cff",
            "#60cda0",
            "#ed8884",
            "#ff9f7f",
            "#0096ff",
            "#9fe6b8",
            "#32c5e9",
            "#1d9dff",
          ],
          // 调整 grid 配置，控制图表边距
          grid: {
            left: "0%",
            right: "5%",
            bottom: "25%",
            top: "0%",
            containLabel: true,
          },
        };

        // 设置图表配置
        chart.setOption(option);

        // 响应式调整图表大小
        window.addEventListener("resize", () => {
          chart.resize();
        });
      }
    };

    onMounted(() => {
      pointStats.value = getPointStats();
      initChart();
    });

    return {
      chartRef,
      pointStats,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for PointPanel here */

.point.panel2 {
  height: 48.6%; /* 根据实际需求调整 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
