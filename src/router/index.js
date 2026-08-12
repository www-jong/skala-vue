import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/weather/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('@/views/weather/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/weather/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/weather/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
