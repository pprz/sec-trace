<template>
  <div class="order panel">
    <div class="inner">
      <!-- 过滤器部分 -->
      <div class="filter" v-if="false">
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
        <div class="item" v-for="(stat, key) in statistics" :key="key">
          <h4 @click="showDialog(stat.label)">{{ stat.value }}</h4>
          <span>
            <i class="icon-dot" :style="{ color: stat.color }"></i>
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>

    <FaultDialog
      v-if="dialogVisible"
      :filter="{ type, threatLevel }"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import { getOrderFilters } from "@/api/order";
import type { OrderStatistic } from "@/types/order";
import { eventBus } from "@/utils/eventBus";
import store from "@/utils/store";
import FaultDialog from "./dialog/FaultDialog.vue";
export default defineComponent({
  name: "OrderPanel",
  components: { FaultDialog },
  setup() {
    const activeFilter = ref("day30");
    const filters = ref(getOrderFilters());
    const statistics = ref<Record<string, OrderStatistic>>({});
    const dialogVisible = ref(false);
    const type = ref("day30");
    const threatLevel = ref("");
    const filterData = (key: string) => {
      activeFilter.value = key;
      statistics.value = store.getOrderStatistics(key);
      // 发送过滤器改变事件
      eventBus.emit("filterChange", key);
    };

    const showDialog = (value: string) => {
      const user = JSON.parse(localStorage.getItem("user") || "");
      if (user.username !== "admin") {
        return;
      }
      dialogVisible.value = true;
      threatLevel.value = value;
    };
    onMounted(() => {
      eventBus.on("filterChange", (event) => {
        // event 类型是 unknown，需断言
        type.value = event as string;
      });
    });

    watchEffect(() => {
      statistics.value = store.getOrderStatistics(activeFilter.value);
    });

    return {
      activeFilter,
      filters,
      statistics,
      filterData,
      dialogVisible,
      showDialog,
      type,
      threatLevel,
    };
  },
});
</script>
