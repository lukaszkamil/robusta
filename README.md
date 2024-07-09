# playwright-automation

Automated tests for ecommerce shop

## Setup

1. In main apps/automation-tests folder run command `npm install`
2. `npx playwright install` - or narrow it to the single browser -> `npx playwright install chromium`
3. Add `.env` file and fill it with proper values (you can have different `.env.${ENV}` files but you must specify `ENV=test` in test command) - check .env.example for important environment variables
4. `ENV={.env name} npx playwright test` - so for `development.local` type `ENV=development.local npx playwright test`

### Running Tests

To run tests, run command (for `.env.sandbox` run ENV=sandbox):

```
ENV={.env name} npx playwright test
```

or point to a specific test file:

```
ENV=test npx playwright test tests/specificFile.test.ts
```

You can define how many tests will run in parallel (example for 1 parallel test):

```
ENV=test npx playwright test -j 1
```

To run tests in headed mode (visible browser) run (default is running without any visual representation):

```
ENV=test npx playwright test -j 1 --headed
```

### Logs and reports

To check test report in the HTML, in main app folder, run:

```
yarn playwright show-report test-results/html
```

To check trace of the failed test, in main app folder, run:

```
npx playwright show-trace /////path to trace.zip from test-results folder/////
```
