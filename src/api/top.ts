import type { TopItem, Province } from '@/types/top';

export const getTopItems = (): TopItem[] => [
  { id: 1, rank: 1, title: '192.168.130.2', width: '90%', value: 180 },
  { id: 2, rank: 2, title: '10.14.5.168', width: '87%', value: 150 },
  { id: 3, rank: 3, title: '192.168.140.167', width: '85%', value: 140 },
  { id: 4, rank: 4, title: '111.7.100.66', width: '78%', value: 130 },
  { id: 5, rank: 5, title: '114.7.120.68', width: '60%', value: 100 },
];

export const getProvinces = (): Province[] => [
  { name: '192.168.130.2', sales: '25,179', trend: 'icon-up' },
  { name: '10.14.5.168', sales: '23,252', trend: 'icon-down' },
  { name: '192.168.140.167', sales: '20,760', trend: 'icon-up' },
  { name: '111.7.100.66', sales: '23,252', trend: 'icon-down' },
  { name: '112.7.156.68', sales: '20,760', trend: 'icon-up' },
];