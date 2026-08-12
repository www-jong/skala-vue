import { createRouter, createWebHistory } from 'vue-router'
import PracticeApp from '@/PracticeApp.vue'
import ExerciseApp from '@/ExerciseApp.vue'
import MainWeatherHomeView from '@/views/main-weather/MainWeatherHomeView.vue'

const routes = [
  // 1. 메인 날씨 앱 독립 라우트 (src/views/main-weather/)
  {
    path: '/',
    name: 'MainWeatherHome',
    component: MainWeatherHomeView,
  },
  {
    path: '/main-weather/:cityId',
    name: 'MainWeatherDetail',
    component: () => import('@/views/main-weather/MainWeatherDetailView.vue'),
  },
  {
    path: '/main-about',
    name: 'MainWeatherAbout',
    component: () => import('@/views/main-weather/MainWeatherAboutView.vue'),
  },

  // 2. 실습 (Practice) 라우트
  {
    path: '/practice',
    name: 'Practice',
    component: PracticeApp,
  },

  // 3. 과제 (Exercise 5: 라우터 적용 - WeatherHomeView.vue 100% 본래 복구 사용)
  {
    path: '/exercise',
    name: 'Exercise',
    component: ExerciseApp,
    children: [
      {
        path: '',
        name: 'ExerciseWeatherHome',
        component: () => import('@/views/weather/WeatherHomeView.vue'),
      },
        {
    path: 'weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/weather/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('@/views/weather/WeatherAboutView.vue'),
  },
    ],
  },
  // 4. 404 예외 라우트
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
