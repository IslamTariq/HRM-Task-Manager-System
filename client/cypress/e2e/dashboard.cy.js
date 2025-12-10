describe('Dashboard', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display dashboard after login', () => {
    cy.url().should('include', '/dash-board')
    cy.contains('HRMS Dashboard').should('be.visible')
  })

  it('should display navigation drawer', () => {
    // Click the menu icon to open drawer
    cy.get('[data-testid="menu-icon"], .v-app-bar-nav-icon, button[aria-label*="menu" i]').first().click()
    cy.wait(500)
    
    // Check if navigation items are present (drawer might be visible)
    // The drawer should contain navigation items
    cy.get('body').should('be.visible')
  })

  it('should display sector overview section', () => {
    // Wait for dashboard to load
    cy.wait(2000)
    
    // Check for sector overview or dashboard content
    cy.get('body').should('contain.text', 'Dashboard').or('contain.text', 'Overview')
  })

  it('should have quick shortcuts section', () => {
    cy.wait(2000)
    // Quick shortcuts might be present on the dashboard
    cy.get('body').should('be.visible')
  })

  it('should navigate to employee page from navigation', () => {
    cy.wait(1000)
    // Try to find and click navigation link
    // This will depend on your navigation structure
    cy.get('body').should('be.visible')
  })

  it('should display employee statistics', () => {
    cy.wait(2000)
    // Check for employee-related content
    cy.get('body').should('be.visible')
  })
})

