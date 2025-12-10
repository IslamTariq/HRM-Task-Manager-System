<template>
  <div class="dept-donut-wrap">
    <div class="dept-donut" :style="{ width: size + 'px', height: size + 'px' }">
      <canvas ref="donutRef"></canvas>
    </div>
    <div class="caption">{{ label }}</div>
    <div v-if="showLegend" class="legend">
      <span><i class="dot present"></i> Present</span>
      <span><i class="dot sick"></i> Sick</span>
      <span><i class="dot leave"></i> On Leave</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  deptName: { type: String, required: true },
  items: { type: Array, default: () => [] },
  size: { type: Number, default: 72 },
  label: { type: String, default: 'Attendance' },
  showLegend: { type: Boolean, default: false },
})

const donutRef = ref(null)
let chart = null

const computeCounts = () => {
  const dept = String(props.deptName || '').toLowerCase()
  const list = (props.items || []).filter(e => String(e.department).toLowerCase() === dept)
  const present = list.filter(e => e.active === true).length
  let sick = list.filter(e => String(e.status).toLowerCase() === 'sick').length
  let leave = list.filter(e => ['leave','vacation','onleave'].includes(String(e.status).toLowerCase())).length
  if (sick === 0 && leave === 0) {
    leave = Math.max(0, list.length - present)
  }
  return { present, sick, leave }
}

const render = () => {
  if (!donutRef.value) return
  const { present, sick, leave } = computeCounts()
  const total = present + sick + leave
  const dataVals = total === 0 ? [1, 0, 0] : [present, sick, leave]
  const colors = total === 0
    ? ['#E0E0E0', '#E0E0E0', '#E0E0E0']
    : ['#177a44', '#F44336', '#FFC107']
  const ctx = donutRef.value.getContext('2d')
  if (chart) chart.destroy()
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Sick', 'On Leave'],
      datasets: [
        {
          data: dataVals,
          backgroundColor: colors,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
    },
  })
}

onMounted(render)
onBeforeUnmount(() => { if (chart) chart.destroy() })

watch(() => [props.items, props.deptName], () => {
  render()
})
</script>

<style scoped>
.dept-donut-wrap { text-align: center; }
.dept-donut { display: block; margin: 6px auto 0; }
.caption { font-size: 12px; color: rgba(0,0,0,.6); margin-top: 6px; }
.legend { margin-top: 4px; font-size: 11px; color: rgba(0,0,0,.6); display: flex; gap: 10px; justify-content: center; }
.legend .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.legend .present { background: #177a44; }
.legend .sick { background: #F44336; }
.legend .leave { background: #FFC107; }
</style>
