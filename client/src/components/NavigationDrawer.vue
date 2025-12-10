<template>
  <v-navigation-drawer
    v-model="drawer"
    color="white"
    permanent
    width="280"
    elevation="2"
    class="navigation-drawer"
  >
    <!-- User Profile Section -->
    <div class="user-section pa-4">
      <v-avatar size="64" class="mb-3">
        <v-icon size="40" color="primary">mdi-account-circle</v-icon>
      </v-avatar>
      <div class="text-subtitle-1 font-weight-bold">Admin User</div>
      <div class="text-caption text-medium-emphasis">admin@hrms.com</div>
      <v-chip size="small" color="success" variant="tonal" class="mt-2">
        <v-icon start size="14">mdi-check-circle</v-icon>
        Active
      </v-chip>
    </div>

    <v-divider class="mx-4" />

    <v-list density="comfortable" nav class="pa-2">
      <template v-for="item in items" :key="item.title">
        <v-list-group
          v-if="item.children"
          v-model="item.open"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon :color="item.color || 'primary'" style="margin: 0;">{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.route"
            link
            :active="route.path === child.route"       
            @click="openParent(item)"
          >
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :to="item.route"
          link
          :active="route.path === item.route"
          class="nav-item"
          rounded="lg"
        >
          <template #prepend>
            <v-icon :color="route.path === item.route ? 'primary' : 'grey-darken-1'">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
          <template v-if="route.path === item.route" #append>
            <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(true)
const route = useRoute()

const items = ref([
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/dash-board',
    color: 'primary',
  },
  {
    title: 'Employment',
    icon: 'mdi-account-group',
    color: 'primary',
    open: false,
    children: [
      { title: 'Add Employee', route: '/employee/add' },
    ],
  },
  {
    title: 'Department',
    icon: 'mdi-office-building',
    color: 'primary',
    open: false,
    children: [
      { title: 'Add Department', route: '/department/add' },
    ],
  },
  {
    title: 'Vacations',
    icon: 'mdi-beach',
    route: '/vacations',
    color: 'primary',
  },
  {
    title: 'Courses',
    icon: 'mdi-school',
    route: '/courses',
    color: 'primary',
  },
])

const openParent = (parentItem) => {
  items.value.forEach((item) => {
    if (item.children) {
      item.open = (item === parentItem)
    }
  })
}

watch(
  () => route.path,
  (newPath) => {
    items.value.forEach((item) => {
      if (item.children) {
        item.open = item.children.some((child) => child.route === newPath)
      }
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.user-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  text-align: center;
  border-radius: 0 0 16px 16px;
  margin: 0 8px 8px 8px;
}

.v-list-item-title {
  font-size: 15px;
  transition: all 0.2s ease;
}

.nav-item {
  margin: 4px 0;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.v-list-item--active {
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  border-left: 4px solid rgb(var(--v-theme-primary));
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
}

.v-list-item--active .v-list-item-title {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

:deep(.v-list-group__items) {
  background-color: rgba(var(--v-theme-primary), 0.02);
  margin: 4px 0;
  border-radius: 8px;
}
</style>
