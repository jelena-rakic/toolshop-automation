/**
 * Custom Cypress Commands for Toolshop v5.0
 */

/**
 * Login via UI
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/#/auth/login')
  cy.get('[data-test="email"]').clear().type(email)
  cy.get('[data-test="password"]').clear().type(password)
  cy.get('[data-test="login-submit"]').click()
  cy.get('[data-test="nav-menu"]').should('be.visible')
})

/**
 * Login via API (faster — skips UI for tests that don't test login itself)
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', 'https://api.practicesoftwaretesting.com/users/login', {
    email,
    password,
  }).then((response) => {
    window.localStorage.setItem('token', response.body.access_token)
  })
})

/**
 * Add a product to cart by navigating to the product page and clicking Add to Cart
 * @param {string} productName
 */
Cypress.Commands.add('addToCart', (productName) => {
  cy.visit('/#/products')
  cy.get('[data-test="search-query"]').clear().type(productName)
  cy.get('[data-test="search-submit"]').click()
  cy.contains('[data-test="product-name"]', productName).first().click()
  cy.get('[data-test="add-to-cart"]').click()
  cy.get('.toast-body, [data-test="toast-success"]').should('be.visible')
})

/**
 * Clear the cart by visiting each item and removing it
 */
Cypress.Commands.add('clearCart', () => {
  cy.visit('/#/checkout')
  cy.get('body').then(($body) => {
    if ($body.find('[data-test="cart-item"]').length > 0) {
      cy.get('[data-test="delete-product"]').each(($btn) => {
        cy.wrap($btn).click()
      })
    }
  })
})
