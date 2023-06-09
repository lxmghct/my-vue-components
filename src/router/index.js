import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/Test')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchTest')
    }
  ]
})
