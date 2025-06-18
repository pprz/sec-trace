<!-- filepath: d:\Code\workspace_ruoyi\sec-trace\src\components\TwoPointPanel.vue -->
<template>
  <div class="point2 panel2">
    <div class="inner">
      <h3>二级告警类型统计</h3>
      <div class="chart">
        <!-- ECharts 图表容器 -->
        <div ref="chartRef" class="bar-chart"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'TwoPointPanel',
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null);
    let myChart: echarts.ECharts | null = null;

    // 模拟数据：告警类型及对应数值（转为数字）
    const plantCap = [
      { name: '代理工具', value: 222 },
      { name: 'SQL注入', value: 115 },
      { name: '代码执行', value: 113 },
      { name: '溢出攻击', value: 95 },
      { name: '信息泄露', value: 92 },
      { name: '命令执行', value: 87 },
      { name: 'webshell利用', value: 50 },
      { name: '网络蠕虫', value: 34 },
    ];
    
    const initChart = () => {
      if (chartRef.value) {
        myChart = echarts.init(chartRef.value);
        
        // 提取柱状图的类目和数值
        const categories = plantCap.map(item => item.name);
        const dataValues = plantCap.map(item => item.value);
        
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLine: {
              lineStyle: {
                color: '#4c9bfd'
              }
            },
            axisLabel: {
              color: '#fff',
              interval: 0,
              rotate: 30
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#4c9bfd'
              }
            },
            axisLabel: {
              color: '#fff'
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '20%',
            top: '15%'
          },
          series: [
            {
              name: '告警数量',
              type: 'bar',
              data: dataValues,
              itemStyle: {
                color: '#017af2'
              },
              barMaxWidth: '30%',
              label: {
                show: true,
                position: 'top',
                color: '#fff'
              }
            }
          ]
        };

        myChart.setOption(option);
        
        // 响应式调整图表大小
        window.addEventListener('resize', resizeChart);
      }
    };

    const resizeChart = () => {
      if (myChart) {
        myChart.resize();
      }
    };

    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', resizeChart);
      myChart?.dispose();
    });

    return {
      chartRef,
    };
  },
});
</script>

<style scoped>
.point2.panel2 {
  height: 48.6%; /* 根据实际需求调整 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.inner {
  padding-left: 2.5rem !important;
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
</style>