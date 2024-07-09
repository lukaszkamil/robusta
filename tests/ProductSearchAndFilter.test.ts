import { test, expect } from "@playwright/test";
import HomePage from "../pageObjects/HomePage";
import LogInSignInPage from "../pageObjects/LogInSignInPage";
import { environmentData } from "../utils/data/index";
import SearchResultsPage from "../pageObjects/SearchResultsPage";

test.describe("Logged in User is on a main app page", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.shouldBeOpen();
    await homePage.logInButton.click();

    const logInSignInPage = new LogInSignInPage(page);

    await logInSignInPage.shouldBeOpen();
    await logInSignInPage.emailInput.fill(environmentData.existedUser.email);
    await logInSignInPage.passwordWrapper.fill(
      environmentData.existedUser.password
    );

    await homePage.shouldBeOpen();
  });

  test("User is able to search for specific phrase and see the results", async ({
    page,
  }) => {
    const searchCriteria = "przedłużacz";

    const homePage = new HomePage(page);
    await homePage.searchProductInput.fill(searchCriteria);

    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.shouldBeOpen();
    await searchResultsPage.searchResultsVisible();
  });
});

test.describe("Logged in User is on a product results page", () => {
  const searchCriteria = "przedłużacz";
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.shouldBeOpen();
    await homePage.logInButton.click();

    const logInSignInPage = new LogInSignInPage(page);

    await logInSignInPage.shouldBeOpen();
    await logInSignInPage.emailInput.fill(environmentData.existedUser.email);
    await logInSignInPage.passwordWrapper.fill(
      environmentData.existedUser.password
    );

    await homePage.shouldBeOpen();

    await homePage.searchProductInput.fill(searchCriteria);

    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.shouldBeOpen();
    await searchResultsPage.searchResultsVisible();
  });

  test("User is able to see only the results that meet searched criteria", async ({
    page,
  }) => {
    const searchResultsPage = new SearchResultsPage(page);

    const results = await searchResultsPage.singleProductTitle.all();
    for (const elem of results) {
      console.log(`I'm checking \"${await elem.textContent()}\" product`);
      expect(await elem.textContent()).toContain(searchCriteria);
    }
  });

  test("User is able to filter results via price", async ({ page }) => {
    // let's assume we have single result page and results are >3 ;)
    const searchResultsPage = new SearchResultsPage(page);

    // results count before filters
    const resultsWithoutFilters =
      await searchResultsPage.singleProductTile.count();

    // calculated middle range of prices to filter some products later in the test
    const middlePrices =
      await searchResultsPage.getMiddleRangePricesWithinPage();
    const low = middlePrices[0]; // lowest price from middle range
    const high = middlePrices[middlePrices.length - 1]; // highest proce from middle range

    await searchResultsPage.singleFilterPriceLowInput.fill(`${low}`);
    await searchResultsPage.singleFilterPriceHighInput.fill(`${high}`);

    await searchResultsPage.applyFiltersButton.click();
    await searchResultsPage.searchResultsVisible();

    expect(await searchResultsPage.singleProductTile.count()).toBeGreaterThan(
      resultsWithoutFilters
    );

    const allPricesList = await searchResultsPage.singleProductPrice.all();

    // check if all products are in price range
    for (const elem of allPricesList) {
      expect(
        await searchResultsPage.isInPriceRange(
          low,
          high,
          await elem.textContent()
        )
      ).toBeTruthy();
    }
  });
});
