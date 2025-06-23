describe('Cross-App Integration', () => {
  it('should verify both apps are accessible', () => {
    // Visit docs app
    cy.visit(Cypress.env('DOCS_URL'))
    cy.contains('docs').should('be.visible')
    
    // Visit web app
    cy.visit(Cypress.env('WEB_URL'))
    cy.contains('web').should('be.visible')
  })

  it('should have consistent UI components across apps', () => {
    const checkCommonElements = () => {
      cy.get('svg[viewBox="0 0 506 50"]').should('be.visible') // Turborepo logo
      cy.contains('Docs').should('be.visible')
      cy.contains('Learn').should('be.visible')
      cy.contains('Templates').should('be.visible')
      cy.contains('Deploy').should('be.visible')
    }

    // Check docs app
    cy.visit(Cypress.env('DOCS_URL'))
    checkCommonElements()
    
    // Check web app
    cy.visit(Cypress.env('WEB_URL'))
    checkCommonElements()
  })

  it('should have consistent styling across apps', () => {
    const checkStyling = () => {
      cy.get('main').should('have.class', 'flex')
      cy.get('main').should('have.class', 'flex-col')
      cy.get('main').should('have.class', 'min-h-screen')
    }

    // Check docs app styling
    cy.visit(Cypress.env('DOCS_URL'))
    checkStyling()
    
    // Check web app styling
    cy.visit(Cypress.env('WEB_URL'))
    checkStyling()
  })
})