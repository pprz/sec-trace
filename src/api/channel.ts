import type { Channel } from '@/types/channel';

export const getChannels = (): Channel[] => [
  { value: 39, label: '一级告警类型', icon: 'icon-plane' },
  { value: 28, label: '二级告警类型', icon: 'icon-bag' },
  { value: 20, label: '攻击结果', icon: 'icon-train' },
  { value: 13, label: '威胁级别', icon: 'icon-bus' },
];