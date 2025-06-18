<template>
  <div class="order panel">
    <div class="inner">
      <!-- 过滤器部分 -->
      <div class="filter">
        <a
          v-for="(filter, key) in filters"
          :key="key"
          href="javascript:;"
          :class="{ active: activeFilter === key }"
          @click="filterData(key)"
        >
          {{ filter }}
        </a>
      </div>
      <!-- 数据展示部分 -->
      <div class="data">
        <div
          class="item"
          v-for="(stat, key) in statistics"
          :key="key"
          @click="showDialog"
        >
          <h4>{{ stat.value }}</h4>
          <span>
            <i class="icon-dot" :style="{ color: stat.color }"></i>
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>
    <FaultDialog v-if="dialogVisible" @close="dialogVisible = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getOrderFilters, orderStatisticsMap } from '@/api/order';
import type { OrderStatistic } from '@/types/order';
import FaultDialog from './dialog/FaultDialog.vue';
import { eventBus } from '@/utils/eventBus';

export default defineComponent({
  name: 'OrderPanel',
  components: { FaultDialog },
  setup() {
    // 初始化为 24小时
    const activeFilter = ref('day1');
    const filters = ref(getOrderFilters());
    const statistics = ref<Record<string, OrderStatistic>>(orderStatisticsMap[activeFilter.value]);
    const dialogVisible = ref(false);

    const filterData = (key: string) => {
      activeFilter.value = key;
      statistics.value = orderStatisticsMap[key];
      // 发送过滤器改变事件
      eventBus.emit('filterChange', key);
    };

    const showDialog = () => {
      dialogVisible.value = true;
    };

    return {
      activeFilter,
      filters,
      statistics,
      filterData,
      dialogVisible,
      showDialog
    };
  }
});
</script>