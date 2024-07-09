import { test, expect } from "@playwright/test";
import HomePage from "../pageObjects/HomePage";
import LogInSignInPage from "../pageObjects/LogInSignInPage";
import { environmentData } from "../utils/data/index";
import SearchResultsPage from "../pageObjects/SearchResultsPage";
import ProductDetailPage from "../pageObjects/ProductDetailPage";
import CartPage from "../pageObjects/CartPage";

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

  test("User is able to open single product page from results page", async ({
    page,
  }) => {
    const searchResultsPage = new SearchResultsPage(page);

    await searchResultsPage.singleProductTile.first().click();
    const productDetailPage = new ProductDetailPage(page);

    await productDetailPage.shouldBeOpen();
  });
});

test.describe("Logged in User is on a product detail page", () => {
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

    await searchResultsPage.singleProductTile.first().click();
    const productDetailPage = new ProductDetailPage(page);

    await productDetailPage.shouldBeOpen();
  });

  test("User is able to add product to a cart by pressing -add to cart- button", async ({
    page,
  }) => {
    const productDetailPage = new ProductDetailPage(page);

    const productTitle = await productDetailPage.productTitle.textContent();
    await productDetailPage.addToCartButton.click();

    await expect(productDetailPage.goToCartButton).toBeVisible({
      timeout: 10000,
    });
    await productDetailPage.goToCartButton.click();
    const cartPage = new CartPage(page);

    // check if there is a single product with proper title
    await expect(cartPage.singleProductTitle.count()).toBe(1);
    await expect(cartPage.singleProductTitle.textContent()).toBe(productTitle);
  });
});
