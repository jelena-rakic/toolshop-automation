/**
 * Module: Cart
 * Covers: TC-CRT-001 to TC-CRT-005
 */

import testData from '../fixtures/testData.json'

const { customer } = testData.users
const { handTool, powerTool } = testData.products

describe('Cart', () => {

  beforeEach(() => {
    cy.loginByApi(customer.email, customer.password)
    cy.visit('/#/products')
  })

  // ─── TC-CRT-001: Add Two Products from Different Categories ────────────────
  it('TC-CRT-001 | adds products from two different categories to the cart', () => {
    // Add Hand Tool
    cy.addToCart(handTool)

    // Add Power Tool
    cy.addToCart(powerTool)

    // Open cart and verify both products are listed
    cy.visit('/#/checkout')
    cy.get('[data-test="product-title"]').should('have.length', 2)
    cy.get('[data-test="product-title"]').should('contain.text', handTool)
    cy.get('[data-test="product-title"]').should('contain.text', powerTool)
  })

  // ─── TC-CRT-002: Update Quantity ───────────────────────────────────────────
  it('TC-CRT-002 | recalculates line total when quantity is increased', () => {
    cy.addToCart(handTool)
    cy.visit('/#/checkout')

    // Get unit price before changing quantity
    cy.get('[data-test="product-price"]')
      .first()
      .invoke('text')
      .then((text) => {
        const unitPrice = parseFloat(text.replace(/[^0-9.]/g, ''))

        // Increase quantity to 3
        cy.get('[data-test="product-quantity"]').first().clear().type('3')
        cy.get('[data-test="update-quantity"]').first().click()

        // Verify line total = unitPrice * 3
        cy.get('[data-test="line-price"]')
          .first()
          .invoke('text')
          .then((lineText) => {
            const lineTotal = parseFloat(lineText.replace(/[^0-9.]/g, ''))
            expect(lineTotal).to.be.closeTo(unitPrice * 3, 0.01)
          })
      })
  })

  // ─── TC-CRT-003: Remove Product from Cart ──────────────────────────────────
  it('TC-CRT-003 | removes a product from the cart', () => {
    cy.addToCart(handTool)
    cy.addToCart(powerTool)
    cy.visit('/#/checkout')

    cy.get('[data-test="product-title"]').should('have.length', 2)

    // Remove first item
    cy.get('[data-test="delete-product"]').first().click()

    cy.get('[data-test="product-title"]').should('have.length', 1)

    // Cart counter in navbar should update to 1
    cy.get('[data-test="cart-quantity"]').should('contain.text', '1')
  })

  // ─── TC-CRT-004: Cart Persists After Page Refresh ──────────────────────────
  it('TC-CRT-004 | cart contents persist after page refresh', () => {
    cy.addToCart(handTool)
    cy.addToCart(powerTool)

    cy.reload()

    cy.visit('/#/checkout')
    cy.get('[data-test="product-title"]').should('have.length', 2)
  })

  // ─── TC-CRT-005: Empty Cart State ──────────────────────────────────────────
  it('TC-CRT-005 | shows empty state and hides checkout button when cart is empty', () => {
    // Ensure cart is empty — visit checkout directly without adding items
    cy.visit('/#/checkout')

    cy.get('[data-test="product-title"]').should('not.exist')
    cy.get('body').should('contain.text', 'empty')

    // Proceed to checkout button should not be available or be disabled
    cy.get('[data-test="proceed-1"]').should('not.exist')
  })

})
