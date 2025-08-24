<template>
  <div class="sales panel">
    <div class="inner">
      <div class="chart">
        <div class="label">单位: 次数</div>
        <div ref="chartRef" class="line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { eventBus } from "@/utils/eventBus";
import { getLinerCharttData } from '@/api/fault';

export default defineComponent({
  name: "SalesPanel",
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    let chart: echarts.ECharts | null = null;

      // 生成时间数据
    const generateTimeData = (type: string) => {
      const data = [];

      if (type === "day30") {
        // 生成近30天的日期
        for (let i = 30; i >= 0; i--) {
          const date = new Date(new Date('2025-5-31').getTime() - i * 24 * 60 * 60 * 1000);
          data.push(date.getMonth() + 1 + "-" + date.getDate());
        }
      } else {
        // 24小时
        for (let i = 0; i < 12; i++) {
          data.push(String(i * 2).padStart(2, "0") + ":00");
        }
      }
      return data;
    };

    // 更新图表
    const updateChart = (type: string) => {
      if (!chart) return;

      const xAxisData = generateTimeData(type);
      const option = {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            name: "高危",
            data: getLinerCharttData(type)["高危"],
          },
          {
            name: "危急",
            data: getLinerCharttData(type)["危急"],
          },
          {
            name: "中危",
            data: getLinerCharttData(type)["中危"],
          },
          {
            name: "低危",
            data: getLinerCharttData(type)["低危"],
          },
        ],
      };

      chart.setOption(option);
    };

    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) return;

      chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
        legend: {
          top: "5%",
          textStyle: {
            color: "#fff",
          },
          data: ["高危", "危急", "中危", "低危"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#4c9bfd",
            },
          },
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#4c9bfd",
            },
          },
          axisLabel: {
            color: "#fff",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
        series: [
          {
            name: "高危",
            type: "line",
            smooth: true,
            lineStyle: { color: "#ed3f35" },
            itemStyle: { color: "#ed3f35" },
          },
          {
            name: "危急",
            type: "line",
            smooth: true,
            lineStyle: { color: "#f67069" },
            itemStyle: { color: "#f67069" },
          },
          {
            name: "中危",
            type: "line",
            smooth: true,
            lineStyle: { color: "#1950c4" },
            itemStyle: { color: "#1950c4" },
          },
          {
            name: "低危",
            type: "line",
            smooth: true,
            lineStyle: { color: "#36be90" },
            itemStyle: { color: "#36be90" },
          },
        ],
      };

      chart.setOption(option);
      // 默认显示24小时数据
      updateChart("day30");
    };

    onMounted(() => {
      initChart();
      // 监听过滤器改变事件
      //eventBus.on('filterChange', (type: string) => {
      //  updateChart(type);
      //});

      eventBus.on("filterChange", (event) => {
        // event 类型是 unknown，需断言
        const type = event as string;
        console.log("🚀 ~ eventBus.on ~ type:", type)
        updateChart(type);
        // ...你的逻辑
      });
    });

    onUnmounted(() => {
      // 清理事件监听
      eventBus.off("filterChange");
      chart?.dispose();
    });

    return {
      chartRef,
    };
  },
});
</script>

<style scoped>
.line {
  width: 100%;
  height: 12rem;
}
</style>
