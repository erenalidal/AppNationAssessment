// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import VueCookies from "vue-cookies";


const ifAuthenticated = (to, from, next) => {
  if (VueCookies.get("authtoken")) {
    next();
    return;
  }
  window.location.href = "#/login";
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  }, {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
    ],
    beforeEnter: ifAuthenticated
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
