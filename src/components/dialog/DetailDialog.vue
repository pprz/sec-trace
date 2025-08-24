<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-box">
      <div class="dialog-header">
        <div class="title-wrapper">
          <h3>【{{ alertDetails.assetIP }}】 告警详情</h3>
          <button
            shape="circle"
            variant="text"
            class="logout-icon"
            @click="openAiDialog"
          >
            <img
              src="https://tdesign.gtimg.com/site/chat-avatar.png"
              alt="AI助手"
              style="width: 25px; height: 25px"
            />
          </button>
        </div>
        <button class="close-btn" @click="close">X</button>
      </div>

      <div class="dialog-body">
        <div class="form-grid">
          <div
            v-for="(value, key) in alertDetails"
            :key="key"
            class="form-item"
          >
            <label
              ><strong>{{ labelMap[key] }}</strong></label
            >
            <div class="form-value" :title="value">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { eventBus } from "@/utils/eventBus";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const alertDetails = props.data;

    const labelMap: Record<string, string> = {
    occurrence: "发生时间",
    attackerIP: "攻击IP",
    assetIP: "受害IP",
    level1Type: "一级告警类型",
    level2Type: "二级告警类型",
    threatName: "威胁名称",
    attackResult: "攻击结果",
    threatLevel: "威胁级别",
    payload: "载荷内容",
    requestHeader: "请求头",
    requestBody: "请求体",
    responseHeader: "响应头",
    responseBody: "响应体",
};
// 发生时间 受害IP 攻击IP 一级告警类型 二级告警类型 攻击结果 威胁级别 载荷内容 请求头 请求体 响应头 响应体
// const labelMapReversed: Record<string, string> = {
//   "发生时间": "occurrence",
//     "攻击IP": "attackerIP",
//     "受害IP": "assetIP",
//     "一级告警类型": "level1Type",
//     "二级告警类型": "level2Type",
//     "攻击结果": "attackResult",
//     "威胁级别": "threatLevel",
//     "载荷内容": "payload",
//     "请求头": "requestHeader",
//     "请求体": "requestBody",
//     "响应头": "responseHeader",
//     "响应体": "responseBody",
// };

    const close = () => {
      emit("close");
    };

    const openAiDialog = () => {
      eventBus.emit("openAiDialog", alertDetails);
    };

    return {
      alertDetails,
      labelMap,
      close,
      openAiDialog,
    };
  },
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

.dialog-box {
  background: linear-gradient(
    to bottom,
    #0f2027,
    #203a43,
    #2c5364
  ); /* 深蓝色渐变背景 */
  color: #ffffff; /* 文字颜色改为白色 */
  padding: 20px;
  border-radius: 8px;
  max-width: 1000px;
  width: 90%;
  height: 40vh;
  overflow-y: auto;
}

.dialog-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background-color: #00bcd4;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #0097a7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  max-width: 300px;
}

label {
  margin-bottom: 4px;
  font-weight: bold;
}

.form-value {
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 13px;
  white-space: pre-wrap;
  color: #e0e0e0;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.title-wrapper {
  /* background: rgba(0, 150, 167, 0.2); */
  display: flex; /* 启用 Flex 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 水平分布 */
  padding: 10px 0px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.title-wrapper h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #00bcd4;
  font-weight: bold;
}

.logout-icon {
  margin-left: 10px;
  width: 32px;
  height: 32px;
  background-color: #0b3667;
  color: white;
  border: none;
  border-radius: 50%;
  display: inline;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
 
