<template>
  <div class="monitor panel">
    <div class="inner">
      <!-- Tabs -->
      <div class="tabs">
        <div class="tabs-header">
          <h3>故障设备监控</h3>
          <button class="more-btn" @click="handleMore">
            更多<i class="more-icon">></i>
          </button>
        </div>
      </div>

      <!-- Content -->

      <div class="content" v-for="(content, index) in monitorData" :key="index">
        <!-- Table Header -->
        <div class="head">
          <span
            class="col"
            v-for="(col, colIndex) in content.columns"
            :key="colIndex"
            :style="{ width: `${content.columns[colIndex].length * 10}px` }"
          >
            {{ col }}
          </span>
        </div>
        <!-- Scrolling Data -->
        <div class="marquee-view">
          <div class="marquee" ref="marqueeRef">
            <div
              class="row"
              v-for="(row, rowIndex) in content.rows"
              :key="rowIndex"
              @click="handleRowClick(row, rowIndex)"
              style="cursor: pointer"
            >
              <span
                class="col"
                v-for="(col, colIndex) in row"
                :key="colIndex"
                :style="{ width: `${content.columns[colIndex].length * 15}px` }"
              >
                {{ col }}
              </span>
            </div>
            <!-- Duplicate rows for seamless scrolling -->
            <!-- <div
              class="row"
              v-for="(row, rowIndex) in content.rows"
              :key="'duplicate-' + rowIndex"
            >
              <span
                class="col"
                v-for="(col, colIndex) in row"
                :key="colIndex"
                :style="{ width: `${content.columns[colIndex].length * 15}px` }"
              >
                {{ col }}
              </span>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 新增两个弹窗组件 -->
    <FaultDialog
      v-if="faultDialogVisible"
      @close="faultDialogVisible = false"
    />
    <DetailDialog
      v-if="detailDialogVisible"
      :data="selectedRowData as any"
      @close="detailDialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
} from "vue";
import type { MonitorData } from "@/types/monitor";
import FaultDialog from "./dialog/FaultDialog.vue";
import DetailDialog from "./dialog/DetailDialog.vue";
import store, { type FaultLog } from "@/utils/store";

export default defineComponent({
  name: "MonitorPanel",
  components: { FaultDialog, DetailDialog }, // 注册组件
  setup() {
    const activeTab = ref(0); // 当前选中的标签页，默认显示第一个标签页
    const tabs = ref<string[]>([]); // 标签页名称
    const monitorData = ref<MonitorData[]>([]); // 表格数据
    const marqueeRef = ref<HTMLDivElement | null>(null); // 滚动容器引用

    const faultDialogVisible = ref(false);
    const detailDialogVisible = ref(false);
    const selectedRowData = ref<FaultLog>();
    const FaultLogToP20 = ref<FaultLog[]>([]);
    const scrollInterval = ref<number | null>(null);
    const handleMore = () => {
      faultDialogVisible.value = true;
    };

    const handleRowClick = (row: any, rowIndex: number) => {
      if (row[row.length - 1] === "查看") {
        selectedRowData.value = formatRowToDetail(rowIndex);
        detailDialogVisible.value = true;
      }
    };

    const formatRowToDetail = (rowIndex: number) => {
      const top20Data = FaultLogToP20.value;
      return top20Data[rowIndex];
    };

    // 启动滚动效果
    const startMarquee = () => {
      if (marqueeRef.value) {
        const marquee = marqueeRef.value;
        let scrollTop = 0;

        scrollInterval.value = setInterval(() => {
          scrollTop += 2;
          if (scrollTop >= marquee.scrollHeight / 2) {
            scrollTop = 0; // 重置滚动位置
          }
          marquee.scrollTop = scrollTop;
        }, 20); // 控制滚动速度
      }
    };

    onMounted(() => {
      startMarquee();
    });

    // 初始化数据
    watchEffect(() => {
      const { tabs: fetchedTabs, data } = store.getMonitorData();
      tabs.value = fetchedTabs;
      monitorData.value = data;
      FaultLogToP20.value = store.getFaultLogToP20();
    });

    onBeforeUnmount(() => {
      if (scrollInterval.value) {
        clearInterval(scrollInterval.value);
      }
    });

    return {
      activeTab,
      tabs,
      monitorData,
      marqueeRef,
      faultDialogVisible,
      detailDialogVisible,
      selectedRowData,
      handleMore,
      handleRowClick,
    };
  },
});
</script>

<style scoped>
.head {
  font-weight: bold !important;
  /* 强制加粗表头字体 */
  white-space: nowrap;
  /* 禁止换行 */
  display: flex;
  /* 使用 flex 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  overflow: visible;
  /* 确保内容不会被隐藏 */
}

.row {
  font-size: 13px !important;
  /* 强制应用行数据字体大小 */
  text-align: center;
  /* 列内容居中 */
  flex-shrink: 0;
  /* 防止列被压缩 */
  word-break: break-word;
  /* 长单词换行 */
  width: auto;
  /* 自动调整宽度以适应内容 */
}

.tabs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.more-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #68d8fe;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.more-btn:hover {
  background: rgba(104, 216, 254, 0.1);
  transform: translateX(2px);
}

.more-icon {
  margin-left: 4px;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.more-btn:hover .more-icon {
  transform: translateX(2px);
}

h3 {
  margin: 0;
  color: #fff;
  font-size: 1rem;
}
</style>
