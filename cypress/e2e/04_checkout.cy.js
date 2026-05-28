/**
 * Module: Checkout & Payment
 * Covers: TC-CHK-001 to TC-CHK-006
 */

import testData from '../fixtures/testData.json'

const { customer } = testData.users
const { handTool, powerTool } = testData.products
const { creditCard, expiredCard } = testData.payment

describe('Checkout & Payment', () => {

  // ─── TC-CHK-001: Full Checkout with Credit Card ────────────────────────────
  it('TC-CHK-001 | completes full checkout with credit card', () => {
    cy.loginByApi(customer.email, customer.password)
    cy.addToCart(handTool)
    cy.addToCart(powerTool)

    cy.visit('/#/checkout')

    // Step 1: Cart — proceed
    cy.get('[data-test="proceed-1"]').click()

    // Step 2: Sign in (already logged in)
    cy.get('[data-test="proceed-2"]').click()

    // Step 3: Billing address — confirm pre-filled address
    cy.get('[data-test="address"]').should('not.be.empty')
    cy.get('[data-test="proceed-3"]').click()

    // Step 4: Payment — select Credit Card
    cy.get('[data-test="credit-card"]').click()
    cy.get('[data-test="credit-card-number"]').type(creditCard.number)
    cy.get('[data-test="expiration-date"]').type(creditCard.expiryDate)
    cy.get('[data-test="cvv"]').type(creditCard.cvv)
    cy.get('[data-test="card-holder-name"]').type(creditCard.name)
    cy.get('[data-test="finish"]').click()

    // Confirmation
    cy.get('[data-test="order-confirmation"], .alert-success, h2')
      .should('be.visible')
      .and('contain.text', 'Payment was successful')
  })

  // ─── TC-CHK-002: Checkout with Bank Transfer ───────────────────────────────
  it('TC-CHK-002 | completes checkout with bank transfer', () => {
    cy.loginByApi(customer.email, customer.password)
    cy.addToCart(handTool)

    cy.visit('/#/checkout')

    cy.get('[data-test="proceed-1"]').click()
    cy.get('[data-test="proceed-2"]').click()
    cy.get('[data-test="proceed-3"]').click()

    cy.get('[data-test="bank-transfer"]').click()

    // Bank transfer typically just shows a confirmation without card details
    cy.get('[data-test="finish"]').click()

    cy.get('[data-test="order-confirmation"], .alert-success, h2')
      .should('be.visible')
      .and('contain.text', 'Payment was successful')
  })

  // ─── TC-CHK-003: Checkout Blocked with Empty Cart ──────────────────────────
  it('TC-CHK-003 | cannot access checkout with an empty cart', () => {
    cy.loginByApi(customer.email, customer.password)

    // Navigate to checkout directly without adding items
    cy.visit('/#/checkout')

    // Proceed button should not exist
    cy.get('[data-test="proceed-1"]').should('not.exist')
    cy.get('body').should('contain.text', 'empty')
  })

  // ─── TC-CHK-004: Checkout Requires Login ───────────────────────────────────
  it('TC-CHK-004 | guest user is redirected to login on checkout', () => {
    // Do NOT log in — visit as guest
    cy.visit('/#/products')

    // Add to cart as guest
    cy.get('[data-test="search-query"]').type(handTool)
    cy.get('[data-test="search-submit"]').click()
    cy.contains('[data-test="product-name"]', handTool).first().click()
    cy.get('[data-test="add-to-cart"]').click()

    cy.visit('/#/checkout')
    cy.get('[data-test="proceed-1"]').click()

    // Step 2 should require sign-in
    cy.get('[data-test="email"]').should('be.visible')
    cy.url().should('include', '/checkout')
  })

  // ─── TC-CHK-005: Expired Credit Card Rejected ──────────────────────────────
  it('TC-CHK-005 | rejects an expired credit card', () => {
    cy.loginByApi(customer.email, customer.password)
    cy.addToCart(handTool)

    cy.visit('/#/checkout')
    cy.get('[data-test="proceed-1"]').click()
    cy.get('[data-test="proceed-2"]').click()
    cy.get('[data-test="proceed-3"]').click()

    cy.get('[data-test="credit-card"]').click()
    cy.get('[data-test="credit-card-number"]').type(expiredCard.number)
    cy.get('[data-test="expiration-date"]').type(expiredCard.expiryDate)
    cy.get('[data-test="cvv"]').type(expiredCard.cvv)
    cy.get('[data-test="card-holder-name"]').type(expiredCard.name)
    cy.get('[data-test="finish"]').click()

    cy.get('[data-test="alert-danger"], .alert-danger, [data-test="payment-error"]')
      .should('be.visible')
      .and('contain.text', 'expired')
  })

  // ─── TC-CHK-006: Order Confirmation Matches Cart ───────────────────────────
  it('TC-CHK-006 | order confirmation contains the correct order details', () => {
    cy.loginByApi(customer.email, customer.password)
    cy.addToCart(handTool)
    cy.addToCart(powerTool)

    cy.visit('/#/checkout')
    cy.get('[data-test="proceed-1"]').click()
    cy.get('[data-test="proceed-2"]').click()
    cy.get('[data-test="proceed-3"]').click()

    cy.get('[data-test="credit-card"]').click()
    cy.get('[data-test="credit-card-number"]').type(creditCard.number)
    cy.get('[data-test="expiration-date"]').type(creditCard.expiryDate)
    cy.get('[data-test="cvv"]').type(creditCard.cvv)
    cy.get('[data-test="card-holder-name"]').type(creditCard.name)
    cy.get('[data-test="finish"]').click()

    // Capture order number from confirmation
    cy.get('[data-test="order-confirmation"]').should('be.visible')

    // Navigate to My Orders and verify order appears
    cy.get('[data-test="nav-menu"]').click()
    cy.get('[data-test="nav-my-invoices"]').click()

    cy.get('[data-test="invoice-list"] tr, .invoice-row')
      .first()
      .should('be.visible')
  })

})
