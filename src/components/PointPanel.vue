<template>
  <div class="point panel2">
    <div class="inner" style="width: 90%">
      <div class="header">
        <h3>一级告警类型统计</h3>
        <t-date-range-picker
          v-model="selectedDate"
          :options="datePickerOptions"
          @change="handleDateChange"
          clearable
          class="transparent-date-picker"
		  :disableDate="{
		    before: '2025-08-01',
		    after: '2025-10-28',
		  }"
        />
      </div>
      <div class="chart">
        <!-- ECharts 图表容器 -->
        <div ref="chartRef" class="pie"></div>
        <!-- 新增：图列显示区域 -->
        <div class="legend">
          <div class="legend-item" v-for="(stat, index) in pointStats" :key="index">
            <span class="legend-color" :style="{ backgroundColor: stat.color }"></span>
            <span class="legend-label">{{ stat.label }}</span>
            <span class="legend-value">{{ stat.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <FaultDialog
      v-if="dialogVisible"
      :filter="{ type, level1Type, selectedDate}"
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
    const selectedDate = ref([]);
    const datePickerOptions = {
      disableDate: (date: Date) => date > new Date(),
    };
    // 新增：标识当前是否选择了特定日期

    const handleDateChange = (date: string[]) => {
      if (!date.length) {
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
                show: false, // 关闭标签显示
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
		type.value   = event as string;
      });
    });

    const showDialog = (value: string) => {
      dialogVisible.value = true;
      level1Type.value = value;
    };

    watchEffect(() => {
      pointStats.value = store.getPointStats(
        type.value,
        selectedDate.value 
      ).filter(item=>!!item.label);
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

.transparent-date-picker {
  /* background-color: #00bcd4; */
  color: #ffffff; /* 输入文字颜色 */
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}


/* 新增：图列样式 */
.legend {
  margin-top: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  color: #e0e0e0;
  font-size: 13px;
  white-space: nowrap;
}

.legend-value {
  color: #aaa;
  font-size: 13px;
  margin-left: auto;
}
.header .t-date-range-picker {
  width: 230px;
  flex-shrink: 0;
}

:deep(.t-input__inner::placeholder){
	font-size: 14px !important;
}
</style>
