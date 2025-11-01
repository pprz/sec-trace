<!-- filepath: d:\Code\workspace_ruoyi\sec-trace\src\components\TwoPointPanel.vue -->
<template>
  <div class="point2 panel2">
    <div class="inner">
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
        <div ref="chartRef" class="bar-chart"></div>
      </div>
    </div>
    <FaultDialog
      v-if="dialogVisible"
      :filter="{ type, level2Type, selectedDate }"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watchEffect } from "vue";
import * as echarts from "echarts";
import { eventBus } from "@/utils/eventBus";
import store from "@/utils/store";
import FaultDialog from "./dialog/FaultDialog.vue";
export default defineComponent({
  name: "TwoPointPanel",
  components: { FaultDialog },
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    let myChart: echarts.ECharts | null = null;
    const type = ref("day30");
    const level2Type = ref("");
    const dialogVisible = ref(false);
    const selectedDate = ref();
    const globalType = ref("day30");
    const datePickerOptions = {
      disableDate: (date: Date) => date > new Date(),
    };
    const plantCap = ref<{ name: string; value: number }[]>([]);

    const initChart = () => {
      if (chartRef.value) {
        myChart = echarts.init(chartRef.value);

        // 提取柱状图的类目和数值
        const categories = plantCap.value.map((item) => item.name);
        const dataValues = plantCap.value.map((item) => item.value);

        const option = {
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: categories,
            axisLine: {
              lineStyle: {
                color: "#4c9bfd",
              },
            },
            axisLabel: {
              color: "#fff",
              interval: 0,
              rotate: 30,
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
                color: "rgba(255,255,255,0.1)",
              },
            },
          },
          grid: {
            left: "10%",
            right: "0",
            bottom: "15%",
            top: "5%",
          },
          series: [
            {
              name: "告警数量",
              type: "bar",
              data: dataValues,
              itemStyle: {
                color: "#017af2",
              },
              barMaxWidth: "30%",
              label: {
                show: true,
                position: "top",
                color: "#fff",
              },
            },
          ],
        };

        myChart.setOption(option);
        myChart.on("click", (params) => {
          // 修正类型断言为包含name属性的对象类型
          const dataItem = params as { name?: string };
          showDialog(dataItem?.name || "");
        });

        // 响应式调整图表大小
        window.addEventListener("resize", resizeChart);
      }
    };

    const resizeChart = () => {
      if (myChart) {
        myChart.resize();
      }
    };

    const handleDateChange = (date: string | null) => {
      if (!date) {
        type.value = globalType.value;
      } else {
        type.value = "byDay";
      }
    };

    onMounted(() => {
      eventBus.on("filterChange", (event) => {
        // event 类型是 unknown，需断言
        type.value = event as string;
      });
    });
    const showDialog = (value: string) => {
      dialogVisible.value = true;
      level2Type.value = value;
    };

    watchEffect(() => {
      plantCap.value = store.getLevel2TypeStats(
        type.value,
        selectedDate.value as any
      );
      initChart();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeChart);
      myChart?.dispose();
    });

    return {
      chartRef,
      type,
      level2Type,
      dialogVisible,
      selectedDate,
      datePickerOptions,
      handleDateChange,
    };
  },
});
</script>

<style scoped>
.point2.panel2 {
  height: 48.6%; /* 根据实际需求调整 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.inner {
  /* padding-left: 2.5rem !important; */
  color: #fff;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}
.chart {
  margin-top: 1rem;
}
.bar-chart {
  width: 100%;
  height: 20rem;
}
h3 {
  margin: 0;
  font-size: 1.2rem;
  /*text-align: center;*/
  color: #fff;
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
