<template>
  <v-container class="py-6">
    <v-card class="pa-6 mx-auto" max-width="700">
      <v-card-subtitle class="text-h6 mb-3">
        Add New Department
      </v-card-subtitle>

      <v-form ref="departmentForm" v-model="valid" @submit.prevent="submitForm">
        <v-row dense>
          <!-- Department Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="department.name"
              label="Department Name *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Department Head -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="department.head"
              label="Department Head *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Department Type / Category -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="department.type"
              :items="departmentTypes"
              label="Department Type *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Location -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="department.location"
              label="Location *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Phone / Extension -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="department.phone"
              label="Phone / Extension *"
              :rules="[rules.required]"
              clearable
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="department.email"
              label="Email *"
              :rules="[rules.required, rules.email]"
              clearable
            />
          </v-col>

          <!-- Description / Notes -->
          <v-col cols="12">
            <v-textarea
              v-model="department.description"
              label="Description / Notes *"
              :rules="[rules.required]"
              rows="3"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Submit Button -->
        <v-btn type="submit" color="primary" class="mt-4" block>
          Add Department
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api'
const emit = defineEmits(['created'])

const valid = ref(false)
const departmentForm = ref(null)

const department = reactive({
  name: '',
  head: '',
  type: null,
  location: '',
  phone: '',
  email: '',
  description: '',
})

const departmentTypes = ['Education', 'Healthcare', 'Childcare', 'Cleaning', 'Admin', 'IT', 'Other']

const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
}

import uid from '@/utils/id'

const submitForm = async () => {
  if (!departmentForm.value.validate()) return
  try {
    const payload = {
      id: uid('dept'),
      name: department.name,
      head: department.head || undefined,
      type: department.type || undefined,
      location: department.location || undefined,
      phone: department.phone || undefined,
      email: department.email || undefined,
      description: department.description || undefined,
    }
    await api.post('/departments', payload)
    alert(`Department "${department.name}" added successfully!`)
    emit('created', payload)
    Object.keys(department).forEach((key) => (department[key] = key === 'type' ? null : ''))
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add department.'
    alert(msg)
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 14px;
}
</style>
