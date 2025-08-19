#!/usr/bin/env node

import { createApp } from '../src/index.js'

createApp().catch((error) => {
  console.error('❌ Error creating app:', error.message)
  process.exit(1)
})