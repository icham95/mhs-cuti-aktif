import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import Cuti from '@/components/Cuti'
import CreateCuti from '@/components/CreateCuti'
import Aktif from '@/components/Aktif'
import CreateAktif from '@/components/CreateAktif'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: Profile
        },
        {
          path: 'cuti',
          name: 'cuti',
          component: Cuti
        },
        {
          path: 'create-cuti',
          name: 'createCuti',
          component: CreateCuti
        },
        {
          path: 'aktif',
          name: 'aktif',
          component: Aktif
        },
        {
          path: 'create-aktif',
          name: 'CreateAktif',
          component: CreateAktif
        }
      ]
    }
  ]
})
