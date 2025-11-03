import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue'; // 根据实际路径调整
import DashboardView from '@/views/DashboardView.vue'; // 根据实际路径调整
import ChangePassword from '@/views/ChangePassword.vue'; // 根据实际路径调整

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/',
    redirect: '/login', // 默认重定向到登录页
  },
];

const router = createRouter({
  history: createWebHistory('/sec-trace'),// 👈 这里添加了 base 路径
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // 检查是否访问需要认证的页面且没有有效token
  if (to.path.startsWith('/dashboard') && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;