<script setup>
import { onMounted, ref } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// ✅ Register required components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

// Example data
const totalEmployees = 72
const available = 62
const sick = 2
const onLeave = 8

// Chart reference
const donutRef = ref(null)

onMounted(() => {
  const ctx = donutRef.value.getContext('2d')

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Available', 'Sick', 'On Leave'],
      datasets: [
        {
          data: [available, sick, onLeave],
          backgroundColor: ['#177a44', '#F44336', '#FFC107'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false }, // we’ll use custom labels below
        tooltip: { enabled: true },
      },
    },
  })
})
</script>

<template>
  <v-card class="rounded-lg elevation-4 text-center">
    <v-card-title>
      Employee Status Overview
    </v-card-title>

    <v-card-text class="relative d-flex justify-center align-center">
      <!-- Doughnut Chart -->
      <canvas ref="donutRef" style="max-width: 260px;"></canvas>

      <!-- Center Label -->
      <div class="absolute-center">
        <div class="text-h6 font-weight-bold">{{ totalEmployees }}</div>
        <div class="text-caption text-medium-emphasis">Total</div>
      </div>
    </v-card-text>

    <!-- Custom Legend with Counts -->
     <v-row class="mt-4 justify-center">
      <v-col cols="4" class="text-center">
        <div class="legend-dot" style="background-color: #177a44"></div>
        <div class="text-body-2 font-weight-medium">Available</div>
        <div class="text-subtitle-2">{{ available }}</div>
      </v-col>

      <v-col cols="4" class="text-center">
        <div class="legend-dot" style="background-color: #F44336"></div>
        <div class="text-body-2 font-weight-medium">Sick</div>
        <div class="text-subtitle-2">{{ sick }}</div>
      </v-col>

      <v-col cols="4" class="text-center">
        <div class="legend-dot" style="background-color: #FFC107"></div>
        <div class="text-body-2 font-weight-medium">On Leave</div>
        <div class="text-subtitle-2">{{ onLeave }}</div>
      </v-col>
    </v-row> 
  </v-card>
</template>

<style scoped>
.v-card-text {
  position: relative;
}

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

/* Little colored circle indicators */
.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin: 0 auto 4px auto;
}
</style>
