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
            v-for="(value, key) in filteredAlertDetails"
            :key="key"
            class="form-item"
          >
            <label
              ><strong>{{ labelMap[key] }}</strong></label
            >
            <div
              class="form-value"
              :title="value"
              @click="handleFieldClick(key, value)"
              :class="{
                'clickable-field': [
                  '载荷内容',
                  '请求头',
                  '请求体',
                  '响应头',
                  '响应体',
                ].includes(labelMap[key]),
              }"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="contentDialogVisible"
      class="content-dialog-overlay"
      @click.self="closeContentDialog"
    >
      <div class="content-dialog-box">
        <div class="dialog-header">
          <h3>{{ contentTitle }}</h3>
          <button class="close-btn" @click="closeContentDialog">X</button>
        </div>
        <div class="dialog-body" style="margin-top: 10px">
          <textarea
            id="content-textarea"
            readonly
            class="content-textarea"
            :value="contentToDisplay"
          ></textarea>
        </div>
      </div>
    </div>
    <!-- 攻击时序流程图弹窗 -->
    <div
      v-if="attackTimelineDialogVisible"
      class="attack-timeline-overlay"
      @click.self="closeAttackTimelineDialog"
    >
      <div class="attack-timeline-box">
        <div class="dialog-header">
          <h3>网络攻击时序流程图</h3>
          <button class="close-btn" @click="closeAttackTimelineDialog">
            X
          </button>
        </div>

        <div class="timeline-content">
          <!-- 顶部悬浮提示框 -->
          <div class="tooltip-container">
            <div class="tooltip">
              攻击设备代 *** 描述，AC 设备阻断 IP: 103.23.45.67
            </div>
          </div>

          <!-- 时序流程图 -->
          <div class="timeline">
            <div
              v-for="(step, index) in attackTimelineSteps"
              :key="index"
              class="timeline-step"
            >
              <!-- 仅在第一个元素显示时间 -->
              <div v-if="index === 0" class="step-time">{{ step.time }}</div>

              <div class="step-icon">
                <div class="icon-circle">
                  <span>{{ step.icon }}</span>
                </div>
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-desc">{{ step.desc }}</div>
              </div>
              <div
                v-if="index < attackTimelineSteps.length - 1"
                class="step-connector"
              ></div>
            </div>
          </div>

          <!-- 底部信息栏 -->
          <div class="timeline-footer">
            事件 ID: 56789 | 操作：临时封禁 | 时长: 24 小时 | 关联威胁情报：恶意
            IP 库 S230910
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, nextTick } from "vue";
import { eventBus } from "@/utils/eventBus";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
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

    // 创建一个只包含labelMap中定义属性的对象
    const filteredAlertDetails: Record<string, any> = {};
    for (const key in labelMap) {
      if (alertDetails && alertDetails.hasOwnProperty(key)) {
        filteredAlertDetails[key] = alertDetails[key];
      }
    }

    const close = () => {
      emit("close");
    };

    const openAiDialog = () => {
      eventBus.emit("openAiDialog", alertDetails);
    };

    const contentDialogVisible = ref(false);
    const contentToDisplay = ref("");
    const contentTitle = ref("");

    // 新增：攻击时序流程图弹窗控制
    const attackTimelineDialogVisible = ref(false);

    // 新增：攻击时序流程图步骤数据
    const attackTimelineSteps = ref([
      {
        icon: "S",
        time: "08:00:00",
        title: "源 IP",
        desc: "攻击源 IP: 202.101.23.45",
      },
      {
        icon: "P",
        time: "08:01:23",
        title: "终端详情",
        desc: "探测目标系统开放端口",
      },
      {
        icon: "B",
        time: "08:05:12",
        title: "事件名称",
        desc: "尝试破解系统密码",
      },
      {
        icon: "I",
        time: "08:06:45",
        title: "安全设备",
        desc: "AC 设备检测到异常行为",
      },
      {
        icon: "B",
        time: "08:07:01",
        title: "阻断 IP",
        desc: "阻断源 IP: 202.101.23.45",
      },
      {
        icon: "T",
        time: "08:07:01",
        title: "目标 IP",
        desc: "目标 IP: 10.20.30.40",
      },
    ]);

    // 新增：处理字段点击事件
    const handleFieldClick = (key: string, value: string) => {
      const specialFields = [
        "载荷内容",
        "请求头",
        "请求体",
        "响应头",
        "响应体",
      ];
      const timelineFields = ["攻击IP", "受害IP"];

      if (specialFields.includes(labelMap[key])) {
        contentToDisplay.value = value;
        contentTitle.value = labelMap[key];
        contentDialogVisible.value = true;
        nextTick(() => {
          const textarea = document.getElementById("content-textarea");
          if (textarea) {
            (textarea as any).select();
          }
        });
      } else if (timelineFields.includes(labelMap[key])) {
        // 专门处理攻击IP/受害IP的点击事件
        attackTimelineDialogVisible.value = true;
      }
    };

    const closeContentDialog = () => {
      contentDialogVisible.value = false;
    };

    // 新增：关闭攻击时序流程图弹窗
    const closeAttackTimelineDialog = () => {
      attackTimelineDialogVisible.value = false;
    };

    return {
      alertDetails,
      labelMap,
      filteredAlertDetails,
      close,
      openAiDialog,
      contentDialogVisible,
      contentToDisplay,
      contentTitle,
      attackTimelineDialogVisible,
      attackTimelineSteps,
      handleFieldClick,
      closeContentDialog,
      closeAttackTimelineDialog,
    };
  },
};
</script>

<style scoped>
.clickable-field {
  cursor: pointer;
  text-decoration: underline;
}

.content-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5001;
}

.content-dialog-box {
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-textarea {
  width: 98%;
  height: 100%;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.2);
  color: #e0e0e0;
  border: 1px solid #4a6fa1;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  font-family: monospace;
  white-space: pre-wrap;
}

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

/* 新增：攻击时序流程图弹窗样式 */
.attack-timeline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5002;
}

.attack-timeline-box {
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tooltip-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.tooltip {
  background: rgba(0, 150, 167, 0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.timeline {
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
  gap: 30px;
  flex: 1;
  align-items: center;
  min-height: 200px;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  position: relative;
}

.step-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.icon-circle {
  width: 100%;
  height: 100%;
  background: #00bcd4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f2027;
  font-weight: bold;
}

.step-content {
  text-align: center;
}

.step-time {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #00bcd4;
  font-weight: bold;
  font-size: 18px;
  background: rgba(15, 32, 39, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
}

.step-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.step-desc {
  font-size: 12px;
  color: #aaa;
  line-height: 1.4;
}

.step-connector {
  position: absolute;
  top: 20px;
  left: 100%;
  width: 30px;
  height: 2px;
  background: #4a6fa1;
}

.timeline-footer {
  background: rgba(0, 150, 167, 0.2);
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 13px;
  text-align: center;
  color: #e0e0e0;
}
</style>
