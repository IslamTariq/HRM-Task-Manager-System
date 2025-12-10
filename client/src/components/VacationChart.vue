<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6 mb-1">Team Leave Timeline - {{ selectedDepartment || 'All Departments' }}</v-card-title>
    <v-card-subtitle class="mb-4">Vacation and Sick Leave across {{ currentYear }}</v-card-subtitle>

    <v-select
      v-model="selectedDepartment"
      :items="departmentNames"
      label="Select Department"
      class="mb-4"
    />

    <div class="chart-wrap">
      <canvas ref="chartCanvas" height="420"></canvas>
    </div>

    <div class="legend">
      <span class="legend-item"><i class="box" style="background: rgba(34,146,207,0.65)"></i> Vacation</span>
      <span class="legend-item"><i class="box" style="background: rgba(253,187,45,0.65)"></i> Sick Leave</span>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '@/api'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale } from 'chart.js'
import 'chartjs-adapter-date-fns'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale)

const chartCanvas = ref(null)
let chartInstance = null

const currentYear = new Date().getFullYear()
const yearStart = new Date(`${currentYear}-01-01`)
const yearEnd = new Date(`${currentYear}-12-31`)

const leaveColors = {
  Vacation: '#2292cf',
  'Sick Leave': '#fdbb2d',
}

const employees = ref([])
const leaves = ref([])
// Departments with at least one leave in the current year (plus "All Departments")
const departmentNames = computed(() => {
  if (!employees.value.length || !leaves.value.length) return []
  const emailToDept = new Map(
    employees.value
      .filter(e => e.department)
      .map(e => [String(e.email).toLowerCase(), String(e.department)])
  )
  const set = new Set()
  for (const l of leaves.value) {
    const y = new Date(l.startDate).getFullYear()
    if (y !== currentYear) continue
    const dept = emailToDept.get(String(l.employeeEmail || '').toLowerCase())
    if (dept) set.add(dept)
  }
  const list = Array.from(set).sort()
  return list.length ? ['All Departments', ...list] : []
})
const selectedDepartment = ref('')

watch(selectedDepartment, () => renderChart())
// Keep selection valid when data changes
watch([employees, leaves], () => {
  const names = departmentNames.value
  if (!names.length) {
    selectedDepartment.value = ''
    renderChart()
    return
  }
  if (!names.includes(selectedDepartment.value)) {
    selectedDepartment.value = names[0]
  }
  renderChart()
})
onMounted(async () => {
  await Promise.all([loadEmployees(), loadLeaves()])
  const names = departmentNames.value
  selectedDepartment.value = names.length ? names[0] : ''
  renderChart()
})

async function loadEmployees() {
  try {
    const resp = await api.get('/employees')
    employees.value = Array.isArray(resp.data) ? resp.data : []
  } catch { employees.value = [] }
}

async function loadLeaves() {
  try {
    const resp = await api.get('/leaves')
    leaves.value = Array.isArray(resp.data) ? resp.data : []
  } catch { leaves.value = [] }
}

function renderChart() {
  if (!chartCanvas.value) return
  if (chartInstance) chartInstance.destroy()
  const ctx = chartCanvas.value.getContext('2d')

  const dept = selectedDepartment.value
  const members = (dept && dept !== 'All Departments')
    ? employees.value.filter(e => String(e.department) === String(dept))
    : employees.value
  const byEmail = new Map(members.map(m => [String(m.email).toLowerCase(), `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email]))

  const typeMap = { Vacation: [], 'Sick Leave': [] }
  leaves.value.forEach(l => {
    const email = String(l.employeeEmail || '').toLowerCase()
    const name = byEmail.get(email)
    if (!name) return
    const y = new Date(l.startDate).getFullYear()
    if (y !== currentYear) return
    const t = String(l.type || '').toLowerCase()
    const label = (t === 'paid_holiday' || t === 'vacation') ? 'Vacation' : 'Sick Leave'
    const start = new Date(`${l.startDate}T00:00:00`)
    const end = new Date(`${l.endDate}T00:00:00`)
    typeMap[label].push({ x: [start, end], y: name, _member: name })
  })

  const datasets = Object.keys(typeMap).map(type => ({
    label: type,
    data: typeMap[type],
    backgroundColor: (c) => gradientFill(c, leaveColors[type]),
    borderColor: (c) => solidColor(leaveColors[type], 0.9),
    borderWidth: 1.5,
    borderRadius: 8,
    barPercentage: 0.9,
    categoryPercentage: 0.9,
  }))

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { datasets },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'nearest', intersect: false, axis: 'x' },
      scales: {
        x: {
          type: 'time',
          min: yearStart,
          max: yearEnd,
          time: { unit: 'month', displayFormats: { month: 'MMM' } },
          grid: { color: 'rgba(0,0,0,0.05)', borderDash: [3,3] },
          ticks: { color: 'rgba(0,0,0,0.6)' },
          title: { display: true, text: `Months of ${currentYear}`, color: 'rgba(0,0,0,0.7)' },
        },
        y: {
          type: 'category',
          title: { display: true, text: 'Employees', color: 'rgba(0,0,0,0.7)' },
          grid: { display: false },
          ticks: { color: 'rgba(0,0,0,0.7)' },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'roundRect', color: 'rgba(0,0,0,0.7)' },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleColor: '#fff',
          bodyColor: '#eee',
          borderColor: 'rgba(255,255,255,0.2)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const [start, end] = ctx.raw.x
              const ms = Math.abs(end - start)
              const days = Math.round(ms / (1000*60*60*24)) + 1
              const member = ctx.raw._member || ctx.raw.y || ''
              return `${member} — ${ctx.dataset.label}: ${start.toLocaleDateString()} to ${end.toLocaleDateString()} (${days} days)`
            },
          },
        },
      },
    },
  })
}

function gradientFill(ctx, hex) {
  const { chartArea, ctx: c } = ctx.chart
  if (!chartArea) return hex
  const { r, g, b } = hexToRgb(hex)
  const g1 = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
  g1.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`)
  g1.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.65)`)
  return g1
}

function solidColor(hex, a = 1) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}
</script>

<style scoped>
.chart-wrap { width: 100%; height: 520px; }
.legend { display: flex; justify-content: center; gap: 24px; margin-top: 12px; }
.legend .box { width: 16px; height: 16px; border-radius: 4px; display: inline-block; margin-right: 6px; }
</style>

