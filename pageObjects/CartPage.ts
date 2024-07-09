import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class CartPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  navBar = this.page.locator(".navigation");
  appLogo = this.navBar.getByTestId("appLogoImg");
  cartProductsSection = this.page.getByTestId("cartProductsSection");
  singleProductTitle = this.page.getByTestId("productTitle");
  removeFormCartButton = this.navBar.getByTestId("removeFromCartButton");

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.appLogo).toBeVisible({ timeout: 15 * 10000 });
    await expect(this.cartProductsSection).toBeAttached();
  }

  async cartProductsVisible() {
    await expect(this.singleProductTitle.first()).toBeVisible();
  }
}
export default CartPage;
