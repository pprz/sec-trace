

<template>
  <div class="top panel">
    <div class="boxall">
      <div class="alltitle">受害IP排行榜</div>
      <div class="boxnav paim">
        <ul class="h100">
          <li v-for="(item, index) in topItems" :key="index">
            <span>{{ item.rank }}</span>
            <div class="pmnav">
              <p>{{ item.title }}</p>
              <div class="pmbar">
                <span :style="{ width: item.width }"></span>
                <i>{{ item.value }}(次)</i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getTopItems, getProvinces } from '@/api/top';
import type { TopItem, Province } from '@/types/top';

export default defineComponent({
  name: 'TopPanel',
  props: {
    // 如果需要从父组件接收高度参数
    containerHeight: {
      type: String,
      default: 'calc(42% - 0.15rem)'
    }
  },
  setup() {

    const topItems = ref<TopItem[]>([]);
    const provinces = ref<Province[]>([]);

    onMounted(() => {
      topItems.value = getTopItems();
      provinces.value = getProvinces();
    });

    return {
      topItems,
      provinces,
    };
  },
});
</script>

<style scoped>
@import '@/assets/styles/comon0.css';

.top.panel {
  height: 35%; /* 根据实际需求调整 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
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
</style>