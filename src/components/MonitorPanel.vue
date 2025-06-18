<template>
  <div class="monitor panel">
    <div class="inner">
      <!-- Tabs -->
      <div class="tabs">
        <div class="tabs-header">
          <h3>故障设备监控</h3>
          <button class="more-btn" @click="handleMore">更多<i class="more-icon">></i></button>
        </div>
      </div>

      <!-- Content -->
      <div class="content" v-for="(content, index) in monitorData" :key="index" v-show="activeTab === index">
        <!-- Table Header -->
        <div class="head">
          <span class="col" v-for="(col, colIndex) in content.columns" :key="colIndex"
            :style="{ width: `${content.columns[colIndex].length * 10}px` }">
            {{ col }}
          </span>
        </div>

        <!-- Scrolling Data -->
        <div class="marquee-view">
          <div class="marquee" ref="marqueeRef">
            <div class="row" v-for="(row, rowIndex) in content.rows" :key="rowIndex"
              @click="handleRowClick(row)"
              style="cursor: pointer;">
              <span class="col" v-for="(col, colIndex) in row" :key="colIndex"
                :style="{ width: `${content.columns[colIndex].length * 15}px` }">
                {{ col }}
              </span>
            </div>
            <!-- Duplicate rows for seamless scrolling -->
            <div class="row" v-for="(row, rowIndex) in content.rows" :key="'duplicate-' + rowIndex">
              <span class="col" v-for="(col, colIndex) in row" :key="colIndex"
                :style="{ width: `${content.columns[colIndex].length * 15}px` }">
                {{ col }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增两个弹窗组件 -->
    <FaultDialog v-if="faultDialogVisible" @close="faultDialogVisible = false" />
    <DetailDialog v-if="detailDialogVisible" :data="selectedRowData" @close="detailDialogVisible = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getMonitorData } from '@/api/monitor';
import type { MonitorData } from '@/types/monitor';
import FaultDialog from './dialog/FaultDialog.vue';
import DetailDialog from './dialog/DetailDialog.vue';

export default defineComponent({
  name: 'MonitorPanel',
  components: { FaultDialog, DetailDialog }, // 注册组件
  setup() {
    const activeTab = ref(0); // 当前选中的标签页，默认显示第一个标签页
    const tabs = ref<string[]>([]); // 标签页名称
    const monitorData = ref<MonitorData[]>([]); // 表格数据
    const marqueeRef = ref<HTMLDivElement | null>(null); // 滚动容器引用

    const faultDialogVisible = ref(false);
    const detailDialogVisible = ref(false);
    const selectedRowData = ref<any>(null);

    const handleMore = () => {
      faultDialogVisible.value = true;
    };

    const handleRowClick = (row: any) => {
      if (row[row.length - 1] === '查看') {
        selectedRowData.value = formatRowToDetail(row);
        detailDialogVisible.value = true;
      }
    };

    const formatRowToDetail = (row: string[]) => {
      return {
        firstOccurrence: row[0],
        lastOccurrence: row[0],
        victimIP: row[1],
        attackerIP: row[2],
        assetIP: '-',
        level1Type: '攻击利用',
        level2Type: '-',
        threatName: '未知威胁',
        ioc: 'IOC-123456',
        attackResult: row[3],
        threatLevel: '高危',
        count: '1',
        attackStage: '渗透阶段',
        assetGroup: '服务器组',
        xffProxy: '无',
        uri: '/api/login',
        cascadeUnit: '总部',
        status: '未处理',
        hostDomain: 'example.com',
        source: 'IDS',
        attackOrg: 'APT-C-22',
        attackMethod: 'SQL注入',
        httpStatus: '200',
        attackDimension: '网络层',
        isWhitelist: '否',
        payload: '恶意负载内容...',
        requestHeader: '{ "User-Agent": "Mozilla/5.0" }',
        requestBody: '{"username":"admin","password":"test"}',
        responseHeader: '{ "Content-Type": "text/html" }',
        responseBody: '<html>...</html>',
        webshellContent: '',
        responsiblePerson: '张三',
        assetTags: '核心资产',
        assetName: 'DB_Server',
        isKeyFocus: '是',
        attackerGeo: '中国·北京',
        eventReported: '已上报',
        isRead: '否',
        attackerAssetGroup: '外部IP',
        victimAssetGroup: '内部IP',
        alertTags: '紧急',
        srcIP: row[1],
        dstIP: row[2],
        srcPort: '55432',
        dstPort: '80',
        protocol: 'TCP',
        srcMAC: '00:1A:2B:3C:4D:5E',
        dstMAC: '00:0D:3C:4E:5F:6A',
        vlan: '100',
        alertID: 'ALERT-2025-0402-001',
        username: 'admin',
        password: '********',
      };
    };

    // 启动滚动效果
    const startMarquee = () => {
      if (marqueeRef.value) {
        const marquee = marqueeRef.value;
        let scrollTop = 0;

        setInterval(() => {
          scrollTop += 1;
          if (scrollTop >= marquee.scrollHeight / 2) {
            scrollTop = 0; // 重置滚动位置
          }
          marquee.scrollTop = scrollTop;
        }, 50); // 控制滚动速度
      }
    };

    // 初始化数据
    onMounted(() => {
      const { tabs: fetchedTabs, data } = getMonitorData();
      tabs.value = fetchedTabs;
      monitorData.value = data;

      console.log('Tabs:', tabs.value);
      console.log('Monitor Data:', monitorData.value);

      // 启动滚动
      startMarquee();
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