/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit app with error handling
       * @example cy.visitApp('web')
       */
      visitApp(app: 'web' | 'docs'): Chainable<Element>
      
      /**
       * Custom command to check responsive design
       * @example cy.checkResponsive()
       */
      checkResponsive(): Chainable<Element>
    }
  }
}

Cypress.Commands.add('visitApp', (app: 'web' | 'docs') => {
  const url = app === 'web' ? Cypress.env('WEB_URL') : Cypress.env('DOCS_URL')
  cy.visit(url, {
    failOnStatusCode: false,
    timeout: 10000
  })
})

Cypress.Commands.add('checkResponsive', () => {
  const viewports = [
    { width: 375, height: 667 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1280, height: 720 }   // Desktop
  ]
  
  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height)
    cy.get('main').should('be.visible')
  })
})

export {}