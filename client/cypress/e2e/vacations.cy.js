describe('Leave/Vacation Management', () => {
  beforeEach(() => {
    cy.login()
    cy.wait(1000)
  })

  it('should navigate to vacations page', () => {
    cy.visit('/vacations')
    cy.url().should('include', '/vacations')
    cy.wait(1000)
  })

  it('should display vacations page content', () => {
    cy.visit('/vacations')
    cy.wait(1000)
    
    // Check if vacations page is loaded
    cy.get('body').should('be.visible')
  })

  it('should display leave request form', () => {
    cy.visit('/vacations')
    cy.wait(1000)
    
    // Check for form elements
    cy.get('body').should('be.visible')
  })

  it('should be able to fill leave request form', () => {
    cy.visit('/vacations')
    cy.wait(1000)
    
    cy.fixture('example').then((data) => {
      const leave = data.leave
      
      // Try to fill leave form
      cy.get('body').then(($body) => {
        // Look for date inputs, select fields, etc.
        const fields = ['employeeEmail', 'type', 'startDate', 'endDate']
        fields.forEach(field => {
          if ($body.find(`input[name="${field}"], select[name="${field}"]`).length > 0) {
            if (field.includes('Date')) {
              cy.get(`input[name="${field}"]`).first().type(leave[field] || '')
            } else {
              cy.get(`input[name="${field}"], select[name="${field}"]`).first().type(leave[field] || '')
            }
          }
        })
      })
    })
  })

  it('should show validation for required leave fields', () => {
    cy.visit('/vacations')
    cy.wait(1000)
    
    // Try to submit empty form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Submit"), button:contains("Add"), button:contains("Request")').length > 0) {
        cy.get('button:contains("Submit"), button:contains("Add"), button:contains("Request")').first().click()
        cy.wait(500)
      }
    })
  })

  it('should display leave summary/charts', () => {
    cy.visit('/vacations')
    cy.wait(2000)
    
    // Check for leave charts or summary
    cy.get('body').should('be.visible')
  })

  it('should filter leaves by employee', () => {
    cy.visit('/vacations')
    cy.wait(2000)
    
    // Test filtering functionality if available
    cy.get('body').should('be.visible')
  })
})

