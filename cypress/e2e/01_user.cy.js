/**
 * Module: User — Register & Login
 * Covers: TC-USR-001 to TC-USR-006
 */

import testData from '../fixtures/testData.json'

const { newUser, customer, wrongCredentials } = testData.users

describe('User — Register & Login', () => {

  // ─── TC-USR-001: Successful Registration ───────────────────────────────────
  it('TC-USR-001 | registers a new user with valid data', () => {
    cy.visit('/#/auth/register')

    cy.get('[data-test="first-name"]').type(newUser.firstName)
    cy.get('[data-test="last-name"]').type(newUser.lastName)
    cy.get('[data-test="dob"]').type(newUser.dob)
    cy.get('[data-test="address"]').type(newUser.address)
    cy.get('[data-test="city"]').type(newUser.city)
    cy.get('[data-test="state"]').type(newUser.state)
    cy.get('[data-test="country"]').select(newUser.country)
    cy.get('[data-test="postcode"]').type(newUser.postcode)
    cy.get('[data-test="phone"]').type(newUser.phone)
    cy.get('[data-test="email"]').type(newUser.email)
    cy.get('[data-test="password"]').type(newUser.password)

    cy.get('[data-test="register-submit"]').click()

    // Should land on login page with success message
    cy.url().should('include', '/auth/login')
    cy.get('[data-test="alert-success"], .alert-success')
      .should('be.visible')
      .and('contain.text', 'registered')
  })

  // ─── TC-USR-002: Duplicate Email ───────────────────────────────────────────
  it('TC-USR-002 | shows error when registering with an already used email', () => {
    cy.visit('/#/auth/register')

    cy.get('[data-test="first-name"]').type(newUser.firstName)
    cy.get('[data-test="last-name"]').type(newUser.lastName)
    cy.get('[data-test="dob"]').type(newUser.dob)
    cy.get('[data-test="address"]').type(newUser.address)
    cy.get('[data-test="city"]').type(newUser.city)
    cy.get('[data-test="state"]').type(newUser.state)
    cy.get('[data-test="country"]').select(newUser.country)
    cy.get('[data-test="postcode"]').type(newUser.postcode)
    cy.get('[data-test="phone"]').type(newUser.phone)
    cy.get('[data-test="email"]').type(customer.email) // already registered email
    cy.get('[data-test="password"]').type(newUser.password)

    cy.get('[data-test="register-submit"]').click()

    cy.get('[data-test="alert-danger"], .alert-danger, [data-test="register-error"]')
      .should('be.visible')
      .and('contain.text', 'already exists')
  })

  // ─── TC-USR-003: Required Field Validation ─────────────────────────────────
  it('TC-USR-003 | shows validation errors when all required fields are empty', () => {
    cy.visit('/#/auth/register')

    cy.get('[data-test="register-submit"]').click()

    // At minimum, email and password should show errors
    cy.get('[data-test="email-error"], #email + .invalid-feedback, [data-test="first-name-error"]')
      .should('be.visible')
  })

  // ─── TC-USR-004: Successful Login ──────────────────────────────────────────
  it('TC-USR-004 | logs in successfully with valid credentials', () => {
    cy.visit('/#/auth/login')

    cy.get('[data-test="email"]').type(customer.email)
    cy.get('[data-test="password"]').type(customer.password)
    cy.get('[data-test="login-submit"]').click()

    // User menu should appear in the navbar
    cy.get('[data-test="nav-menu"]').should('be.visible')
    cy.url().should('not.include', '/auth/login')
  })

  // ─── TC-USR-005: Invalid Password ──────────────────────────────────────────
  it('TC-USR-005 | shows error message when login with wrong password', () => {
    cy.visit('/#/auth/login')

    cy.get('[data-test="email"]').type(wrongCredentials.email)
    cy.get('[data-test="password"]').type(wrongCredentials.password)
    cy.get('[data-test="login-submit"]').click()

    cy.get('[data-test="alert-danger"], .alert-danger, [data-test="login-error"]')
      .should('be.visible')
      .and('contain.text', 'Invalid')

    cy.url().should('include', '/auth/login')
  })

  // ─── TC-USR-006: Logout ─────────────────────────────────────────────────────
  it('TC-USR-006 | logs out and protects account page', () => {
    cy.login(customer.email, customer.password)

    // Open nav menu and sign out
    cy.get('[data-test="nav-menu"]').click()
    cy.get('[data-test="nav-sign-out"]').click()

    // Login link should be visible again
    cy.get('[data-test="nav-sign-in"]').should('be.visible')

    // Navigating to account should redirect to login
    cy.visit('/#/account')
    cy.url().should('include', '/auth/login')
  })

})
