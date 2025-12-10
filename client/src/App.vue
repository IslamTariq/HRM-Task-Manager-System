<template>
  <v-app>
    <!-- Drawer (Overlays Content) -->
    <NavigationDrawer ref="drawerRef" />

    <!-- Enhanced Top Bar -->
    <v-app-bar 
      app 
      color="primary" 
      dark 
      elevation="2"
      class="app-bar"
    >
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title class="font-weight-bold">
        <v-icon class="mr-2">mdi-office-building</v-icon>
        HRMS Dashboard
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Notifications -->
      <v-btn icon variant="text" class="mr-2">
        <v-badge color="error" content="3" overlap>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      
      <!-- User Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" variant="text">
            <v-avatar size="32">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-account" title="Profile" />
          <v-list-item prepend-icon="mdi-cog" title="Settings" />
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-logout" title="Logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content with smooth transitions -->
    <v-main class="main-content">
      <v-fade-transition>
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const drawerRef = ref(null)

const toggleDrawer = () => {
  drawerRef.value.drawer = !drawerRef.value.drawer
}
</script>

<style scoped>
.app-bar {
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%) !important;
}

.main-content {
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}
</style>
