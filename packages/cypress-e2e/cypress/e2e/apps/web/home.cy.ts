describe('Web App - Home Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('WEB_URL'))
  })

  it('should load the application', () => {
    cy.get('main').should('exist')
    cy.contains('Click me').should('be.visible')
  })
})
