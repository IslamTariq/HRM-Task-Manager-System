<template>
  <v-container class="fill-height d-flex justify-center align-center login-container">
    <v-card 
      width="450" 
      elevation="8"
      class="login-card"
      rounded="xl"
    >
      <div class="login-header">
        <div class="logo-container">
          <img :src="logo" alt="HRM Logo" class="logo"/>
        </div>
        <v-card-title class="text-h5 font-weight-bold text-center justify-center pa-4">
          Welcome Back
        </v-card-title>
        <v-card-subtitle class="text-center pb-4">
          Sign in to your HRMS Portal
        </v-card-subtitle>
      </div>

      <v-card-text class="pa-6">
        <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email Address"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            required
            variant="outlined"
            class="mb-3"
            autofocus
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[rules.required]"
            required
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <div class="d-flex justify-end mb-4">
            <v-btn variant="text" size="small" color="primary">
              Forgot Password?
            </v-btn>
          </div>

          <v-btn 
            type="submit" 
            color="primary" 
            size="large"
            class="mt-2 login-button" 
            block
            :loading="loading"
            :disabled="!valid"
          >
            <v-icon start>mdi-login</v-icon>
            Sign In
          </v-btn>

          <v-alert
            v-if="error"
            type="error"
            class="mt-4"
            variant="tonal"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <span class="text-caption text-medium-emphasis">
          Don't have an account? 
          <v-btn variant="text" size="small" color="primary">Contact Admin</v-btn>
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import Logo from '@/assets/images/Logo.avif';
import router from '@/router';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const valid = ref(false);
    const loading = ref(false);
    const showPassword = ref(false);
    const logo = Logo

    const rules = {
      required: (value) => !!value || 'This field is required.',
      email: (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'Please enter a valid email address.';
      },
    };

    const handleLogin = async () => {
      if (!valid.value) return;
      
      loading.value = true;
      error.value = '';
      
      // Simulate API call
      setTimeout(() => {
        if (email.value === 'admin@example.com' && password.value === 'password') {
          error.value = '';
          router.push('/dash-board');
        } else {
          error.value = 'Invalid email or password. Please try again.';
        }
        loading.value = false;
      }, 1000);
    };

    return { 
      email, 
      password, 
      error, 
      rules, 
      valid, 
      logo, 
      handleLogin,
      loading,
      showPassword
    };
  },
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: move 20s linear infinite;
}

@keyframes move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.login-card {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98) !important;
}

.login-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  padding: 2rem 1rem 1rem;
  border-radius: 24px 24px 0 0;
  margin: -1px -1px 0 -1px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  max-width: 180px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.login-button {
  height: 48px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
}

:deep(.v-card-title) {
  color: white !important;
}

:deep(.v-card-subtitle) {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>
