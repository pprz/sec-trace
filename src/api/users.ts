import type { UserStat } from '@/types/users';

export const getUserStats = (): UserStat[] => [
  { value: '120,899', label: '威胁总量', color: '#ed3f35' },
  { value: '248', label: '本月新增', color: '#eacf19' },
];