import { createRouter, createWebHistory } from 'vue-router'
import PracticeApp from '@/PracticeApp.vue'
import ExerciseApp from '@/ExerciseApp.vue'
import WeatherHomeView from '@/views/weather/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    redirect: '/practice',
  },
  {
    path: '/practice',
    name: 'Practice',
    component: PracticeApp,
  },
  {
    path: '/exercise',
    component: ExerciseApp,
    children: [
      {
        path: '',
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
    ],
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
