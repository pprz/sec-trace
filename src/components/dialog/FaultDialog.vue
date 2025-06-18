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
        <input type="text" v-model="searchName" class="name-input" placeholder="名称搜索" />
        <button class="search-btn" @click="doSearch">搜索</button>
      </div>
      <div class="dialog-table">
        <div class="table-header">
          <span>序号</span>
          <span>首次发生时间</span>
          <span>受害IP</span>
          <span>攻击IP</span>
          <span>威胁名称</span>
          <span>攻击阶段</span>
          <span>一级告警类型</span>
          <span>攻击结果</span>
          <span>查看</span>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="(row, idx) in pagedData" :key="idx">
            <span>{{ idx + 1 }}</span>
            <span>{{ row.firstOccurrence }}</span>
            <span>{{ row.victimIP }}</span>
            <span>{{ row.attackerIP }}</span>
            <span>{{ row.threatName }}</span>
            <span>{{ row.attackStage }}</span>
            <span>{{ row.level1Type }}</span>
            <span>{{ row.attackResult }}</span>
          <span style="color: #00bcd4; cursor: pointer;" @click.stop="viewDetails(row)">查看详情</span>
          </div>
          <div v-if="pagedData.length === 0" class="table-empty">暂无数据</div>
        </div>
      </div>
      <div class="dialog-footer">
        <button :disabled="page===1" @click="page--">&lt;</button>
        <button
          v-for="n in totalPages"
          :key="n"
          :class="{active: page===n}"
          @click="page=n"
        >{{ n }}</button>
        <button :disabled="page===totalPages" @click="page++">&gt;</button>
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
import { defineComponent, ref, computed, watchEffect } from 'vue';
import { getAlertData } from '@/api/fault';
import type { AlertItem } from '@/api/fault';
import DetailDialog from './DetailDialog.vue';

// interface Row {
//   name: string;
//   attackResult: string;
//   type: string;
//   value: string;
//   date?: string; // 模拟日期字段
// }

// function randomDate() {
//   // 2024-05-01 ~ 2024-05-24
//   const start = new Date(2024, 4, 1).getTime();
//   const end = new Date(2024, 4, 24).getTime();
//   const d = new Date(start + Math.random() * (end - start));
//   return d.toISOString().slice(0, 10);
// }

export default defineComponent({
  name: 'FaultDialog',
  components: { DetailDialog },
  emits: ['close'],
  setup(_, { emit }) {
    const pageSize = 15;
    const page = ref(1);
    const searchStart = ref('');
    const searchEnd = ref('');
    const searchName = ref('');

    const allData = ref<AlertItem[]>([]);
    const loading = ref(true);

    // 调用接口获取数据
    getAlertData().then(res => {
      allData.value = res.data;
      loading.value = false;
    });

    // 搜索过滤
    const filteredData = computed(() => {
      if (loading.value) return [];

      let arr = [...allData.value];

      if (searchStart.value) {
        arr = arr.filter(row => row.firstOccurrence >= searchStart.value);
      }

      if (searchEnd.value) {
        arr = arr.filter(row => row.firstOccurrence <= searchEnd.value);
      }

      if (searchName.value.trim()) {
        arr = arr.filter(row =>
          row.victimIP.includes(searchName.value.trim()) ||
          row.attackerIP.includes(searchName.value.trim()) ||
          row.assetName.includes(searchName.value.trim())
        );
      }

      return arr;
    });

    // 分页
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)));
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
    });

    const close = () => emit('close');

    const detailDialogVisible = ref(false);
    const selectedRowData = ref<AlertItem | null>(null);

    const viewDetails = (row: AlertItem) => {
      selectedRowData.value = row;
      detailDialogVisible.value = true;
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
      viewDetails
    };
  }
});
</script>

<style scoped>
.fault-dialog-mask {
  position: fixed;
  z-index: 9999;
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
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364); /* 深蓝色渐变背景 */
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
</style>