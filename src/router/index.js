import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@/utils/auth';
import Observer from '@/utils/observer';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MyData',
    component: () => import('@/views/MyData')
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Welcome')
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('@/views/Loading')
  },
  {
    path: '/alldata',
    name: 'AllData',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/AllData')
  },
  {
    path: '/map',
    name: 'Map',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Map')
  },
  {
    path: '/algorithms',
    name: 'Algorithm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Algorithm')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/About')
  },
  {
    path: '/datas/:id',
    name: 'Datas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Data')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!Auth.token() && to.name != 'Welcome') { 
    next({ name: 'Welcome' });
    return;
  }
  next(); 
})

Observer.$on('login', ({ account }) => {
  router.push({ name: 'MyData' }).catch(() => { });
})

export default router
