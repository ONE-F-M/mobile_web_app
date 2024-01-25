import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/authentication/Login.vue'
import Home from '@/views/Home.vue'
import Checkin from '@/views/Checkin.vue'
import CheckinHistory from '@/views/CheckinHistory.vue'
import Notification from '@/views/Notification.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import  ShiftPermissionList from '@/views/shift_permission/ShiftPermission.vue'
import  ShiftPermissionDetail from '@/views/shift_permission/ShiftPermissionDetail.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login},
    { path: '/home', name: 'home', component: Home},
    { path: '/checkin', name: 'checkin', component: Checkin},
    { path: '/checkin_history', name: 'checkin_history', component: CheckinHistory},
    { path: '/shift_permission_list', name: 'shift_permission_list', component: ShiftPermissionList},
    { path: '/shift_permission/:id', name: 'shift_permission', component: ShiftPermissionDetail},
    { path: '/shift_permission/', name: 'new_shift_permission', component: ShiftPermissionDetail},
    { path: '/notification', name: 'notification', component: Notification},
    { path: '/forgot_password', name: 'forgot_password', component: ForgotPassword},
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')}
  ]
})

export default router
