import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class SearchResultsPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  navBar = this.page.locator(".navigation");
  appLogo = this.navBar.getByTestId("appLogoImg");
  searchProductInput = this.page.getByTestId("productSeatchInput");
  singleProductTile = this.page.getByTestId("singleProduct");
  singleProductPrice = this.page.getByTestId("singlePrice");
  singleProductTitle = this.page.getByTestId("singleTitle");
  filterSection = this.page.getByTestId("filters");
  singleFilterPriceWrapper = this.page.getByTestId("priceRangeFilter");
  singleFilterPriceLowInput =
    this.singleFilterPriceWrapper.locator("input.low");
  singleFilterPriceHighInput =
    this.singleFilterPriceWrapper.locator("input.high");
  applyFiltersButton = this.page.getByTestId("applyFiltersButton");

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.appLogo).toBeVisible({ timeout: 15 * 10000 });
    await expect(this.searchProductInput).toBeAttached();
    await expect(this.filterSection).toBeVisible();
  }

  async searchResultsVisible() {
    await expect(this.singleProductTile.first()).toBeVisible();
  }

  async getMiddleRangePricesWithinPage(): Promise<number[]> {
    const priceElements = await this.singleProductPrice.all();

    const priceTexts = await Promise.all(
      priceElements.map(async (element) => await element.textContent())
    );

    const prices = await Promise.all(
      priceTexts.map(async (price) => await this.convertPrice(price))
    );

    // sort from lowest to highest
    prices.sort((a, b) => a - b);

    const middleIndex = Math.max(Math.floor(prices.length / 2) - 1, 0);

    // 3 middle values or less if there are less results
    const middlePrices =
      prices.length > 2 ? prices.slice(middleIndex, middleIndex + 3) : prices;

    return middlePrices;
  }

  async isInPriceRange(low: number, high: number, current: string) {
    const currentPrice = await this.convertPrice(current);
    return currentPrice >= low && currentPrice <= high;
  }

  async convertPrice(price: string) {
    return parseFloat(price.replace(",", ".").replace(/[^0-9.]+/g, ""));
  }
}
export default SearchResultsPage;
