<template>
  <div class="quarter panel">
    <div class="inner">
      <h3>一季度销售进度</h3>
      <div class="chart">
        <div class="box">
          <div class="gauge"></div>
          <div class="label">{{ progress }}<small>%</small></div>
        </div>
        <div class="data">
          <div class="item" v-for="(stat, index) in quarterStats" :key="index">
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
import { getQuarterStats } from '@/api/quarter';
import type { QuarterStat } from '@/types/quarter';

export default defineComponent({
  name: 'QuarterPanel',
  setup() {
    const progress = ref<number>(0);
    const quarterStats = ref<QuarterStat[]>([]);

    onMounted(() => {
      const { progress: prog, stats } = getQuarterStats();
      progress.value = prog;
      quarterStats.value = stats;
    });

    return {
      progress,
      quarterStats,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for QuarterPanel here */
</style>