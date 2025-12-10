<script setup>
import { ref } from 'vue'

const sectors = ref([
  {
    name: 'Education',
    icon: 'mdi-school',
    color: 'primary',
    totalTasks: 120,
    unassignedTasks: 15,
    totalEmployees: 25,
    employeesWithUnassigned: 5,
  },
  {
    name: 'Healthcare',
    icon: 'mdi-hospital-box',
    color: 'primary',
    totalTasks: 80,
    unassignedTasks: 10,
    totalEmployees: 20,
    employeesWithUnassigned: 3,
  },
  {
    name: 'Childcare',
    icon: 'mdi-baby-face-outline',
    color: 'primary',
    totalTasks: 50,
    unassignedTasks: 5,
    totalEmployees: 12,
    employeesWithUnassigned: 2,
  },
  {
    name: 'Cleaning',
    icon: 'mdi-broom',
    color: 'primary',
    totalTasks: 60,
    unassignedTasks: 8,
    totalEmployees: 15,
    employeesWithUnassigned: 4,
  },
])
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="sector in sectors"
        :key="sector.name"
        cols="12"
        sm="6"
      >
        <v-card class="pa-4 elevation-3 d-flex flex-column align-start">
          <!-- Icon + Name -->
          <v-row align="center" class="mb-3">
            <v-icon :color="sector.color" size="32">{{ sector.icon }}</v-icon>
            <div class="text-subtitle-1 font-weight-medium ml-2">{{ sector.name }}</div>
          </v-row>

          <!-- Stats -->
          <v-row dense class="text-left">
            <v-col cols="6">
              <div class="text-caption">Total Tasks</div>
              <div class="font-weight-bold">{{ sector.totalTasks }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Unassigned Tasks</div>
              <div class="font-weight-bold">{{ sector.unassignedTasks }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Total Employees</div>
              <div class="font-weight-bold">{{ sector.totalEmployees }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">With Unassigned</div>
              <div class="font-weight-bold">{{ sector.employeesWithUnassigned }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
  min-height: 180px;
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-3px);
}
</style>
