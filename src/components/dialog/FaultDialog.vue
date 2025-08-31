<template>
  <div class="fault-dialog-mask" @click.self="close">
    <div class="fault-dialog">
      <div class="dialog-header">
        <span>故障设备监控列表</span>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="dialog-toolbar">
        <input type="date" v-model="searchStart" class="date-input" />
        <span>至</span>
        <input type="date" v-model="searchEnd" class="date-input" />
        <input
          type="text"
          v-model="searchName"
          class="name-input"
          placeholder="名称搜索"
        />
        <button class="search-btn" @click="doSearch">搜索</button>
        <button
          class="search-btn"
          @click="download"
          v-if="(currentUser as any).username === 'admin'"
        >
          下载
        </button>
      </div>
      <div class="dialog-table">
        <div class="table-header">
          <span>序号</span>
          <span>发生时间</span>
          <span>受害IP</span>
          <span>攻击IP</span>
          <!-- <span>威胁名称</span> -->
          <span>一级告警类型</span>
          <span>攻击结果</span>
          <span>查看</span>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="(row, idx) in pagedData" :key="idx">
            <span>{{ idx + 1 }}</span>
            <span>{{ row.occurrence }}</span>
            <span>{{ row.assetIP }}</span>
            <span>{{ row.attackerIP }}</span>
            <!-- <span>{{ row.threatName }}</span> -->
            <span>{{ row.level1Type }}</span>
            <span>{{ row.attackResult }}</span>
            <span
              style="color: #00bcd4; cursor: pointer"
              @click.stop="viewDetails(row)"
              >查看详情</span
            >
          </div>
          <div v-if="pagedData.length === 0" class="table-empty">暂无数据</div>
        </div>
      </div>
      <div class="dialog-footer">
        <t-pagination
          size="small"
          :total="filteredData.length"
          :showPageSize="false"
          :page-size.sync="15"
          @change="paginationChange"
        />
        <!-- <button :disabled="page===1" @click="page--">&lt;</button>
        <button
          v-for="n in totalPages"
          :key="n"
          :class="{active: page===n}"
          @click="page=n"
        >{{ n }}</button>
        <button :disabled="page===totalPages" @click="page++">&gt;</button> -->
      </div>
    </div>

    <DetailDialog
      v-if="detailDialogVisible"
      :data="selectedRowData!"
      @close="detailDialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watchEffect } from "vue";
import DetailDialog from "./DetailDialog.vue";
import store, { type FaultLog } from "@/utils/store";

export default defineComponent({
  name: "FaultDialog",
  components: { DetailDialog },
  emits: ["close"],
  props: {
    // 定义可选filter prop
    filter: {
      type: Object as () => {
        type: string;
        threatLevel?: string;
        level1Type?: string;
        level2Type?: string;
        assetIP?: string;
      } | null,
      default: null,
    },
  },
  setup(props, { emit }) {
    const pageSize = 15;
    const page = ref(1);
    const searchStart = ref("2025-05-01 00:00:00");
    const searchEnd = ref("2025-05-31 23:59:59");
    const searchName = ref("");

    const allData = ref<FaultLog[]>([]);
    const loading = ref(true);
    const currentUser = ref({});
    currentUser.value = JSON.parse(localStorage.getItem("user")!);
    // 搜索过滤
    const filteredData = computed(() => {
      if (loading.value) return [];

      // 获取基础数据
      let arr = [...allData.value];

      // 应用本地搜索过滤
      if (searchStart.value) {
        arr = arr.filter((row) => row.occurrence >= searchStart.value);
      }

      if (searchEnd.value) {
        arr = arr.filter((row) => row.occurrence <= searchEnd.value);
      }
      if (searchName.value.trim()) {
        arr = arr.filter(
          (row) =>
            row.assetIP?.includes(searchName.value.trim()) ||
            row.attackerIP?.includes(searchName.value.trim()) ||
            row.level1Type?.includes(searchName.value.trim()) ||
            row.attackResult?.includes(searchName.value.trim())
        );
      }
      return arr;
    });

    // 分页
    const totalPages = computed(() =>
      Math.max(1, Math.ceil(filteredData.value.length / pageSize))
    );
    const pagedData = computed(() => {
      const start = (page.value - 1) * pageSize;
      return filteredData.value.slice(start, start + pageSize);
    });

    const doSearch = () => {
      page.value = 1;
    };

    // 页码越界修正
    watchEffect(() => {
      if (page.value > totalPages.value) page.value = totalPages.value;
      if (page.value < 1) page.value = 1;
      if (props.filter) {
        allData.value = store.getFaultLogsByFilter(props.filter);
      } else {
        allData.value = store.getFaultLogs();
      }

      loading.value = store.isLoading();
    });

    const close = () => emit("close");
    const download = () => {
      // 生成CSV内容
      const csvContent = [
        // 表头
        ['发生时间', '受害IP', '攻击IP', '一级告警类型', '攻击结果'].join(','),
        // 数据行
        ...filteredData.value.map(row => 
          [
            row.occurrence,
            row.assetIP,
            row.attackerIP,
            row.level1Type,
            row.attackResult
          ].join(',')
        )
      ].join('\n');

      // 创建Blob对象
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `故障日志_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const detailDialogVisible = ref(false);
    const selectedRowData = ref<FaultLog | null>(null);

    const viewDetails = (row: FaultLog) => {
      selectedRowData.value = row;
      detailDialogVisible.value = true;
    };

    const paginationChange = (event: { current: number }) => {
      page.value = event.current;
    };

    return {
      page,
      totalPages,
      pagedData,
      close,
      searchStart,
      searchEnd,
      searchName,
      doSearch,
      detailDialogVisible,
      selectedRowData,
      viewDetails,
      paginationChange,
      filteredData,
      currentUser,
      download,
    };
  },
});
</script>

<style scoped>
.fault-dialog-mask {
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.fault-dialog {
  background: linear-gradient(
    to bottom,
    #0f2027,
    #203a43,
    #2c5364
  ); /* 深蓝色渐变背景 */
  color: #ffffff; /* 白色文字 */
  border-radius: 8px;
  padding: 20px;
  max-width: 1200px;
  width: 90%;
  max-height: 800vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-header span {
  font-size: 1.4rem;
  color: #00bcd4;
  font-weight: bold;
}

.close-btn {
  background-color: #00bcd4;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.close-btn:hover {
  background-color: #0097a7;
}

/* 工具栏样式 */
.dialog-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.date-input,
.name-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #4a6fa1;
  color: #e0e0e0;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
  transition: border 0.3s;
}

.date-input:focus,
.name-input:focus {
  border-color: #00bcd4;
}

.search-btn {
  background-color: #00bcd4;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.search-btn:hover {
  background-color: #0097a7;
}

/* 表格样式 */
.table-header,
.table-row {
  display: flex;
  font-size: 13px;
  color: #e0e0e0;
}

.table-header {
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #4a6fa1;
  margin-bottom: 10px;
}

.table-header span,
.table-row span {
  flex: 1;
  text-align: center;
}

.table-row {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: background 0.3s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.2);
}

.table-empty {
  text-align: center;
  padding: 20px;
  color: #aaa;
}

/* 分页样式 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
}

.dialog-footer button {
  background: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.3s;
}

.dialog-footer button:hover,
.dialog-footer button.active {
  background: #0097a7;
}

.dialog-footer button:disabled {
  background: #444;
  cursor: not-allowed;
}

:deep(.t-pagination__number.t-is-current) {
  background-color: #0097a7;
}
:deep(.t-pagination__total) {
  color: #e0e0e0;
}
</style>
