<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="7">
        <VacationChart />
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-4">
          <v-card-title class="text-h6">Register Leave</v-card-title>
          <v-card-text>
            <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
              <v-autocomplete
                v-model="form.employeeEmail"
                :items="employeeOptions"
                item-title="label"
                item-value="email"
                label="Employee (search name, email, phone, DOB)"
                clearable
                :custom-filter="employeeFilter"
                :disabled="loadingEmployees"
                :loading="loadingEmployees"
                hint="Type to search: e.g., name, email, +47..., or 1988-04-12"
                persistent-hint
                required
              />
              <v-row v-if="summary" class="mt-2" dense>
  <v-col cols="12">
    <div class="text-caption text-medium-emphasis mb-1">Annual leave summary ({{ summary.year }})</div>
  </v-col>
  <v-col cols="12" sm="6">
    <v-chip variant="tonal" color="primary" class="mr-2" label>
      Paid holiday: {{ used('paid_holiday') }}/{{ cap('paid_holiday') }} used | left {{ left('paid_holiday') }}
    </v-chip>
  </v-col>
  <v-col cols="12" sm="6">
    <v-chip variant="tonal" color="warning" class="mr-2" label>
      Sick leave: {{ used('sick') }}/{{ cap('sick') }} used | left {{ left('sick') }}
    </v-chip>
  </v-col>
  <v-col cols="12">
    <v-chip variant="tonal" color="secondary" label>
      Doctor sick leave: {{ used('doctor_sick') }} used | cap {{ cap('doctor_sick') }}
    </v-chip>
  </v-col>
</v-row>
              <v-select v-model="form.type" :items="typeOptions" label="Leave Type" required />

              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="320"
                min-width="320"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="dateLabel"
                    label="Leave Dates (start to end)"
                    readonly
                    v-bind="props"
                    required
                  />
                </template>
                <v-date-picker
                  v-model="dateRange"
                  multiple="range"
                  @update:modelValue="onDateRange"
                />
              </v-menu>
              <v-textarea v-model="form.comment" label="Comment" rows="2" />
              <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
              <v-alert v-if="success" type="success" class="mt-2">{{ success }}</v-alert>
              <v-btn color="primary" type="submit" class="mt-3" :loading="loading" block>Submit</v-btn>
            </v-form>

            
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import VacationChart from '@/components/VacationChart.vue'
import api from '@/api'

const valid = ref(false)
const formRef = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
// removed recent leaves table
const employees = ref([])
const loadingEmployees = ref(false)
const summary = ref(null)
const loadingSummary = ref(false)

const typeOptions = [
  { title: 'Paid Holiday (25/year)', value: 'paid_holiday' },
  { title: 'Sick Leave (12/year)', value: 'sick' },
  { title: 'Doctor Certified Sick Leave', value: 'doctor_sick' },
  { title: 'Unpaid Leave', value: 'unpaid' },
  { title: 'Parental Leave', value: 'parental' },
]

const form = ref({ employeeEmail: '', type: null, startDate: '', endDate: '', comment: '' })
const dateMenu = ref(false)
const dateRange = ref([]) // holds range selection from picker
const dateLabel = computed(() => {
  const s = formatDate(form.value.startDate)
  const e = formatDate(form.value.endDate)
  if (s && e) return `${s} -> ${e}`
  return ''
})

function onDateRange(val) {
  let start, end
  if (Array.isArray(val)) {
    const normalized = val.filter(Boolean).map(d => formatDate(d)).filter(Boolean).sort()
    start = normalized[0]
    end = normalized.length >= 2 ? normalized[normalized.length - 1] : undefined
  } else if (val && typeof val === 'object') {
    start = formatDate(val.start)
    end = formatDate(val.end)
  }
  if (start && end) {
    form.value.startDate = start
    form.value.endDate = end
    dateMenu.value = true
    requestAnimationFrame(() => (dateMenu.value = false))
  } else if (start) {
    form.value.startDate = start
    form.value.endDate = ''
  } else {
    form.value.startDate = ''
    form.value.endDate = ''
  }
}

function formatDate(v) {
  if (!v) return ''
  // If Date instance
  if (Object.prototype.toString.call(v) === '[object Date]') {
    if (isNaN(v.getTime())) return ''
    return v.toISOString().split('T')[0]
  }
  // If already YYYY-MM-DD
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v
  // Try to parse string date
  const d = new Date(v)
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  return ''
}

// Recent leaves section removed
onMounted(loadEmployees)
watch(() => form.value.employeeEmail, async (email) => {
  await loadSummary(email)
})

async function submit() {
  error.value = ''
  success.value = ''
  if (!formRef.value?.validate()) return
  try {
    loading.value = true
    const payload = { ...form.value }
    const resp = await api.post('/leaves', payload)
    success.value = `Leave registered for ${resp.data.employeeEmail} (${resp.data.type})`
    await loadSummary(form.value.employeeEmail)
    // keep the email for next entry, clear the rest
    form.value.type = null
    form.value.startDate = ''
    form.value.endDate = ''
    form.value.comment = ''
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to register leave.'
  } finally {
    loading.value = false
  }
}

async function loadEmployees() {
  loadingEmployees.value = true
  try {
    const resp = await api.get('/employees')
    employees.value = Array.isArray(resp.data) ? resp.data : []
  } catch (e) {
    employees.value = []
  } finally {
    loadingEmployees.value = false
  }
}

const employeeOptions = computed(() => {
  return employees.value.map(e => ({
    email: e.email,
    label: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.email,
    phone: e.phone || '',
    dob: e.dob || '',
    searchBlob: `${(e.firstName||'')} ${(e.lastName||'')} ${e.email||''} ${(e.phone||'')} ${(e.dob||'')}`.toLowerCase(),
  }))
})

function employeeFilter(value, query, item) {
  // Vuetify signature: (value, query, item)
  if (!query) return true
  const q = String(query).toLowerCase().trim()
  const phoneDigits = q.replace(/\D+/g, '')
  const blob = (item && item.searchBlob) ? String(item.searchBlob).toLowerCase() : ''
  // Match against combined blob (name, email, phone, dob)
  if (blob.includes(q)) return true
  // Explicit phone match by digits
  if (phoneDigits && (item?.phone || '').replace(/\D+/g, '').includes(phoneDigits)) return true
  // DOB match (YYYY-MM-DD)
  if ((item?.dob || '').toLowerCase().includes(q)) return true
  // Fallback to title value
  if ((value || '').toString().toLowerCase().includes(q)) return true
  return false
}

async function loadSummary(email) {
  summary.value = null
  if (!email) return
  loadingSummary.value = true
  try {
    const y = new Date().getFullYear()
    const resp = await api.get('/leaves/summary', { params: { employeeEmail: email, year: y } })
    summary.value = resp.data
  } catch (e) {
    summary.value = null
  } finally {
    loadingSummary.value = false
  }
}

function used(type) {
  if (!summary.value) return 0
  return Number(summary.value.totals?.[type] || 0)
}

function cap(type) {
  if (!summary.value) return 'â€”'
  const capDays = summary.value.policies?.[type]?.annualDays
  return capDays ? String(capDays) : 'â€”'
}

function left(type) {
  const c = summary.value?.policies?.[type]?.annualDays
  if (!c) return 'â€”'
  const u = used(type)
  return Math.max(0, c - u)
}
</script>













