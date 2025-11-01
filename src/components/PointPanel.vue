<template>
  <div class="point panel2">
    <div class="inner" style="width: 90%">
      <div class="header">
        <h3>一级告警类型统计</h3>
        <t-date-picker
          v-model="selectedDate"
          :options="datePickerOptions"
          @change="handleDateChange"
          clearable
        />
      </div>
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
    <FaultDialog
      v-if="dialogVisible"
      :filter="{ type, level1Type, selectedDate }"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import * as echarts from "echarts";
import type { PointStat } from "@/types/point";
import store from "@/utils/store";
import { eventBus } from "@/utils/eventBus";
import FaultDialog from "./dialog/FaultDialog.vue";

export default defineComponent({
  name: "PointPanel",
  components: { FaultDialog },
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    const pointStats = ref<PointStat[]>([]);
    const type = ref("day30");
    const globalType = ref("day30");
    const level1Type = ref("");
    const dialogVisible = ref(false);
    const selectedDate = ref();
    const datePickerOptions = {
      disableDate: (date: Date) => date > new Date(),
    };
    // 新增：标识当前是否选择了特定日期

    const handleDateChange = (date: string | null) => {
      if (!date) {
        type.value = globalType.value;
      } else {
        type.value = "byDay";
      }
    };

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
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          // 控制图表
          series: [
            {
              name: "一级告警统计",
              type: "pie",
              radius: ["60%", "90%"],
              center: ["50%", "53%"],
              data: chartData,
              label: {
                fontSize: 14,
                rotate: 0,
                alignTo: "labelLine",
                position: "outside",
              },
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
          grid: {
            left: "0%",
            right: "5%",
            bottom: "25%",
            top: "0%",
            containLabel: true,
          },
        };

        chart.setOption(option);
        chart.on("click", (params) => {
          const dataItem = params?.data as { name?: string };
          showDialog(dataItem?.name || "");
        });

        window.addEventListener("resize", () => {
          chart.resize();
        });
      }
    };

    onMounted(() => {
      eventBus.on("filterChange", (event) => {
        globalType.value = event as string;
      });
    });

    const showDialog = (value: string) => {
      dialogVisible.value = true;
      level1Type.value = value;
    };

    watchEffect(() => {
      pointStats.value = store.getPointStats(
        type.value,
        selectedDate.value as any
      );
      initChart();
    });

    return {
      chartRef,
      pointStats,
      type,
      level1Type,
      dialogVisible,
      selectedDate,
      datePickerOptions,
      handleDateChange,
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  width: 100%;
}

.header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.header .t-date-picker {
  width: 180px;
  flex-shrink: 0;
}
</style>
