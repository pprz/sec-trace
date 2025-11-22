<template>
  <div class="viewport">
    <div class="header">
      <div class="header-left">
        <!-- <span class="weather">天气预报：太原市 晴 25°C</span> -->
        <span class="date-container">
          <span class="date">{{ currentDate }}</span>
        </span>
      </div>
      <h1 class="header-center">网络安全日志分析与溯源系统</h1>

      <div class="header-right">
        <span class="date-container">
          <t-space align="center">
            <button
              @click="toggleDrawer"
              shape="circle"
              variant="text"
              class="logout-icon"
            >
              <img
                src="https://tdesign.gtimg.com/site/chat-avatar.png"
                alt="AI助手"
                style="width: 25px; height: 25px"
              />
            </button>
          </t-space>
          <button @click="logout" class="logout-icon" title="退出">
            <svg
              t="1749292136670"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2504"
              width="20"
              height="20"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M511.987 902.209c-49.499 0-97.577-9.494-142.794-28.32-43.71-18.103-82.907-44.048-116.591-77.104-33.688-33.066-60.125-71.585-78.621-114.451-19.13-44.378-28.837-91.53-28.837-140.145 0-58.162 14.532-115.909 41.994-167.062 26.551-49.425 65.122-92.823 111.567-125.494 12.904-9.077 30.833-6.134 40.056 6.5 9.223 12.638 6.28 30.204-6.629 39.226-39.248 27.683-71.824 64.268-94.207 105.994-23.493 43.732-35.393 91.108-35.393 140.837 0 81.139 32.197 157.426 90.668 214.783 58.433 57.379 136.143 88.981 218.789 88.981 82.624 0 160.356-31.603 218.825-88.981 58.465-57.355 90.637-133.643 90.637-214.783 0-49.673-11.873-97.133-35.393-140.837-22.388-41.692-54.986-78.309-94.244-105.938-12.873-9.018-15.874-26.588-6.62-39.221 9.25-12.634 27.147-15.604 40.024-6.5 46.473 32.665 85.099 76.063 111.627 125.489 27.486 51.154 42.018 108.904 42.018 167.066 0 48.609-9.704 95.762-28.862 140.171-18.473 42.866-44.933 81.386-78.616 114.446-33.693 33.061-72.892 58.973-116.596 77.165-45.244 18.712-93.294 28.178-142.797 28.178v0zM520.609 511.54c-15.848 0-28.691-12.55-28.691-28.128v-333.465c0-15.521 12.845-28.156 28.691-28.156 15.848 0 28.719 12.634 28.719 28.156v333.465c0 15.577-12.873 28.128-28.719 28.128v0z"
                p-id="2505"
                fill="#68d8fe"
              ></path>
            </svg>
          </button>
        </span>
      </div>
    </div>
    <div class="column-container">
      <div class="column">
        <OrderPanel />
        <SalesPanel />
        <MonitorPanel />
      </div>
      <div class="column">
        <SummaryPanel />
        <TopPanel />
        <!--      <UsersPanel />-->
      </div>
      <div class="column">
        <PointPanel />
        <TwoPointPanel />
        <!--      <ChannelPanel />
              <QuarterPanel />-->
      </div>
    </div>
    <t-drawer
      v-model:visible="visible"
      :footer="false"
      size="480px"
      :close-btn="true"
      class="drawer-box"
    >
      <template #header>
        <t-avatar
          size="32px"
          shape="circle"
          image="https://tdesign.gtimg.com/site/chat-avatar.png"
        ></t-avatar>
        <span class="title">Hi, &nbsp;我是网络安全小助手</span>
      </template>
      <t-chat
        ref="chatRef"
        :clear-history="chatList.length > 0 && !isStreamLoad"
        :data="chatList"
        :text-loading="loading"
        :is-stream-load="isStreamLoad"
        @scroll="handleChatScroll"
        @clear="clearConfirm"
      >
        <template #content="{ item }">
          <t-chat-reasoning
            v-if="item.reasoning?.length > 0"
            expand-icon-placement="right"
          >
            <template #header>
              <t-chat-loading v-if="isStreamLoad" text="思考中..." indicator />
              <div v-else style="display: flex; align-items: center">
                <CheckCircleIcon
                  style="
                    color: var(--td-success-color-5);
                    font-size: 20px;
                    margin-right: 8px;
                  "
                />
                <span>已深度思考</span>
              </div>
            </template>
            <t-chat-content
              v-if="item.reasoning.length > 0"
              :content="item.reasoning"
            />
          </t-chat-reasoning>
          <t-chat-content
            v-if="item.content.length > 0"
            :content="item.content"
          />
        </template>
        <template #actions="{ item }">
          <t-chat-action
            :content="item.content"
            :operation-btn="['good', 'bad', 'replay', 'copy']"
            @operation="handleOperation"
          />
        </template>
        <template #footer>
          <t-chat-input
            :stop-disabled="isStreamLoad"
            @send="inputEnter"
            @stop="onStop"
            v-model:value="queryValue"
          >
          </t-chat-input>
        </template>
      </t-chat>
      <t-button
        v-show="isShowToBottom"
        variant="text"
        class="bottomBtn"
        @click="backBottom"
      >
        <div class="to-bottom">
          <ArrowDownIcon />
        </div>
      </t-button>
    </t-drawer>
    <t-dialog
      v-model:visible="isSessionWarning"
      :close-btn="false"
      :header="false"
      :footer="false"
      style="z-index: 10000"
    >
      <div style="text-align: center; padding: 20px">
        <p>用户闲置时间已超过30分钟，将在{{ warningCountdown }}后退出登录</p>
        <t-button @click="cancelWarning">取消</t-button>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import OverviewPanel from "../components/OverviewPanel.vue";
import MonitorPanel from "../components/MonitorPanel.vue";
import OrderPanel from "../components/OrderPanel.vue";
import SalesPanel from "../components/SalesPanel.vue";
import UsersPanel from "../components/UsersPanel.vue";
import PointPanel from "../components/PointPanel.vue";
import ChannelPanel from "../components/ChannelPanel.vue";
import QuarterPanel from "../components/QuarterPanel.vue";
import TopPanel from "../components/TopPanel.vue";
import SummaryPanel from "../components/SummaryPanel.vue";
import TwoPointPanel from "@/components/TwoPointPanel.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { CheckCircleIcon, ArrowDownIcon } from "tdesign-icons-vue-next";
import { eventBus } from "@/utils/eventBus";
import { Dialog } from "tdesign-vue-next";

// 导入 fetchFaultLogs 函数
import { fetchFaultLogs } from "@/api/fault";
// 导入 FaultLog 类型
import type { FaultLog } from "@/api/fault";
import store from "@/utils/store";

export default defineComponent({
  name: "App",
  components: {
    Dialog,
    TwoPointPanel,
    OverviewPanel,
    MonitorPanel,
    OrderPanel,
    SalesPanel,
    UsersPanel,
    PointPanel,
    ChannelPanel,
    QuarterPanel,
    TopPanel,
    SummaryPanel,
    CheckCircleIcon,
    ArrowDownIcon,
  },
  setup() {
    const currentDate = ref("");
    const queryValue = ref("");
    const router = useRouter();
    const visible = ref(false);
    const fetchController = ref(null);
    const chatRef = ref(null);
    const loading = ref(false);
    const isStreamLoad = ref(false);

    const isShowToBottom = ref(false);
    // 更新日期和时间的函数
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = String(now.getHours()).padStart(2, "0"); // 补零
      const minutes = String(now.getMinutes()).padStart(2, "0"); // 补零
      const seconds = String(now.getSeconds()).padStart(2, "0"); // 补零
      currentDate.value = `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds}`;
    };

    const logout = () => {
      router.push("/login");
    };

    const backBottom = () => {
      chatRef.value &&
        (chatRef.value as any).scrollToBottom({
          behavior: "smooth",
        });
    };
    // 是否显示回到底部按钮
    const handleChatScroll = function ({ e }: any) {
      const scrollTop = e.target.scrollTop;
      isShowToBottom.value = scrollTop < 0;
    };

    const handleOperation = function (type: string, options: any) {
      console.log("handleOperation", type, options);
    };
    // 倒序渲染
    const chatList = ref([
      {
        avatar: "https://tdesign.gtimg.com/site/chat-avatar.png",
        role: "assistant",
        name: "络安全小助手",
        content: "你好！我是网络安全小助手，有什么可以帮您的吗？",
        datetime: new Date().toDateString(),
      },
    ]);

    const clearConfirm = function () {
      if (chatList.value.length > 2) {
        chatList.value = [chatList.value[chatList.value.length - 1]];
      }
    };
    const onStop = () => {
      console.log("停止", fetchController.value);
      if (fetchController.value) {
        (fetchController.value as any).abort("手动取消");
        loading.value = false;
        isStreamLoad.value = false;
      }
    };
    const inputEnter = function (inputValue: string) {
      if (isStreamLoad.value) {
        return;
      }
      if (!inputValue) return;
      const params = {
        avatar: "https://tdesign.gtimg.com/site/avatar.jpg",
        name: "你",
        content: inputValue,
        role: "user",
        datetime: new Date().toDateString(),
      };
      chatList.value.unshift(params);
      // 空消息占位
      const params2 = {
        avatar: "https://tdesign.gtimg.com/site/chat-avatar.png",
        name: "AI小助手",
        content: "",
        reasoning: "",
        role: "assistant",
        datetime: new Date().toDateString(),
      };
      chatList.value.unshift(params2);
      fetchAIResponse(inputValue);
    };

    // 调用硅基流动的接口
    const fetchAIResponse = async (inputValue: string) => {
      // 用于主动取消异步操作
      (fetchController.value as any) = new AbortController();
      // 流式加载是否结束
      isStreamLoad.value = true;
      // 聊天列表里的最有一个元素
      const lastItem = chatList.value[0];
      fetchEventSource("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer sk-rlncbcchjmqcgppnahivoiybvitjxxydvsfdvttwlmykltls",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-8B",
          messages: [
            {
              role: "user",
              content: inputValue,
            },
          ],
          // 开启流式
          stream: true,
          enable_thinking: false,
        }),
        // 中断请求关联信号
        signal: (fetchController.value as any).signal,
        onmessage(rsp) {
          console.log("【sse】Message from server:", rsp);
          // 流式响应或任务执行的结束标志
          if (rsp?.data === "[DONE]") {
            //lastItem.content += rsp?.data;
            loading.value = false;
            isStreamLoad.value = false;
            return;
          }
          // 将json转换成对象
          const data = JSON.parse(rsp?.data);
          // 获取内部的数据
          if (data.choices[0].delta.reasoning_content) {
            (lastItem as any).reasoning +=
              data.choices[0].delta.reasoning_content;
          } else if (data.choices[0].delta.content) {
            lastItem.content += data.choices[0].delta.content;
          }
        },
        onerror(err) {
          lastItem.content = `请求出错: ${err.message}`;
          (fetchController.value as any).abort(err.message);
        },
      });
    };

    const toggleDrawer = function () {
      visible.value = true;
      if (chatList.value.length > 2) {
        chatList.value = [chatList.value[chatList.value.length - 1]];
      }
    };

    // 获取所有故障日志数据
    const loadFaultLogs = async () => {
      try {
        store.setLoading(true);
        const faultLogs: FaultLog[] = await fetchFaultLogs();
        // 在这里可以将数据存储到全局状态或进行其他处理
        store.setFaultLogs(faultLogs);
        store.setLoading(false);
      } catch (error) {
        console.error("获取故障日志失败:", error);
      }
    };

    const isSessionWarning = ref(false);
    const warningCountdown = ref(30);
    let mainTimeout: number | null = null;
    let warningInterval: number | null = null;

    const resetMainTimer = () => {
      if (mainTimeout) clearTimeout(mainTimeout);
      mainTimeout = window.setTimeout(() => {
        isSessionWarning.value = true;
        startWarningCountdown();
      }, 60 * 30 * 1000); // 测试用1秒
    };

    const startWarningCountdown = () => {
      warningCountdown.value = 30;
      if (warningInterval) clearInterval(warningInterval);
      warningInterval = window.setInterval(() => {
        warningCountdown.value--;
        if (warningCountdown.value <= 0) {
          clearInterval(warningInterval!);
          logout();
        }
      }, 1000);
    };

    const cancelWarning = () => {
      isSessionWarning.value = false;
      if (warningInterval) clearInterval(warningInterval);
      resetMainTimer();
    };

    const handleUserActivity = () => {
      console.log(
        "🚀 ~ handleUserActivity ~ isSessionWarning.value:",
        isSessionWarning.value
      );
      if (isSessionWarning.value) {
        cancelWarning();
      } else {
        resetMainTimer();
      }
    };

    // 初始化时设置时间，并启动定时器
    onMounted(() => {
      updateDateTime(); // 初始化时立即更新一次
      setInterval(updateDateTime, 1000); // 每秒更新一次
      eventBus.on("openAiDialog", (event: any) => {
        toggleDrawer();
        queryValue.value = `请简要回答什么是'${event.threatName}',以及如何应`;
      });

      // 组件挂载后获取故障日志数据
      loadFaultLogs();

      const events = ["keydown", "scroll", "click"];
      events.forEach((event) => {
        window.addEventListener(event, handleUserActivity);
      });
      resetMainTimer();
    });

    onUnmounted(() => {
      eventBus.off("openAiDialog");
      const events = ["keydown", "scroll", "click"];
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (mainTimeout) clearTimeout(mainTimeout);
      if (warningInterval) clearInterval(warningInterval);
    });

    return {
      // 基础变量
      currentDate,
      visible,
      // 状态控制
      loading,
      isStreamLoad,
      isShowToBottom,
      // 数据集合
      chatList,
      // 引用对象
      chatRef,
      // 方法
      logout,
      backBottom,
      handleOperation,
      inputEnter,
      clearConfirm,
      handleChatScroll,
      queryValue,
      onStop,
      toggleDrawer,
      isSessionWarning,
      warningCountdown,
      cancelWarning,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 左中右分布 */
  align-items: center; /* 垂直居中 */
  padding: 0 2rem; /* 左右内边距 */
  width: 100%;
}

.header-left,
.header-right {
  font-size: 1.1rem;
  color: #68d8fe;
  flex: 0 0 auto; /* 固定宽度，不占用多余空间 */
  margin: 0px 3%;
  margin-top: 2rem;
}

.header-center {
  flex: 1; /* 占据中间的剩余空间 */
  text-align: center; /* 居中对齐 */
  margin-top: 2rem;
  margin-right: 6rem;
  font-size: 2.5rem;
}

.date-container {
  display: inline-flex;
  align-items: center;
}

.logout-icon {
  margin-left: 10px;
  width: 32px;
  height: 32px;
  background-color: #0b3667;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-icon:hover {
  background-color: #072b5d;
}

/* 应用滚动条样式 */
::-webkit-scrollbar-thumb {
  background-color: var(--td-scrollbar-color);
}
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: var(--td-scrollbar-hover-color);
}
::-webkit-scrollbar-track {
  background-color: var(--td-scroll-track-color);
}
.bottomBtn {
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: 210px;
  padding: 0;
  border: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08),
    0px 16px 24px 2px rgba(0, 0, 0, 0.04), 0px 6px 30px 5px rgba(0, 0, 0, 0.05);
}
.to-bottom {
  width: 40px;
  height: 40px;
  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  background: var(--td-bg-color-container);
  border-radius: 50%;
  font-size: 24px;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  .t-icon {
    font-size: 24px;
  }
}
</style>
<style lang="less">
.drawer-box {
  z-index: 5000;
}
</style>
