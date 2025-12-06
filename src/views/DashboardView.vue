<template>
  <div class="viewport">
    <div class="header">
      <div class="header-left">
        <span class="date-container">
          <span class="date">{{ currentDate }}</span>
        </span>
      </div>
      <h1 class="header-center">网络安全日志分析</h1>

      <div class="header-right">
        <span class="date-container">
          <button
            @click="handleExportButtonClick"
            class="export-button"
            title="导入数据"
            v-if="isAdmin"
          >
            <span class="button-text" style="text-align: center">导入数据</span>
          </button>

          <t-space align="center">
            <button
              @click="toggleDrawer"
              shape="circle"
              variant="text"
              class="logout-icon"
            >
              <img
                src="@/assets/images/chat-avatar.png"
                alt="AI助手"
                style="width: 25px; height: 25px"
              />
            </button>
          </t-space>
          <!-- 替换原有的退出按钮部分 -->
          <t-dropdown :min-column-width="120" trigger="click">
            <button class="logout-icon" title="用户操作">
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
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item>
                  <router-link to="change-password">
                    <div style="display: flex; align-items: center">
                      <EditIcon style="margin-right: 8px" />
                      修改密码
                    </div>
                  </router-link>
                </t-dropdown-item>

                <t-dropdown-item @click="logout">
                  <div style="display: flex; align-items: center">
                    <LogoutIcon style="margin-right: 8px" />
                    退出登录
                  </div>
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
          </t-dropdown>
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
      </div>
      <div class="column">
        <PointPanel />
        <TwoPointPanel />
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
          image="@/assets/images/chat-avatar.png"
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

    <!-- 新增的导入弹窗 -->
    <div v-if="showExportModal" class="export-modal-overlay">
      <div class="export-modal">
        <div class="export-modal-header">
          <h3>导入数据</h3>
          <button @click="handleModalClose" class="close-btn">×</button>
        </div>
        <div class="export-modal-body">
          <!-- 新增设备信息选择 -->
          <div class="device-selection">
            <h4>选择设备信息：</h4>
            <div class="device-fields">
              <div class="form-group">
                <label class="field-label">设备名称：</label>
                <select
                  v-model="selectedDevice"
                  class="device-select"
                  @change="handleDeviceChange"
                >
                  <option value="">请选择设备名称</option>
                  <option value="明御安全网关">明御安全网关</option>
                  <option value="奇安信态势感知">奇安信态势感知</option>
                  <option value="深信服">深信服</option>
                </select>
              </div>
              <div class="form-group">
                <label class="field-label">规格型号：</label>
                <select
                  v-model="selectedModel"
                  class="model-select"
                  :disabled="!selectedDevice"
                >
                  <option value="">请先选择设备名称</option>
                  <option
                    v-for="model in availableModels"
                    :key="model.value"
                    :value="model.value"
                  >
                    {{ model.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="time-selection">
            <h4>选择时间范围：</h4>
            <div class="time-buttons">
              <button
                @click="selectTimeRange('today')"
                :class="
                  selectedTimeRange === 'today' ? 'time-btn active' : 'time-btn'
                "
              >
                今天
              </button>
              <button
                @click="selectTimeRange('yesterday')"
                :class="
                  selectedTimeRange === 'yesterday'
                    ? 'time-btn active'
                    : 'time-btn'
                "
              >
                昨天
              </button>
              <button
                @click="selectTimeRange('7days')"
                :class="
                  selectedTimeRange === '7days' ? 'time-btn active' : 'time-btn'
                "
              >
                近7天
              </button>
              <button
                @click="selectTimeRange('30days')"
                :class="
                  selectedTimeRange === '30days'
                    ? 'time-btn active'
                    : 'time-btn'
                "
              >
                近30天
              </button>
              <button
                @click="selectTimeRange('custom')"
                :class="
                  selectedTimeRange === 'custom'
                    ? 'time-btn active'
                    : 'time-btn'
                "
              >
                自定义
              </button>
            </div>
          </div>

          <!-- 自定义时间选择器 -->
          <div v-if="selectedTimeRange === 'custom'" class="custom-time-picker">
            <input
              type="date"
              v-model="customStartDate"
              class="date-input"
              placeholder="开始日期"
            />
            <span class="date-separator">至</span>
            <input
              type="date"
              v-model="customEndDate"
              class="date-input"
              placeholder="结束日期"
            />
          </div>
        </div>
        <div class="export-modal-footer">
          <button @click="handleModalClose" class="cancel-btn">取消</button>
          <button
            @click="handleExport"
            class="export-btn"
            :disabled="exportLoading || !selectedDevice || !selectedModel"
          >
            <span v-if="exportLoading">导入中...</span>
            <span v-else>导入数据</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 导入成功提示弹窗 -->
    <div v-if="showSuccessModal" class="success-modal-overlay">
      <div class="success-modal">
        <div class="success-icon">
          <svg
            t="1749292136670"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2508"
            width="64"
            height="64"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 105.4 167.2-239.1c6-8.6 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
              p-id="2509"
              fill="#52c41a"
            ></path>
          </svg>
        </div>
        <div class="success-message">
          <h3>导入成功！</h3>
          <p>数据已成功导入到您的设备</p>
        </div>
        <div class="success-actions">
          <button @click="showSuccessModal = false" class="confirm-btn">
            确定
          </button>
        </div>
      </div>
    </div>

    <t-dialog
      v-model:visible="isSessionWarning"
      :close-btn="false"
      :header="false"
      :footer="false"
      style="z-index: 10000"
    >
      <div style="text-align: center; padding: 20px">
        <p>用户闲置时间已超过30分钟，将在{{ warningCountdown }}后退出登录</p>
        <t-button @click="cancelWarning" style="margin-top: 35px"
          >取消</t-button
        >
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { CheckCircleIcon, ArrowDownIcon } from "tdesign-icons-vue-next";
import { eventBus } from "@/utils/eventBus";
import { fetchFaultLogs, saveNewFaultLogs } from "@/api/fault";
import type { FaultLog } from "@/api/fault";
import store from "@/utils/store";
import { Dialog } from "tdesign-vue-next";

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

    // 导入功能相关变量
    const showExportModal = ref(false);
    const showSuccessModal = ref(false);
    const selectedTimeRange = ref("today");
    const customStartDate = ref("");
    const customEndDate = ref("");
    const exportLoading = ref(false);
    const exportFileName = ref("");
    const exportFileSize = ref("");

    // 设备信息相关变量
    const selectedDevice = ref("");
    const selectedModel = ref("");
    const isAdmin = ref(false);

    // 设备型号映射关系
    const deviceModels: { [key: string]: { label: string; value: string }[] } =
      {
        明御安全网关: [{ label: " DAS-Gateway ", value: "DAS-Gateway" }],
        奇安信态势感知: [
          { label: "TSS10000-A58-WS", value: "TSS10000-A58-WS" },
        ],
        深信服: [
          { label: "AC-1000", value: "AC-1000" },
          { label: "AF-1000", value: "AF-1000" },
        ],
      };

    // 可用的规格型号（根据选择的设备动态变化）
    const availableModels = computed(() => {
      if (!selectedDevice.value) return [];
      return deviceModels[selectedDevice.value] || [];
    });

    // 处理设备选择变化
    const handleDeviceChange = () => {
      // 当设备变化时，重置型号选择
      selectedModel.value = "";
    };

    // 导入按钮点击处理
    const handleExportButtonClick = () => {
      showExportModal.value = true;
      // 重置所有选择
      selectedDevice.value = "";
      selectedModel.value = "";
      selectedTimeRange.value = "today";

      // 设置默认日期范围为今天
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;
      customStartDate.value = todayStr;
      customEndDate.value = todayStr;
    };

    // 更新日期和时间的函数
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
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

    const handleChatScroll = function ({ e }: any) {
      const scrollTop = e.target.scrollTop;
      isShowToBottom.value = scrollTop < 0;
    };

    const handleOperation = function (type: string, options: any) {
      console.log("handleOperation", type, options);
    };

    const chatList = ref([
      {
        avatar: "@/assets/images/chat-avatar.png",
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
      const params2 = {
        avatar: "@/assets/images/chat-avatar.png",
        name: "AI小助手",
        content: "",
        reasoning: "",
        role: "assistant",
        datetime: new Date().toDateString(),
      };
      chatList.value.unshift(params2);
      fetchAIResponse(inputValue);
    };

    const fetchAIResponse = async (inputValue: string) => {
      (fetchController.value as any) = new AbortController();
      isStreamLoad.value = true;
      const lastItem = chatList.value[0];
      fetchEventSource("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer x x x",
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
          stream: true,
          enable_thinking: false,
        }),
        signal: (fetchController.value as any).signal,
        onmessage(rsp) {
          if (rsp?.data === "[DONE]") {
            loading.value = false;
            isStreamLoad.value = false;
            return;
          }
          const data = JSON.parse(rsp?.data);
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

    const loadFaultLogs = async () => {
      try {
        store.setLoading(true);
        const faultLogs: FaultLog[] = await fetchFaultLogs();
        store.setFaultLogs(faultLogs);
        store.setLoading(false);
      } catch (error) {
        console.error("获取故障日志失败:", error);
      }
    };

    const selectTimeRange = (range: string) => {
      selectedTimeRange.value = range;

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      switch (range) {
        case "today":
          customStartDate.value = todayStr;
          customEndDate.value = todayStr;
          break;
        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = `${yesterday.getFullYear()}-${String(
            yesterday.getMonth() + 1
          ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
          customStartDate.value = yesterdayStr;
          customEndDate.value = yesterdayStr;
          break;
        case "7days":
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          const sevenDaysAgoStr = `${sevenDaysAgo.getFullYear()}-${String(
            sevenDaysAgo.getMonth() + 1
          ).padStart(2, "0")}-${String(sevenDaysAgo.getDate()).padStart(
            2,
            "0"
          )}`;
          customStartDate.value = sevenDaysAgoStr;
          customEndDate.value = todayStr;
          break;
        case "30days":
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
          const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(
            thirtyDaysAgo.getMonth() + 1
          ).padStart(2, "0")}-${String(thirtyDaysAgo.getDate()).padStart(
            2,
            "0"
          )}`;
          customStartDate.value = thirtyDaysAgoStr;
          customEndDate.value = todayStr;
          break;
      }
    };

    const handleModalClose = () => {
      showExportModal.value = false;
    };

    const handleExport = async () => {
      try {
        exportLoading.value = true;

        // 模拟导入过程
        await saveNewFaultLogs();

        // 生成导入文件名
        const now = new Date();
        const timestamp = now
          .toISOString()
          .replace(/[-:\.T]/g, "")
          .substring(0, 14);
        const deviceShortName = selectedDevice.value.replace(
          /[\u4e00-\u9fa5]/g,
          ""
        );
        exportFileName.value = `security_logs_${deviceShortName}_${selectedModel.value}_${timestamp}.csv`;

        // 模拟文件大小
        const sizeInKB = Math.floor(Math.random() * 1000) + 500;
        exportFileSize.value =
          sizeInKB < 1024
            ? `${sizeInKB} KB`
            : `${(sizeInKB / 1024).toFixed(2)} MB`;

        // 关闭导入弹窗，显示成功提示
        showExportModal.value = false;
        showSuccessModal.value = true;
      } catch (error) {
        console.error("导入失败:", error);
        alert("导入失败，请重试！");
      } finally {
        exportLoading.value = false;
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
      }, 60 * 10 * 1000); // 测试用1秒
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
      if (isSessionWarning.value) {
        cancelWarning();
      } else {
        resetMainTimer();
      }
    };

    onMounted(() => {
      updateDateTime();
      const user = JSON.parse(localStorage.getItem("user") || "");
      if (user.username === "admin") {
        isAdmin.value = true;
      }
      setInterval(updateDateTime, 1000);
      eventBus.on("openAiDialog", (event: any) => {
        toggleDrawer();
        queryValue.value = `请简要回答什么是'${event.threatName}',以及如何应`;
      });

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
      currentDate,
      visible,
      loading,
      isStreamLoad,
      isShowToBottom,
      chatList,
      chatRef,
      logout,
      backBottom,
      handleOperation,
      inputEnter,
      clearConfirm,
      handleChatScroll,
      queryValue,
      onStop,
      toggleDrawer,
      showExportModal,
      showSuccessModal,
      selectedTimeRange,
      customStartDate,
      customEndDate,
      exportLoading,
      exportFileName,
      exportFileSize,
      selectedDevice,
      selectedModel,
      availableModels,
      handleExportButtonClick,
      handleDeviceChange,
      selectTimeRange,
      handleModalClose,
      handleExport,
      isSessionWarning,
      warningCountdown,
      cancelWarning,
      isAdmin,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #1e5799 0%, #2989d8 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: transparent;
}

.header-left,
.header-right {
  font-size: 1.1rem;
  color: #ffffff;
  flex: 0 0 auto;
  margin: 0px 3%;
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1; /* 占据中间的剩余空间 */
  text-align: center; /* 居中对齐 */
  transform: translateX(56px);
  margin-top: 2rem;
  margin-right: 6rem;
  font-size: 2.5rem;
}

.date-container {
  display: inline-flex;
  align-items: center;
  color: #ffffff;
}

.logout-icon {
  margin-left: 15px;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.logout-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.export-button {
  margin-left: 15px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #68d8fe 0%, #4aa3ff 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(104, 216, 254, 0.3);
  z-index: 100;
}

.export-button:hover {
  background: linear-gradient(135deg, #4aa3ff 0%, #2e86de 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(104, 216, 254, 0.4);
}

.button-text {
  margin-left: 8px;
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
}

/* 自定义导入弹窗样式 */
.export-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.export-modal {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.export-modal-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #68d8fe 0%, #4aa3ff 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-modal-body {
  padding: 20px;
}

/* 设备选择样式 */
.device-selection {
  margin-bottom: 24px;
}

.device-selection h4 {
  margin-bottom: 12px;
  color: #333;
}

.device-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.device-select,
.model-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.model-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* 时间选择样式 */
.time-selection {
  margin-bottom: 24px;
}

.time-selection h4 {
  margin-bottom: 12px;
  color: #333;
}

.time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-btn.active {
  background: linear-gradient(135deg, #68d8fe 0%, #4aa3ff 100%);
  color: white;
  border-color: #68d8fe;
}

.time-btn:hover:not(.active) {
  border-color: #68d8fe;
  color: #68d8fe;
}

.custom-time-picker {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.date-separator {
  color: #666;
}

.export-modal-footer {
  padding: 16px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.export-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #68d8fe 0%, #4aa3ff 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4aa3ff 0%, #2e86de 100%);
}

.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 导入成功弹窗样式 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.success-modal {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 30px 20px;
  text-align: center;
}

.success-icon {
  margin-bottom: 20px;
}

.success-message h3 {
  color: #52c41a;
  font-size: 20px;
  margin-bottom: 8px;
}

.success-message p {
  color: #666;
  margin-bottom: 4px;
}

.file-info,
.file-size {
  font-size: 14px;
  color: #888;
}

.confirm-btn {
  padding: 8px 24px;
  background: linear-gradient(135deg, #68d8fe 0%, #4aa3ff 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #4aa3ff 0%, #2e86de 100%);
}
</style>
<style lang="less">
.drawer-box {
  z-index: 5000;
}
</style>
