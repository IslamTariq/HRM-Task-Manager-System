<template>
  <v-container fluid>
    <v-row dense>
      <!-- ===== Left Column: Sector Overview & Stats ===== -->
      <v-col cols="12" md="8">

        <!-- 2. Sector Overview -->
          <SectorOverview />

        <!-- 3. Upcoming Training Sessions -->
        <v-card class="mt-4 pa-4" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-school</v-icon>
            Upcoming Training & Courses
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(course, index) in courses"
              :key="index"
              class="py-1"
            >
              <template #prepend>
                <v-icon color="primary">mdi-school</v-icon>
              </template>
              <v-list-item-title>{{ course.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ course.date }} • {{ course.trainer }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- ===== Right Column: Employee Overview & Extras ===== -->
      <v-col cols="12" md="4">
        <!-- 1. Employee Overview Circle Chart -->
        <v-card class="pa-4 mb-4 d-flex justify-center align-center" elevation="0">
          <EmployeesOverview />
        </v-card>

        <!-- 2. Upcoming Birthdays -->
        <v-card class="pa-4 mb-4" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon color="pink" class="mr-2">mdi-cake-variant</v-icon>
            Upcoming Birthdays
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(birthday, i) in birthdays"
              :key="i"
              class="py-1"
            >
              <template #prepend>
                <v-avatar size="36">
                  <v-img :src="birthday.avatar"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title>{{ birthday.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ birthday.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- 3. Company Announcements -->
        <v-card class="pa-4 mb-4" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon color="info" class="mr-2">mdi-bullhorn</v-icon>
            Company Announcements
          </v-card-title>
          <v-list density="compact">
            <v-list-item
              v-for="(news, index) in newsFeed"
              :key="index"
              class="py-1"
            >
              <template #prepend>
                <v-icon color="primary">mdi-bullhorn</v-icon>
              </template>
              <v-list-item-title>{{ news.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ news.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- 4. Quick Shortcuts -->
        <v-card class="pa-4" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon color="warning" class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Shortcuts
          </v-card-title>
          <v-row>
            <v-col
              cols="6"
              v-for="shortcut in shortcuts"
              :key="shortcut.title"
              class="text-center"
            >
              <v-btn
                variant="elevated"
                color="primary"
                block
                class="mb-2 shortcut-btn"
                @click="goTo(shortcut.route)"
                size="large"
              >
                <v-icon start>{{ shortcut.icon }}</v-icon>
                {{ shortcut.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import SectorOverview from '@/components/SectorOverview.vue'
import EmployeesOverview from '@/components/EmployeesOverview.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Quick stats for HR summary
const stats = ref([
  { title: 'Total Employees', value: 125, icon: 'mdi-account-group', color: 'indigo' },
  { title: 'Departments', value: 6, icon: 'mdi-office-building', color: 'green' },
  { title: 'On Leave Today', value: 8, icon: 'mdi-beach', color: 'orange' },
  { title: 'Vacancies', value: 3, icon: 'mdi-briefcase', color: 'red' },
])

// Upcoming training sessions
const courses = ref([
  { title: 'Leadership Training', date: 'Oct 25, 2025', trainer: 'Sarah Collins' },
  { title: 'Workplace Safety', date: 'Nov 02, 2025', trainer: 'John Smith' },
  { title: 'Diversity & Inclusion Workshop', date: 'Nov 15, 2025', trainer: 'Emily Davis' },
])

// Upcoming birthdays
const birthdays = ref([
  { name: 'Ali Khan', date: 'Oct 20, 2025', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { name: 'Emma Johnson', date: 'Oct 22, 2025', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { name: 'Michael Lee', date: 'Oct 30, 2025', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
])

// Company announcements
const newsFeed = ref([
  { title: 'New Remote Work Policy Effective Next Month', date: 'Oct 10, 2025' },
  { title: 'Annual Company Meetup on Dec 5th', date: 'Oct 14, 2025' },
  { title: 'Health Insurance Renewal Period Opens', date: 'Oct 17, 2025' },
])

// Quick Shortcuts
const shortcuts = ref([
  { title: 'Add Employee', icon: 'mdi-account-plus', route: '/employment/add' },
  { title: 'Add Department', icon: 'mdi-office-building-plus', route: '/department/add' },
  { title: 'View Leaves', icon: 'mdi-calendar-check', route: '/vacations' },
  { title: 'Courses', icon: 'mdi-school', route: '/courses' },
])

const goTo = (route) => {
  router.push(route)
}
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.shortcut-btn {
  transition: all 0.2s ease;
  text-transform: none;
  font-weight: 500;
}

.shortcut-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

:deep(.v-list-item) {
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(4px);
}
</style>
