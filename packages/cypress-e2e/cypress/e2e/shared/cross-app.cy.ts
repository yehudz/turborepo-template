describe('Cross-App Integration', () => {
  it('should verify both apps are accessible', () => {
    // Visit docs app
    cy.visit(Cypress.env('DOCS_URL'))
    cy.contains('Click me').should('be.visible')
    
    // Visit web app
    cy.visit(Cypress.env('WEB_URL'))
    cy.contains('Click me').should('be.visible')
  })
})
