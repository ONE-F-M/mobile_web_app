import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/authentication/Login.vue'
import Home from '@/views/Home.vue'
import Checkin from '@/views/Checkin.vue'
import CheckinHistory from '@/views/CheckinHistory.vue'
import Notification from '@/views/Notification.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ApplyLeaveApplication from '@/views/ApplyLeaveApplication.vue'
import ViewLeaveApplication from '@/views/ViewLeaveApplication.vue'
import LeaveApplicationDetails from '@/views/LeaveApplicationDetails.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login},
    { path: '/home', name: 'home', component: Home},
    { path: '/checkin', name: 'checkin', component: Checkin},
    { path: '/checkin_history', name: 'checkin_history', component: CheckinHistory},
    { path: '/notification', name: 'notification', component: Notification},
    { path: '/forgot_password', name: 'forgot_password', component: ForgotPassword},
    { path: '/apply_leave_application', name: 'apply_leave_application', component: ApplyLeaveApplication},
    { path: '/view_leave_application', name: 'view_leave_application', component: ViewLeaveApplication},
    { path: '/leave_application/:leave_id', name: 'leave_application_details', component: LeaveApplicationDetails},
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')}
  ]
})

export default router
