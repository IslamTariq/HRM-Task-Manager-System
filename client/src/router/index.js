import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import EmployeeDetails from '@/views/EmployeeDetails.vue'
import Department from '@/views/Department.vue'
import Vacations from '@/views/Vacations.vue'

const routes = [
  {path: '/', name: 'login-page', component: LoginPage},
  {path: '/dash-board', name: 'Dash-Board', component: DashBoard},
  {path: '/employee/add', name: 'Add-Employee', component: EmployeeDetails },
  {path: '/department/add', name: 'Department', component: Department},
  {path: '/vacations', name: 'Vacations', component: Vacations},
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
