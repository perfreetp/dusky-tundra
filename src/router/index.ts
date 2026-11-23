import { createRouter, createWebHashHistory } from 'vue-router'
import BaseLayersPage from '../pages/BaseLayersPage.vue'
import HeatmapPage from '../pages/HeatmapPage.vue'
import PointsPage from '../pages/PointsPage.vue'
import RegionPage from '../pages/RegionPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/base' },
    { path: '/base', name: 'base', component: BaseLayersPage },
    { path: '/heatmap', name: 'heatmap', component: HeatmapPage },
    { path: '/points', name: 'points', component: PointsPage },
    { path: '/region', name: 'region', component: RegionPage },
  ],
})
