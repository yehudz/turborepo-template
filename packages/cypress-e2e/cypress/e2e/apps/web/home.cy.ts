describe('Web App - Home Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('WEB_URL'))
  })

  it('should display the web app identifier', () => {
    cy.contains('web').should('be.visible')
  })

  it('should have the main Turborepo logo', () => {
    cy.get('svg[viewBox="0 0 506 50"]').should('be.visible')
  })

  it('should display all navigation links', () => {
    const expectedLinks = ['Docs', 'Learn', 'Templates', 'Deploy']
    
    expectedLinks.forEach((linkText) => {
      cy.contains(linkText).should('be.visible')
    })
  })

  it('should have working external links', () => {
    cy.get('a[href*="turborepo.com/docs"]')
      .should('have.attr', 'href')
      .and('include', 'turborepo.com/docs')
  })

  it('should have proper page structure', () => {
    cy.get('main').should('exist')
    cy.get('svg[viewBox="0 0 506 50"]').should('exist')
  })

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('main').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('main').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.get('main').should('be.visible')
  })
})