// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to login to the HRMS application
 * @example cy.login()
 */
Cypress.Commands.add('login', () => {
  cy.visit('/')
  cy.get('input[type="email"]').type('test@example.com')
  cy.get('input[type="password"]').type('password123')
  cy.contains('button', 'Login').click()
  cy.url().should('include', '/dash-board')
  cy.wait(1000) // Wait for page to load
})

/**
 * Custom command to navigate to a specific route
 * @example cy.navigateTo('/employee/add')
 */
Cypress.Commands.add('navigateTo', (route) => {
  cy.visit(route)
  cy.wait(500)
})

/**
 * Custom command to wait for API calls to complete
 */
Cypress.Commands.add('waitForApi', () => {
  cy.wait(1000) // Wait for API calls to complete
})

