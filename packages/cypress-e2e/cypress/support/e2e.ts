// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and behavior
// that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Cypress Test Runner configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on unhandled promise rejections
  // or other uncaught exceptions that might occur in Next.js apps
  return false
})