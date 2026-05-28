# Toolshop Automation

Test automation suite for [Toolshop v5.0](https://practicesoftwaretesting.com/).

Covers:
- **Cypress** — E2E UI tests (Register/Login, Search/Filter, Cart, Checkout)
- **Postman + Newman** — API tests for product creation

---

## Project Structure

```
toolshop-automation/
├── cypress/
│   ├── e2e/
│   │   ├── 01_user.cy.js        # TC-USR-001 to TC-USR-006
│   │   ├── 02_search.cy.js      # TC-SRH-001 to TC-SRH-007
│   │   ├── 03_cart.cy.js        # TC-CRT-001 to TC-CRT-005
│   │   └── 04_checkout.cy.js    # TC-CHK-001 to TC-CHK-006
│   ├── fixtures/
│   │   └── testData.json        # Centralised test data
│   └── support/
│       ├── commands.js          # Custom commands: login, loginByApi, addToCart
│       └── e2e.js
├── postman/
│   ├── Toolshop_API.collection.json
│   └── Toolshop_API.environment.json
├── cypress.config.js
└── package.json
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Part 1 — Cypress E2E Tests

### Install

```bash
npm install
```

### Run all tests (headless)

```bash
npm run cy:run
```

### Run a specific module

```bash
npm run cy:run:user      # Register & Login
npm run cy:run:search    # Search & Filter
npm run cy:run:cart      # Cart
npm run cy:run:checkout  # Checkout & Payment
```

### Open interactive Test Runner

```bash
npm run cy:open
```

---

## Part 2 — Postman / Newman API Tests

### Collection overview

| # | Request | Method | Assertions |
|---|---------|--------|------------|
| 1 | Login — Get Access Token | POST `/users/login` | Status 200, contains `access_token`, token type is Bearer |
| 2 | Get Categories | GET `/categories` | Status 200, data array not empty, stores `category_id` |
| 3 | Get Brands | GET `/brands` | Status 200, data array not empty, stores `brand_id` |
| 4 | **Store New Product** | POST `/products` | Status 200/201, has `id`, `name` matches request, `price` matches request, Content-Type is JSON |
| 5 | Verify Product Was Created | GET `/products/:id` | Status 200, id and name match created product |
| 6 | Unauthorized Product Creation | POST `/products` (no token) | Status 401, response has `message` |

### Run with Newman

#### 1. Install Newman globally

```bash
npm install -g newman
```

#### 2. Run the collection

```bash
newman run postman/Toolshop_API.collection.json \
  -e postman/Toolshop_API.environment.json
```

#### 3. Run with HTML report

First install the HTML reporter:

```bash
npm install -g newman-reporter-htmlextra
```

Then run:

```bash
newman run postman/Toolshop_API.collection.json \
  -e postman/Toolshop_API.environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/newman-report.html
```

The HTML report will be saved to `reports/newman-report.html`. Open it in any browser.

#### 4. Run with JUnit XML output (for CI)

```bash
newman run postman/Toolshop_API.collection.json \
  -e postman/Toolshop_API.environment.json \
  --reporters cli,junit \
  --reporter-junit-export reports/newman-results.xml
```

#### 5. Run via npm script (shorthand)

```bash
# CLI output only
npm run newman:run

# CLI + HTML report
npm run newman:run:html
```

### Newman CLI flags reference

| Flag | Description |
|------|-------------|
| `-e` | Path to environment file |
| `-g` | Path to global variables file |
| `-n <number>` | Number of iterations to run |
| `--delay-request <ms>` | Delay between requests in milliseconds |
| `--timeout-request <ms>` | Request timeout in milliseconds |
| `--bail` | Stop run on first test failure |
| `--reporters` | Comma-separated list of reporters (`cli`, `json`, `junit`, `htmlextra`) |
| `--reporter-htmlextra-export` | Output path for HTML report |
| `--reporter-junit-export` | Output path for JUnit XML report |

### Example: run with delay and bail on failure

```bash
newman run postman/Toolshop_API.collection.json \
  -e postman/Toolshop_API.environment.json \
  --delay-request 500 \
  --bail
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@practicesoftwaretesting.com | welcome01 |
| Customer | customer@practicesoftwaretesting.com | welcome01 |

> These are public practice credentials provided by the application.

---

## API Reference

- **Base URL:** `https://api.practicesoftwaretesting.com`
- **Swagger Docs:** `https://api.practicesoftwaretesting.com/api/documentation`
