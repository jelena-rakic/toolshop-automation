// Import custom commands
import './commands'

// Suppress uncaught exception errors that are not test-related
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver') || err.message.includes('Non-Error')) {
    return false
  }
})
