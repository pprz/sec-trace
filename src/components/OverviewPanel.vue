<template>
  <div class="overview panel">
    <div class="inner">
      <h3>总体攻击情况</h3>
      <div class="item" v-for="(item, index) in overviewData" :key="index">
        <h4>{{ item.value }}</h4>
        <span>
          <i class="icon-dot" :style="{ color: item.color }"></i>
          <span :class="item.class">{{ item.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getOverviewData } from '@/api/overview';
import type { OverviewItem } from '@/types/overview';

export default defineComponent({
  name: 'OverviewPanel',
  setup() {
    const overviewData = ref<OverviewItem[]>([]);

    onMounted(() => {
      overviewData.value = getOverviewData();
    });

    return {
      overviewData,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for OverviewPanel here */
.overview.panel {
  height: 450px; /* 根据实际需求调整 */
  margin-top: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.inner {
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* 如果内容可能超出高度 */
}

.item {
  margin: 12px 0;
  padding: 8px;
  border-radius: 4px;
}
</style>