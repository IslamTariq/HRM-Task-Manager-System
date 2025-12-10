<template>
  <v-container class="py-6">
    <v-card class="pa-6 mx-auto" max-width="700">
      <v-card-subtitle class="text-h6 mb-3">
        Add New Employee
      </v-card-subtitle>

      <v-defaults-provider :defaults="compactDefaults"><v-form ref="employeeForm" v-model="valid" @submit.prevent="submitForm">
        <v-row dense>
          <!-- First Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.firstName"
              label="First Name *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Last Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.lastName"
              label="Last Name *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.email"
              label="Email *"
              type="email"
              :rules="[rules.required, rules.email]"
              clearable
            />
          </v-col>

          <!-- Phone -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.phone"
              label="Phone Number *"
              :rules="[rules.required, rules.phone]"
              clearable
            />
          </v-col>

          <!-- Department -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="employee.department"
              :items="departments"
              label="Department *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Role -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.role"
              label="Role/Position *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Contract Type -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="employee.contractType"
              :items="contractTypes"
              label="Type of Contract *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Joining Date -->
          <v-col cols="12" sm="6">
            <v-menu
              v-model="menu.joiningDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="employee.joiningDate"
                  label="Joining Date *"
                  readonly
                  v-bind="props"
                  clearable
                />
              </template>
              <v-date-picker
                v-model="rawDates.joiningDate"
                @update:modelValue="onDateSelected('joiningDate', $event, 'joiningDate')"
              />
            </v-menu>
          </v-col>

          <!-- Date of Birth -->
          <v-col cols="12" sm="6">
            <v-menu
              v-model="menu.dob"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="employee.dob"
                  label="Date of Birth *"
                  readonly
                  v-bind="props"
                  clearable
                />
              </template>
              <v-date-picker
                v-model="rawDates.dob"
                @update:modelValue="onDateSelected('dob', $event, 'dob')"
              />
            </v-menu>
          </v-col>

          <!-- Gender (Dropdown) -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="employee.gender"
              :items="genders"
              label="Gender *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Address Section -->
        <v-divider class="my-6"></v-divider>

        <v-card-subtitle class="text-h6 mb-3">
          Address Information
        </v-card-subtitle>

        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.street"
              label="Street *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.postalCode"
              label="Postal Code *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.city"
              label="City *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="employee.country"
              label="Country *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Status -->
          <v-col cols="12" sm="6">
            <v-switch
              v-model="employee.active"
              label="Active Status"
              color="success"
            />
          </v-col>
        </v-row>

        <!-- Submit Button -->
        <v-btn type="submit" color="primary" class="mt-6" block>
          Add Employee
        </v-btn>
      </v-form></v-defaults-provider>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
const emit = defineEmits(['created'])
import api from '@/api'
import uid from '@/utils/id'
const props = defineProps({ compact: { type: Boolean, default: false } })
const compactDefaults = computed(() =>
  props.compact
    ? {
        VTextField: { density: 'compact' },
        VSelect: { density: 'compact' },
        VTextarea: { density: 'compact', rows: 3 },
        VSwitch: { density: 'compact' },
        VBtn: { density: 'comfortable' },
      }
    : {}
)

const valid = ref(false)
const employeeForm = ref(null)

const menu = reactive({
  joiningDate: false,
  dob: false,
})

const rawDates = reactive({
  joiningDate: null,
  dob: null,
})

const employee = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: null,
  role: '',
  contractType: null,
  joiningDate: '',
  dob: '',
  gender: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  active: true,
})

const departments = ref(['Education', 'Healthcare', 'Childcare', 'Cleaning'])
const contractTypes = ['Full-time', 'Part-time', 'Internship', 'Temporary']
const genders = ['Male', 'Female', 'Other']

const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  phone: (v) => /^\+?\d{7,15}$/.test(v) || 'Phone must be valid (7–15 digits)',
}

const onDateSelected = (field, value, menuKey) => {
  if (!value) return
  employee[field] = new Date(value).toISOString().split('T')[0]
  rawDates[menuKey] = value
  menu[menuKey] = false
}

onMounted(async () => {
  try {
    const resp = await api.get('/departments')
    if (Array.isArray(resp.data)) {
      const list = resp.data.map((d) => d.name).filter(Boolean)
      if (list.length) departments.value = list
    }
  } catch (e) {
    // keep defaults on error
  }
})

const submitForm = async () => {
  if (!employeeForm.value.validate()) return
  try {
    await api.post('/employees', { id: uid('emp'), ...employee })
    alert(`Employee ${employee.firstName} ${employee.lastName} added successfully!`)
    emit('created', { email: employee.email })
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add employee.'
    alert(msg)
  }
}
</script>

<script>
export default {
  name: 'AddEmployeDetails',
}
</script>

<style scoped>
.v-card {
  border-radius: 14px;
}
</style>


