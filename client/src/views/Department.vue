<template>
  <v-container class="py-6">
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-icon color="primary" size="32" class="mr-3">mdi-office-building</v-icon>
          <div>
            <h2 class="text-h4 font-weight-bold mb-1">Departments</h2>
            <p class="text-caption text-medium-emphasis mb-0">Organize your teams</p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          @click="addDialog = true"
          size="large"
          elevation="2"
        >
          Add Department
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="dept in visibleDepartments"
        :key="dept.id || dept.name"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-4 elevation-2 hoverable dept-card" @click="openDialog(dept)" rounded="lg">
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="mr-2">
              <v-icon :color="dept.color || 'primary'" size="32">{{ dept.icon || 'mdi-office-building' }}</v-icon>
            </v-col>
            <v-col>
              <div class="text-subtitle-1 font-weight-medium">{{ dept.name }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ dept.totalEmployees || 0 }} employees • {{ dept.totalTasks || 0 }} tasks
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn size="small" icon variant="text" color="error" @click.stop="confirmDelete(dept)" :title="`Delete ${dept.name}`">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <div class="mt-2">
            <DepartmentDonut :dept-name="dept.name" :items="employees" :size="64" label="Attendance" />
          </div>

          <v-divider class="my-3" />

          <v-row dense>
            <v-col cols="6">
              <div class="text-caption">Unassigned Tasks</div>
              <div class="font-weight-medium">{{ dept.unassignedTasks || 0 }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Employees w/ Unassigned</div>
              <div class="font-weight-medium">{{ dept.employeesWithUnassigned || 0 }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Absent</div>
              <div class="font-weight-medium">{{ absentCount(dept) }}</div>
            </v-col>
            <v-col cols="12" class="mt-2">
              <v-progress-linear
                :model-value="progressUnassigned(dept)"
                color="primary"
                height="8"
                rounded
              />
              <div class="text-caption text-medium-emphasis mt-1">
                {{ progressUnassigned(dept) }}% tasks unassigned
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-4" />

    <v-dialog v-model="addDialog" max-width="760">
      <AddDepartment @created="onDeptCreated" />
    </v-dialog>

    <!-- Details Dialog -->
    <v-dialog v-model="dialog" max-width="1000">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon :color="selected?.color || 'primary'" class="mr-2">{{ selected?.icon || 'mdi-office-building' }}</v-icon>
          <span class="text-h6">{{ selected?.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-list density="compact">
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-account-group</v-icon></template>
                  <v-list-item-title>Employees</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.totalEmployees || 0 }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-account-tie</v-icon></template>
                  <v-list-item-title>Head of Department</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.head || '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-clipboard-text</v-icon></template>
                  <v-list-item-title>Total Tasks</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.totalTasks || 0 }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-alert-circle-outline</v-icon></template>
                  <v-list-item-title>Unassigned</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.unassignedTasks || 0 }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-email</v-icon></template>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.email || '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-phone</v-icon></template>
                  <v-list-item-title>Phone</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.phone || '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-map-marker</v-icon></template>
                  <v-list-item-title>Location</v-list-item-title>
                  <v-list-item-subtitle>{{ selected?.location || '—' }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="8">
              <v-row no-gutters>
                <v-col cols="12" class="mb-4" style="height: 220px;">
                  <canvas ref="donutRef" style="max-height: 220px;"></canvas>
                </v-col>
                <v-col cols="12" style="height: 320px;">
                  <canvas ref="barRef" style="max-height: 320px;"></canvas>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="text-subtitle-1 font-weight-medium mb-2">Employees in {{ selected?.name }}</div>
          <v-progress-linear v-if="employeesLoading" indeterminate color="primary" class="mb-2" />
          <v-alert v-if="employeesError" type="error" class="mb-2">{{ employeesError }}</v-alert>
          <v-data-table
            v-if="!employeesLoading"
            :headers="employeeHeaders"
            :items="filteredEmployees"
            :items-per-page="5"
            density="compact"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="text" @click="confirmDelete(selected)" v-if="selected" prepend-icon="mdi-trash-can-outline">Delete</v-btn>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Delete Department</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>"{{ pendingDeptToDelete?.name }}"</strong>? This cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false" :disabled="deleting">Cancel</v-btn>
          <v-btn color="error" @click="deleteConfirmed" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '@/api'
import AddDepartment from '@/components/AddDepartment.vue'
import DepartmentDonut from '@/components/DepartmentDonut.vue'
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, DoughnutController, ArcElement } from 'chart.js'

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, DoughnutController, ArcElement)

const departments = ref([])
const loading = ref(false)
const error = ref('')
const addDialog = ref(false)
const deleteDialog = ref(false)
const pendingDeptToDelete = ref(null)
const deleting = ref(false)

const dialog = ref(false)
const selected = ref(null)
const barRef = ref(null)
const donutRef = ref(null)
let chartInstance = null
let donutInstance = null

// Employees for dialog table and card donuts
const employees = ref([])
const employeesLoading = ref(false)
const employeesError = ref('')
const employeeHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Contract', key: 'contractType' },
  { title: 'Joining', key: 'joiningDate' },
  { title: 'Active', key: 'active' },
]
const filteredEmployees = computed(() => {
  if (!selected.value) return []
  return employees.value
    .filter(e => String(e.department).toLowerCase() === String(selected.value.name).toLowerCase())
    .map(e => ({
      ...e,
      name: `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim(),
    }))
})

// Only show departments that are "available":
// interpreted as having at least one available (active) employee.
// Before employees load, show all departments to avoid empty state flicker.
const visibleDepartments = computed(() => departments.value)

onMounted(async () => {
  await loadDepartments()
  await loadEmployees()
})

async function loadDepartments() {
  loading.value = true
  try {
    const resp = await api.get('/departments')
    departments.value = Array.isArray(resp.data) ? resp.data : []
  } catch (e) {
    error.value = 'Failed to load departments.'
  } finally {
    loading.value = false
  }
}

function openDialog(dept) {
  selected.value = dept
  dialog.value = true
}

watch(dialog, (open) => {
  if (open) {
    setTimeout(() => { renderDonut(); renderChart() }, 0)
    loadEmployees()
  } else {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    if (donutInstance) { donutInstance.destroy(); donutInstance = null }
  }
})

function buildMonthlySeries(total) {
  const months = 12
  const base = Math.floor((Number(total) || 0) / months)
  const series = Array(months).fill(base)
  let remainder = (Number(total) || 0) - base * months
  let i = 0
  while (remainder > 0) {
    series[i % months] += 1
    remainder--
    i++
  }
  return series
}

function renderChart() {
  if (!barRef.value || !selected.value) return
  const data = buildMonthlySeries(selected.value.totalTasks)
  const ctx = barRef.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Tasks per Month',
          data,
          backgroundColor: 'rgba(34, 146, 207, 0.6)',
          borderColor: 'rgb(34, 146, 207)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  })
}

function getDeptStatusCounts() {
  if (!selected.value) return { present: 0, sick: 0, leave: 0 }
  const deptName = String(selected.value.name).toLowerCase()
  const list = employees.value.filter(e => String(e.department).toLowerCase() === deptName)
  const present = list.filter(e => e.active === true).length
  let sick = list.filter(e => String(e.status).toLowerCase() === 'sick').length
  let leave = list.filter(e => ['leave','vacation','onleave'].includes(String(e.status).toLowerCase())).length
  if (sick === 0 && leave === 0) {
    leave = Math.max(0, list.length - present)
  }
  return { present, sick, leave }
}

function renderDonut() {
  if (!donutRef.value) return
  const { present, sick, leave } = getDeptStatusCounts()
  const ctx = donutRef.value.getContext('2d')
  if (donutInstance) donutInstance.destroy()
  donutInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Sick', 'On Leave'],
      datasets: [
        {
          data: [present, sick, leave],
          backgroundColor: ['#177a44', '#F44336', '#FFC107'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { display: true }, tooltip: { enabled: true } },
    },
  })
}

function progressUnassigned(dept) {
  const total = Number(dept.totalTasks) || 0
  const unassigned = Number(dept.unassignedTasks) || 0
  if (total <= 0) return 0
  return Math.round((unassigned / total) * 100)
}

async function loadEmployees() {
  employeesLoading.value = true
  employeesError.value = ''
  try {
    const resp = await api.get('/employees')
    employees.value = Array.isArray(resp.data) ? resp.data : []
  } catch (e) {
    employeesError.value = 'Failed to load employees.'
  } finally {
    employeesLoading.value = false
  }
}

function absentCount(dept) {
  const name = String(dept?.name || '').toLowerCase()
  if (!name) return 0
  return employees.value.filter(
    e => String(e.department).toLowerCase() === name && e.active === false
  ).length
}

async function onDeptCreated() {
  addDialog.value = false
  await loadDepartments()
}

async function confirmDelete(dept) {
  if (!dept || !dept.name) return
  pendingDeptToDelete.value = dept
  deleteDialog.value = true
}

async function deleteConfirmed() {
  if (!pendingDeptToDelete.value) return
  deleting.value = true
  const name = pendingDeptToDelete.value.name
  try {
    await api.delete(`/departments/${encodeURIComponent(name)}`)
    if (selected.value && String(selected.value.name).toLowerCase() === String(name).toLowerCase()) {
      dialog.value = false
      selected.value = null
    }
    deleteDialog.value = false
    pendingDeptToDelete.value = null
    await loadDepartments()
    await loadEmployees()
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to delete department.'
    alert(msg)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.hoverable { 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  cursor: pointer; 
}

.hoverable:hover { 
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}

.dept-card {
  border: 1px solid rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.dept-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
