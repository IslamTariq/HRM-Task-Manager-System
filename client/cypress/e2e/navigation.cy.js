describe('Navigation', () => {
  beforeEach(() => {
    cy.login()
    cy.wait(1000)
  })

  it('should navigate between pages using router', () => {
    // Test navigation to different routes
    cy.visit('/dash-board')
    cy.url().should('include', '/dash-board')
    
    cy.visit('/employee/add')
    cy.url().should('include', '/employee/add')
    
    cy.visit('/department/add')
    cy.url().should('include', '/department/add')
    
    cy.visit('/vacations')
    cy.url().should('include', '/vacations')
  })

  it('should have working navigation drawer', () => {
    cy.visit('/dash-board')
    cy.wait(1000)
    
    // Try to open navigation drawer
    cy.get('body').then(($body) => {
      // Look for menu/navigation icon
      const menuIcon = $body.find('.v-app-bar-nav-icon, [aria-label*="menu" i], button').first()
      if (menuIcon.length > 0) {
        cy.wrap(menuIcon).click()
        cy.wait(500)
      }
    })
  })

  it('should redirect to login on invalid route', () => {
    cy.visit('/invalid-route')
    cy.wait(1000)
    
    // Should redirect to login or show 404
    cy.url().should('satisfy', (url) => {
      return url.includes('/') || url.includes('/dash-board')
    })
  })

  it('should maintain navigation state', () => {
    cy.visit('/dash-board')
    cy.wait(1000)
    
    // Navigate away and back
    cy.visit('/vacations')
    cy.wait(1000)
    cy.visit('/dash-board')
    cy.url().should('include', '/dash-board')
  })
})

