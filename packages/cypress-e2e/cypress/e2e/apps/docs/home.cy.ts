describe('Docs App - Home Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('DOCS_URL'))
  })

  it('should load the application', () => {
    cy.get('main').should('exist')
    cy.contains('Click me').should('be.visible')
  })
})
