import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class ProductDetailPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  navBar = this.page.locator(".navigation");
  appLogo = this.navBar.getByTestId("appLogoImg");
  cartButton = this.navBar.getByTestId("cartButton");
  productTitle = this.page.getByTestId("#title");
  productPhotos = this.page.getByTestId("carouselproductPhotos");
  productDescriptionSection = this.page.locator("#description");
  productOpinionsSection = this.page.locator("#opinions");
  addToCartButton = this.page.getByTestId("addToCartButton");
  goToCartButton = this.page.getByTestId("goToCartButton");

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.appLogo).toBeVisible({ timeout: 15 * 10000 });
    await expect(this.productPhotos).toBeAttached();
    await expect(this.productDescriptionSection).toBeAttached();
    await expect(this.productOpinionsSection).toBeAttached();
    await expect(this.addToCartButton).toBeAttached();
  }
}
export default ProductDetailPage;
