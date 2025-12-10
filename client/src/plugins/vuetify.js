// src/plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

import 'vuetify/styles'                       // global Vuetify CSS
import '@mdi/font/css/materialdesignicons.css'  // optional icon font

export default createVuetify({
  components: { ...components, ...labs },
  directives,
  defaults: {
    VTextField: { variant: 'outlined' },
    VSelect: { variant: 'outlined' },
    VTextarea: { variant: 'outlined' },
    VAutocomplete: { variant: 'outlined' },
    VCombobox: { variant: 'outlined' },
    VFileInput: { variant: 'outlined' },
  },
  theme: {
    defaultTheme: 'light',
    // optionally define themes
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#177a44',
          secondary: '#2292cf',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  // icons config, locale, etc.
})
