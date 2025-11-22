<template>
  <div class="optimization">
    <h2>调参对模型指标优化效果</h2>
    <div class="charts">
      <div id="f1-chart" class="chart"></div>
      <div id="cosine-chart" class="chart"></div>
      <div id="silhouette-chart" class="chart"></div>
      <div id="recall-chart" class="chart"></div>
      <div id="norm-chart" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as echarts from "echarts";

onMounted(() => {
  // F1 Score 图表
  const f1Chart = echarts.init(document.getElementById("f1-chart")!);
  f1Chart.setOption({
    title: { text: "F1分数与批量大小及学习率的关系" },
    tooltip: { trigger: "axis" },
    legend: { data: ["F1 Score"] },
    xAxis: {
      type: "category",
      data: ["32", "64", "128"],
      name: "Batch Size",
    },
    yAxis: {
      type: "value",
      min: 0.7,
      max: 1.0,
      name: "Score (0-1)",
    },
    series: [
      {
        name: "F1 Score",
        type: "line",
        data: [0.85, 0.88, 0.91],
        smooth: true,
      },
    ],
  });

  // Cosine 相似度图表
  const cosineChart = echarts.init(document.getElementById("cosine-chart")!);
  cosineChart.setOption({
    title: { text: "余弦相似度与温度的关系" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Cosine Similarity"] },
    xAxis: {
      type: "category",
      data: ["0.01", "0.1", "0.5", "1.0"],
      name: "Temperature",
    },
    yAxis: {
      type: "value",
      min: 0.7,
      max: 1.0,
      name: "Similarity (0-1)",
    },
    series: [
      {
        name: "Cosine Similarity",
        type: "line",
        data: [0.82, 0.86, 0.89, 0.87],
        smooth: true,
      },
    ],
  });

  // Silhouette Score 图表
  const silhouetteChart = echarts.init(
    document.getElementById("silhouette-chart")!
  );
  silhouetteChart.setOption({
    title: { text: "轮廓分数与嵌入维度的关系" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Silhouette Score"] },
    xAxis: {
      type: "category",
      data: ["128", "256", "512"],
      name: "Embedding Dim",
    },
    yAxis: {
      type: "value",
      min: 0.5,
      max: 0.9,
      name: "Score (0-1)",
    },
    series: [
      {
        name: "Silhouette Score",
        type: "line",
        data: [0.65, 0.72, 0.81],
        smooth: true,
      },
    ],
  });

  // Recall@K 图表
  const recallChart = echarts.init(document.getElementById("recall-chart")!);
  recallChart.setOption({
    title: { text: "Recall@K与损失权重的关系" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Recall@K"] },
    xAxis: {
      type: "category",
      data: ["0.1", "0.5", "1.0"],
      name: "Loss Weight",
    },
    yAxis: {
      type: "value",
      min: 0.6,
      max: 0.9,
      name: "Recall@K (0-1)",
    },
    series: [
      {
        name: "Recall@K",
        type: "line",
        data: [0.68, 0.76, 0.83],
        smooth: true,
      },
    ],
  });

  // Vector Norm 图表
  const normChart = echarts.init(document.getElementById("norm-chart")!);
  normChart.setOption({
    title: { text: "向量范数与注意力头数的关系" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Norm"] },
    xAxis: {
      type: "category",
      data: ["4", "8", "16"],
      name: "Attention Heads",
    },
    yAxis: {
      type: "value",
      min: 1.0,
      max: 3.0,
      name: "Vector Norm",
    },
    series: [
      {
        name: "Norm",
        type: "bar",
        data: [1.5, 2.1, 2.7],
      },
    ],
  });
});
</script>

<style scoped>
.optimization {
  padding: 20px;
}
.charts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  max-height: 100vh; /* 限制最大高度 */
  overflow-y: auto; /* 添加纵向滚动条 */
}
.chart {
  flex: 1;
  min-width: 45%;
  height: 400px;
}
@media (max-width: 1200px) {
  .chart {
    min-width: 100%;
  }
}
</style>
