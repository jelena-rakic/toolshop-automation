/**
 * Module: Search & Filter
 * Covers: TC-SRH-001 to TC-SRH-007
 */

import testData from '../fixtures/testData.json'

const { searchTerm, partialSearch, noResultSearch } = testData.products
const { category, powerCategory, minPrice, maxPrice } = testData.filters

describe('Search & Filter', () => {

  beforeEach(() => {
    cy.visit('/#/products')
  })

  // ─── TC-SRH-001: Exact Product Name Search ─────────────────────────────────
  it('TC-SRH-001 | returns correct results for exact product name', () => {
    cy.get('[data-test="search-query"]').type(searchTerm)
    cy.get('[data-test="search-submit"]').click()

    cy.get('[data-test="product-name"]').each(($el) => {
      expect($el.text().toLowerCase()).to.include(searchTerm.toLowerCase())
    })

    cy.get('[data-test="product-name"]').should('have.length.greaterThan', 0)
  })

  // ─── TC-SRH-002: Partial Keyword Search ────────────────────────────────────
  it('TC-SRH-002 | returns results for a partial keyword', () => {
    cy.get('[data-test="search-query"]').type(partialSearch)
    cy.get('[data-test="search-submit"]').click()

    cy.get('[data-test="product-name"]').should('have.length.greaterThan', 0)
  })

  // ─── TC-SRH-003: No Results ─────────────────────────────────────────────────
  it('TC-SRH-003 | shows empty state message for non-existent keyword', () => {
    cy.get('[data-test="search-query"]').type(noResultSearch)
    cy.get('[data-test="search-submit"]').click()

    cy.get('[data-test="product-name"]').should('not.exist')
    cy.get('[data-test="no-results"], .alert, body')
      .should('contain.text', 'No')
  })

  // ─── TC-SRH-004: Filter by Category ───────────────────────────────────────
  it('TC-SRH-004 | shows only products for the selected category', () => {
    // Click on the Hand Tools category in the sidebar
    cy.contains('[data-test="category"] a, .nav-link, label', category).click()

    cy.get('[data-test="product-name"]').should('have.length.greaterThan', 0)

    // All product cards should display the correct category
    cy.get('[data-test="product-category"], .card-text')
      .each(($el) => {
        expect($el.text()).to.include(category)
      })
  })

  // ─── TC-SRH-005: Filter by Price Range ─────────────────────────────────────
  it('TC-SRH-005 | returns only products within specified price range', () => {
    // Set min/max price inputs (slider or number inputs depending on implementation)
    cy.get('[data-test="min-price"]').clear().type(minPrice)
    cy.get('[data-test="max-price"]').clear().type(maxPrice)
    cy.get('[data-test="filter-apply"], [data-test="search-submit"]').click()

    cy.get('[data-test="product-price"]').each(($el) => {
      const price = parseFloat($el.text().replace(/[^0-9.]/g, ''))
      expect(price).to.be.within(
        parseFloat(minPrice),
        parseFloat(maxPrice)
      )
    })
  })

  // ─── TC-SRH-006: Sort by Price Low to High ─────────────────────────────────
  it('TC-SRH-006 | sorts products by price ascending', () => {
    cy.get('[data-test="sort"]').select('Price (Low to High)')

    cy.get('[data-test="product-price"]').then(($prices) => {
      const prices = [...$prices].map(
        ($el) => parseFloat($el.innerText.replace(/[^0-9.]/g, ''))
      )
      const sorted = [...prices].sort((a, b) => a - b)
      expect(prices).to.deep.equal(sorted)
    })
  })

  // ─── TC-SRH-007: Combined Search + Category Filter ─────────────────────────
  it('TC-SRH-007 | applies search term and category filter together', () => {
    // First apply category filter
    cy.contains('[data-test="category"] a, .nav-link, label', 'Hand Tools').click()

    // Then search within that category
    cy.get('[data-test="search-query"]').type('wrench')
    cy.get('[data-test="search-submit"]').click()

    cy.get('[data-test="product-name"]').each(($el) => {
      expect($el.text().toLowerCase()).to.include('wrench')
    })
  })

})
