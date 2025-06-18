<template>
  <div class="channel panel">
    <div class="inner">
      <h3>渠道分布</h3>
      <div class="data">
        <div class="item" v-for="(channel, index) in channels" :key="index">
          <h4>{{ channel.value }} <small>%</small></h4>
          <span>
            <i :class="channel.icon"></i>
            {{ channel.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getChannels } from '@/api/channel';
import type { Channel } from '@/types/channel';

export default defineComponent({
  name: 'ChannelPanel',
  setup() {
    const channels = ref<Channel[]>([]);

    onMounted(() => {
      channels.value = getChannels();
    });

    return {
      channels,
    };
  },
});
</script>

<style scoped>
/* Add any specific styles for ChannelPanel here if needed */
</style>