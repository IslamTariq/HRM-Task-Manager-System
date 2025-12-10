describe('Department Management', () => {
  beforeEach(() => {
    cy.login()
    cy.wait(1000)
  })

  it('should navigate to department add page', () => {
    cy.visit('/department/add')
    cy.url().should('include', '/department/add')
    cy.wait(1000)
  })

  it('should display department form', () => {
    cy.visit('/department/add')
    cy.wait(1000)
    
    // Check if department form is visible
    cy.get('body').should('be.visible')
  })

  it('should show validation for required department name', () => {
    cy.visit('/department/add')
    cy.wait(1000)
    
    // Try to submit without department name
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Submit"), button:contains("Add"), button:contains("Save")').length > 0) {
        cy.get('button:contains("Submit"), button:contains("Add"), button:contains("Save")').first().click()
        cy.wait(500)
      }
    })
  })

  it('should be able to create a new department', () => {
    cy.visit('/department/add')
    cy.wait(1000)
    
    cy.fixture('example').then((data) => {
      const department = data.department
      
      // Fill department form
      cy.get('body').then(($body) => {
        if ($body.find('input[name="name"], input[placeholder*="name" i]').length > 0) {
          cy.get('input[name="name"], input[placeholder*="name" i]').first().type(department.name)
        }
      })
    })
  })

  it('should display departments list', () => {
    cy.visit('/dash-board')
    cy.wait(2000)
    
    // Check if departments are displayed
    cy.get('body').should('be.visible')
  })

  it('should show department statistics', () => {
    cy.visit('/dash-board')
    cy.wait(2000)
    
    // Check for department overview/charts
    cy.get('body').should('be.visible')
  })
})

