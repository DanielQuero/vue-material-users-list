import Vue from 'vue'
import VueRouter from 'vue-router'
import UsersList from '../views/UsersList/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'UsersListRoute',
    component: UsersList
  },
  {
    path: '/check-user-profile',
    name: 'UserProfileRoute',
    component: () => import('@/views/UserProfile/index.vue')
  },
  {
    path: '/export-favourites',
    name: 'ExportFavouriteUsersRoute',
    component: UsersList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
