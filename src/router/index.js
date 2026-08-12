import { createRouter, createWebHistory } from 'vue-router'
import PracticeApp from '@/PracticeApp.vue'
import ExerciseApp from '@/ExerciseApp.vue'
import WeatherHomeView from '@/views/weather/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    name: 'MainWeatherHome',
    component: WeatherHomeView,
  },
  {
    path: '/weather/:cityId',
    name: 'MainWeatherDetail',
    component: () => import('@/views/weather/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'MainWeatherAbout',
    component: () => import('@/views/weather/WeatherAboutView.vue'),
  },
  {
    path: '/practice',
    name: 'Practice',
    component: PracticeApp,
  },
  {
    path: '/exercise',
    name: 'Exercise',
    component: ExerciseApp,
    children: [
      {
        path: '',
        name: 'ExerciseWeatherHome',
        component: () => import('@/components/exercise/WeatherParent.vue'),
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
