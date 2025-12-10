<template>
  <v-container class="py-6">
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-icon color="primary" size="32" class="mr-3">mdi-account-group</v-icon>
          <div>
            <h2 class="text-h4 font-weight-bold mb-1">Employees</h2>
            <p class="text-caption text-medium-emphasis mb-0">Manage your workforce</p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn 
          color="primary" 
          prepend-icon="mdi-account-plus" 
          @click="addDialog = true"
          size="large"
          elevation="2"
          class="add-btn"
        >
          Add Employee
        </v-btn>
      </v-col>
    </v-row>

    <!-- Add Employee Dialog -->
    <v-dialog v-model="addDialog" max-width="900">
          <AddEmployeDetails @created="onAdded" />
    </v-dialog>

    <v-row class="mb-3" align="center">
      <v-col cols="12" md="6">
        <v-text-field v-model="search" label="Search name or email" clearable prepend-inner-icon="mdi-magnify" />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="deptFilter"
          :items="deptOptions"
          item-title="title"
          item-value="value"
          label="Filter by department"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2" class="text-right">
        <v-btn-toggle v-model="viewMode" density="comfortable" mandatory rounded="lg" class="view-toggle">
          <v-btn
            :variant="viewMode === 'table' ? 'tonal' : 'text'"
            :color="viewMode === 'table' ? 'primary' : 'grey'"
            value="table"
            :title="'Table view'"
            icon
          >
            <v-icon :color="viewMode === 'table' ? 'primary' : 'grey'">mdi-table-large</v-icon>
          </v-btn>
          <v-btn
            :variant="viewMode === 'cards' ? 'tonal' : 'text'"
            :color="viewMode === 'cards' ? 'primary' : 'grey'"
            value="cards"
            :title="'Cards view'"
            icon
          >
            <v-icon :color="viewMode === 'cards' ? 'primary' : 'grey'">mdi-account-box-multiple-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>

    <template v-if="viewMode === 'table'">
      <v-data-table
        :headers="headers"
        :items="filtered"
        :items-per-page="8"
        :loading="loading"
        density="comfortable"
      >
        <template #item.name="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>
        <template #item.active="{ item }">
          <v-chip :color="item.active ? 'success' : 'warning'" size="small" label>
            {{ item.active ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn size="small" icon variant="text" @click="openDetails(item)" :title="'View details'">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn size="small" icon variant="text" color="error" @click="askDelete(item)" :title="'Delete'">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </template>

    <template v-else>
      <v-row dense>
        <v-col v-for="item in filtered" :key="item.id || item.email" cols="12" sm="6" md="4">
          <v-card class="pa-4 hoverable emp-card">
            <v-row no-gutters align="center">
              <v-col cols="auto" class="mr-3">
                <v-avatar size="56">
                  <template v-if="avatarUrl(item)">
                    <v-img :src="avatarUrl(item)" alt="avatar" />
                  </template>
                  <template v-else>
                    <div :style="avatarStyle(item)" class="avatar-fallback">
                      {{ initials(item) }}
                    </div>
                  </template>
                </v-avatar>
              </v-col>
              <v-col>
                <div class="text-subtitle-1 font-weight-medium">{{ item.firstName }} {{ item.lastName }}</div>
                <div class="mt-1">
                  <v-chip size="x-small" variant="tonal" class="mr-1">{{ item.role }}</v-chip>
                  <v-chip size="x-small" variant="tonal">{{ item.department }}</v-chip>
                </div>
              </v-col>
              <v-col cols="auto">
                <v-chip :color="item.active ? 'success' : 'warning'" size="small" class="ml-2" label>
                  {{ item.active ? 'Active' : 'Inactive' }}
                </v-chip>
              </v-col>
            </v-row>
            <v-divider class="my-3" />
            <v-row no-gutters class="text-caption text-medium-emphasis">
              <v-col cols="12">
                <v-icon size="16" class="mr-1">mdi-email</v-icon>{{ item.email }}
              </v-col>
              <v-col v-if="item.joiningDate" cols="12" class="mt-1">
                <v-icon size="16" class="mr-1">mdi-calendar-start</v-icon>{{ item.joiningDate }}
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800">
      <v-card>
        <v-card-title class="text-h6">{{ selectedName }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item><v-list-item-title>Email</v-list-item-title><v-list-item-subtitle>{{ selected?.email }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Phone</v-list-item-title><v-list-item-subtitle>{{ selected?.phone || '—' }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Department</v-list-item-title><v-list-item-subtitle>{{ selected?.department }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Role</v-list-item-title><v-list-item-subtitle>{{ selected?.role }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Contract</v-list-item-title><v-list-item-subtitle>{{ selected?.contractType || '—' }}</v-list-item-subtitle></v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item><v-list-item-title>Joining Date</v-list-item-title><v-list-item-subtitle>{{ selected?.joiningDate || '—' }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>DOB</v-list-item-title><v-list-item-subtitle>{{ selected?.dob || '—' }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Address</v-list-item-title><v-list-item-subtitle>{{ fullAddress }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title>Status</v-list-item-title><v-list-item-subtitle>{{ selected?.active ? 'Active' : 'Inactive' }}</v-list-item-subtitle></v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="detailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Delete Employee</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>"{{ pendingDelete?.email }}"</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false" :disabled="deleting">Cancel</v-btn>
          <v-btn color="error" @click="deleteConfirmed" :loading="deleting" prepend-icon="mdi-trash-can-outline">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import AddEmployeDetails from '@/components/AddEmployeDetails.vue'

const addDialog = ref(false)
const viewMode = ref('cards')
const employees = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const deptFilter = ref(null)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Department', key: 'department' },
  { title: 'Role', key: 'role' },
  { title: 'Active', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Filter dropdown options — only existing departments from backend
const deptOptions = ref([])

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  return employees.value
    .filter(e => (deptFilter.value == null) || e.department === deptFilter.value)
    .filter(e => !q || `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q))
})

async function loadEmployees() {
  loading.value = true
  error.value = ''
  try {
    const resp = await api.get('/employees')
    employees.value = Array.isArray(resp.data) ? resp.data : []
  } catch (e) {
    error.value = 'Failed to load employees.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadEmployees(), loadDeptOptions()])
})

async function loadDeptOptions() {
  try {
    const resp = await api.get('/departments')
    const names = Array.isArray(resp.data) ? resp.data.map(d => d.name).filter(Boolean) : []
    const items = names.sort().map(n => ({ title: n, value: n }));
    deptOptions.value = [{ title: 'All Departments', value: null }, ...items]
  } catch (e) {
    deptOptions.value = [{ title: 'All Departments', value: null }]
  }
}

function onAdded() {
  addDialog.value = false
  loadEmployees()
  loadDeptOptions()
}

const detailsDialog = ref(false)
const selected = ref(null)
const selectedName = computed(() => selected.value ? `${selected.value.firstName} ${selected.value.lastName}`.trim() : '')
const fullAddress = computed(() => {
  const s = selected.value
  if (!s) return '—'
  const parts = [s.street, s.postalCode, s.city, s.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

function avatarUrl(item) {
  return item?.avatar || item?.photo || item?.image || item?.imageUrl || ''
}

function initials(item) {
  const a = (item?.firstName || '').trim()
  const b = (item?.lastName || '').trim()
  if (a || b) return `${a.charAt(0)}${b.charAt(0)}`.toUpperCase()
  const email = (item?.email || '').trim()
  return email ? email.slice(0, 2).toUpperCase() : 'NA'
}

function colorFromSeed(seed) {
  const palette = ['#177a44','#2292cf','#8e24aa','#fb8c00','#e53935','#3949ab','#00897b','#6d4c41']
  let h = 0
  const s = String(seed || '')
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function avatarStyle(item) {
  const base = colorFromSeed(item?.email || `${item?.firstName}-${item?.lastName}`)
  const { r, g, b } = hexToRgb(base)
  const bg = `rgba(${r}, ${g}, ${b}, 0.15)`
  const border = `rgba(${r}, ${g}, ${b}, 0.35)`
  return {
    background: bg,
    color: base,
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 700,
    border: `1px solid ${border}`,
  }
}

function openDetails(item) {
  selected.value = item
  detailsDialog.value = true
}

const deleteDialog = ref(false)
const pendingDelete = ref(null)
const deleting = ref(false)

function askDelete(item) {
  pendingDelete.value = item
  deleteDialog.value = true
}

async function deleteConfirmed() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    const email = pendingDelete.value.email
    await api.delete(`/employees/${encodeURIComponent(email)}`)
    deleteDialog.value = false
    pendingDelete.value = null
    loadEmployees()
  } catch (e) {
    // optional: show error snackbar
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* Make embedded form look native inside dialog */
.dialog-form :deep(.v-container) {
  padding: 0 !important;
}
.dialog-form :deep(.v-card) {
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
}
.dialog-form :deep(.v-card-subtitle) {
  padding-left: 0;
  padding-right: 0;
}
.dialog-form :deep(.v-col) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.dialog-form :deep(.v-input) {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

/* Cards view styling */
.emp-card {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.emp-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.add-btn {
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.3) !important;
}
.avatar-fallback {
  font-size: 18px;
  letter-spacing: 0.5px;
}</style>
script>



