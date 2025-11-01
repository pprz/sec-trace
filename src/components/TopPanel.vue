<template>
  <div class="top panel">
    <div class="boxall">
      <div class="header">
        <h3>一级告警类型统计</h3>
        <t-date-picker
          v-model="selectedDate"
          :options="datePickerOptions"
          @change="handleDateChange"
          clearable
        />
      </div>
      <div class="boxnav paim">
        <ul class="h100">
          <li v-for="(item, index) in topItems" :key="index">
            <span>{{ item.rank }}</span>
            <div class="pmnav">
              <p @click="showDialog(item.title)">{{ item.title }}</p>
              <div class="pmbar">
                <span :style="{ width: item.width }"></span>
                <i>{{ item.value }}(次)</i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <FaultDialog
      v-if="dialogVisible"
      :filter="{ type, assetIP, selectedDate }"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import type { TopItem } from "@/types/top";
import store from "@/utils/store";
import { eventBus } from "@/utils/eventBus";
import FaultDialog from "./dialog/FaultDialog.vue";
export default defineComponent({
  name: "TopPanel",
  props: {
    // 如果需要从父组件接收高度参数
    containerHeight: {
      type: String,
      default: "calc(42% - 0.15rem)",
    },
  },
  components: { FaultDialog },
  setup() {
    const topItems = ref<TopItem[]>([]);
    const type = ref("day30");
    const assetIP = ref("");
    const dialogVisible = ref(false);
    const selectedDate = ref();
    const globalType = ref("day30");
    const datePickerOptions = {
      disableDate: (date: Date) => date > new Date(),
    };
    onMounted(() => {
      eventBus.on("filterChange", (event) => {
        // event 类型是 unknown，需断言
        type.value = event as string;
      });
    });

    const handleDateChange = (date: string | null) => {
      if (!date) {
        type.value = globalType.value;
      } else {
        type.value = "byDay";
      }
    };
    const showDialog = (value: string) => {
      dialogVisible.value = true;
      assetIP.value = value;
    };
    watchEffect(() => {
      topItems.value = store.getTopItems(type.value, selectedDate.value as any);
    });

    return {
      topItems,
      type,
      assetIP,
      dialogVisible,
      showDialog,
      selectedDate,
      datePickerOptions,
      handleDateChange,
    };
  },
});
</script>

<style scoped>
@import "@/assets/styles/comon0.css";

.top.panel {
  height: 35%; /* 根据实际需求调整 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.h100 {
  list-style: none;
  padding: 0;
  margin: 0;
}

.h100 li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0; /* 增加上下间距 */
  border-bottom: 1px solid #e0e0e0; /* 添加分隔线 */
}

.h100 li:last-child {
  border-bottom: none; /* 去掉最后一项的分隔线 */
}

.h100 span {
  font-weight: bold;
  margin-right: 10px; /* 增加与后面内容的间距 */
  font-size: 1.2rem;
  color: #fff;
}

.pmnav {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  flex-direction: column;
}

.pmnav p {
  margin: 0 0 5px 0; /* 增加标题与进度条的间距 */
  font-size: 14px;
  color: #fff;
}

.pmbar {
  display: flex;
  align-items: center;
}

.pmbar span {
  display: block;
  height: 8px;
  background-color: #4caf50; /* 进度条颜色 */
  border-radius: 4px;
  margin-right: 10px; /* 增加与数值的间距 */
  transition: width 0.3s ease; /* 添加宽度变化的过渡效果 */
}

.pmbar i {
  font-size: 12px;
  color: #666;
  margin-left: 5px;
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
