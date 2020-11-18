import { createRouter, createWebHashHistory } from 'vue-router'
import Login from "../views/Login.vue"


const routes = [
  {
    path: '/',
    redirect:"/login"
  },
  {name: "Login", path: "/login", component: Login },
  {
    path: '/home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
    children: [
      {
        path: '/home',
        redirect: "/welcome",
      },
      {
        path: "/welcome",
        component: () => import(/* webpackChunkName: "about" */ '@/components/Welcome'),
      },
          {
        path: "/users",
        component: () => import(/* webpackChunkName: "about" */ '@/components/Users'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 定义路由导航守卫
// to: 代表我要去哪个个路由
// from: 代表我来自于哪个路由
// next代表: 下一步要去哪里 如果next() 代表放行  如果next("/login")代表必须跳转到login这个路由
router.beforeEach((to, from, next) => {
  // 获取token
  const isAuthenticated = window.sessionStorage.getItem("token");
  // 如果将要去的地方 不是Login 且没有授权 要强制跳转到Login页面
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next() // 否则放行
})

export default router
