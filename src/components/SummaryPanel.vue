<template>
    <div class="summary main">
        <div class="total">
            <!-- <div class="data1">
                <span>高危告警</span>
                <p>230</p>
            </div>
            <div class="data2">
                <span>危急告警</span>
                <p>169</p>
            </div>
            <div class="data3">
                <span>中危告警</span>
                <p>621</p>
            </div>
            <div class="data4">
                <span>低危告警</span>
                <p>2130</p>
            </div> -->
            <!-- <canvas class="rain"></canvas>
            <canvas class="dashed"></canvas> -->
            <div class="sphere">
                <div class="sphere-bg"></div>
                <div class="sum">
                    <span>告警总数</span>
                    <p>944</p>
                </div>
            </div>
            <div class="cicle3"></div>
            <div class="cicle4"></div>
            <div class="cicle5"></div>
            <div class="cicle6"></div>
            <div class="cicle7"></div>
            <div class="cicle8">
                <span>49%</span>
                <p>高危占比</p>
            </div>
            <div class="cicle9">
                <span>0.6%</span>
                <p>危急占比</p>
            </div>
            <div class="cicle10">
                <span>40%</span>
                <p>中危占比</p>
            </div>
            <div class="cicle11">
                <span>10%</span>
                <p>低危占比</p>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  
  export default defineComponent({
    name: 'SummaryPanel',
    setup() {
        onMounted(() => {
            
        });
    },
  });
  </script>
  
  <style scoped>
  @import '@/assets/styles/summary.css';
  /* 主容器 */
  .summary.main {
    height: 60%;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* 内容总容器 */
  .total {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 内容包裹层 */
  .content-wrapper {
    max-width: 1200px;
    width: 90%;
    height: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    position: relative;
  }

  /* 数据区块 */
  .data-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-self: center;
  }

  .data-group > div {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }

  .data-group span {
    display: block;
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .data-group p {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }

  /* 球体容器 */
  .sphere-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 指标区块 */
  .indicators {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    align-self: center;
  }

  .indicators > div {
    background: #fff;
    padding: 15px;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .indicators span {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
  }

  .indicators p {
    font-size: 12px;
    color: #666;
    margin: 4px 0 0;
  }
  </style>