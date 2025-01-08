// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/router/index.js
// Description       : The main router file of the project.
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/components/HelloWorld.vue'
import UserRegister from '@/components/UserRegister.vue'
import UserLogin from '@/components/UserLogin.vue'
import StudentList from '@/components/StudentList.vue'
import ViewPost from '@/components/ViewPost.vue'
import ClubList from '@/components/ClubList.vue'
import UserPostList from '@/components/UserPostList.vue'
import ClubPostList from '@/components/ClubPostList.vue'
import BadgeList from '@/components/BadgeList.vue'
import EventList from '@/components/EventList.vue'
import UserDashboard from '@/components/UserDashboard.vue'
import FormApplicationList from '@/components/FormApplicationList.vue'
import AdvisorList from '@/components/AdvisorList.vue'
import ViewClub from '@/components/ViewClub.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/studentList/:layoutType',
    name: 'studentList',
    component: StudentList,
    props: true
  },
  {
    path: '/register',
    name: 'register',
    component: UserRegister
  },
  {
    path: '/login',
    name: 'login',
    component: UserLogin
  },
  {
    path: '/card',
    name: 'card',
    component: ViewPost
  },
  {
    path: '/clubList',
    name: 'clubList',
    component: ClubList
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'home' }
  },
  {
    path: '/userPostList',
    name: 'userPostList',
    component: UserPostList
  },
  {
    path: '/clubPostList',
    name: 'clubPostList',
    component: ClubPostList
  },
  {
    path:'/badgeList',
    name:'badgeList',
    component: BadgeList
  },
  {
    path:'/eventList',
    name:'eventList',
    component: EventList
  },
  {
    path:'/userDashboard',
    name:'userDashboard',
    component: UserDashboard
  },
  {
    path:'/formApplicationList/:layoutType',
    name:'formApplicationList',
    component: FormApplicationList,
    props: true
  },
  {
    path:'/advisorList/:layoutType',
    name:'advisorList',
    component: AdvisorList,
    props: true
  },
  {
    path:'/viewClub',
    name:'viewClub',
    component: ViewClub,
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
