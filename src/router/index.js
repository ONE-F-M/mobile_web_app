import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/authentication/Login.vue'
import Home from '@/views/Home.vue'
import Checkin from '@/views/Checkin.vue'
import CheckinHistory from '@/views/CheckinHistory.vue'
import Notification from '@/views/Notification.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import PenaltyManagement from '@/views/legal/penalty/PenaltyManagement.vue'
import PenaltyIssuance from "@/views/legal/penalty/PenaltyIssuance.vue"
import PenaltyDetail from "@/views/legal/penalty/PenaltyDetail.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login},
    { path: '/home', name: 'home', component: Home},
    { path: '/checkin', name: 'checkin', component: Checkin},
    { path: '/checkin_history', name: 'checkin_history', component: CheckinHistory},
    { path: '/notification', name: 'notification', component: Notification},
    { path: '/forgot_password', name: 'forgot_password', component: ForgotPassword},
    { path: '/penalty-management', name: 'penalty_management', component: PenaltyManagement},
    { path: "/penalty-management/issuance/", name: "penalty_issuance", component: PenaltyIssuance},
    { path: '/penalty-detail/:penaltyName', name: 'penalty_detail', component: PenaltyDetail, props: true },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')}
  ]
})

export default router
