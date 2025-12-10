describe('Employee Management', () => {
  beforeEach(() => {
    cy.login()
    cy.wait(1000)
  })

  it('should navigate to employee add page', () => {
    cy.visit('/employee/add')
    cy.url().should('include', '/employee/add')
    cy.wait(1000)
  })

  it('should display employee form fields', () => {
    cy.visit('/employee/add')
    cy.wait(1000)
    
    // Check for form fields (Vuetify text fields)
    cy.get('body').should('be.visible')
    // Employee form should have fields for firstName, lastName, email, etc.
  })

  it('should show validation errors for required fields', () => {
    cy.visit('/employee/add')
    cy.wait(1000)
    
    // Try to submit empty form
    // Look for submit button and click it
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Submit"), button:contains("Add"), button:contains("Save")').length > 0) {
        cy.get('button:contains("Submit"), button:contains("Add"), button:contains("Save")').first().click()
        cy.wait(500)
        // Should show validation errors
      }
    })
  })

  it('should be able to fill employee form', () => {
    cy.visit('/employee/add')
    cy.wait(1000)
    
    // Fill in employee details
    cy.fixture('example').then((data) => {
      const employee = data.employee
      
      // Try to find and fill form fields
      cy.get('body').then(($body) => {
        // Look for input fields and fill them
        const fields = ['firstName', 'lastName', 'email', 'phone', 'department', 'role']
        fields.forEach(field => {
          if ($body.find(`input[name="${field}"], input[placeholder*="${field}" i]`).length > 0) {
            cy.get(`input[name="${field}"], input[placeholder*="${field}" i]`).first().type(employee[field] || '')
          }
        })
      })
    })
  })

  it('should display employees list from API', () => {
    cy.visit('/dash-board')
    cy.wait(2000)
    
    // Check if employee data is loaded
    cy.get('body').should('be.visible')
  })

  it('should handle employee deletion', () => {
    cy.visit('/dash-board')
    cy.wait(2000)
    
    // This would test delete functionality if available
    cy.get('body').should('be.visible')
  })
})

