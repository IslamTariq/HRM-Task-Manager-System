describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display login page with form elements', () => {
    // Check if login page elements are visible
    cy.contains('Sign in to Your HRMS Portal').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('button', 'Login').should('be.visible')
  })

  it('should show validation errors for empty fields', () => {
    // Try to submit without filling fields
    cy.contains('button', 'Login').click()
    
    // Check for validation messages (Vuetify shows "Required.")
    cy.contains('Required').should('be.visible')
  })

  it('should show email validation error for invalid email', () => {
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.contains('button', 'Login').click()
    
    // Check for email validation error
    cy.contains('Invalid email').should('be.visible')
  })

  it('should navigate to dashboard on successful login', () => {
    // Fill in valid credentials
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    
    // Click login button
    cy.contains('button', 'Login').click()
    
    // Should navigate to dashboard
    cy.url().should('include', '/dash-board')
    cy.wait(1000)
    
    // Check if dashboard elements are visible
    cy.contains('HRMS Dashboard').should('be.visible')
  })

  it('should display logo on login page', () => {
    cy.get('img[alt="HRM Logo"]').should('be.visible')
  })
})

