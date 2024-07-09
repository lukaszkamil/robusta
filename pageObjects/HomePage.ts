import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class HomePage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  navBar = this.page.locator(".navigation");
  appLogo = this.navBar.getByTestId("appLogoImg");
  logInButton = this.navBar.getByTestId("logInButton");
  firstCarouselAdSection = this.page.getByTestId("carouselAdSection");
  recommendSection = this.page.getByTestId("recommendSection");
  forYouSection = this.page.getByTestId("forYouSection");
  hotDealBlock = this.page.getByTestId("hotDealBlock");
  searchProductInput = this.page.getByTestId("productSeatchInput");

  async open() {
    await this.page.goto(process.env.APPLICATION_URL, { waitUntil: "load" });
  }

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.appLogo).toBeVisible({ timeout: 15 * 10000 });
    await expect(this.firstCarouselAdSection).toBeAttached();
    await expect(this.recommendSection).toBeAttached();
    await expect(this.forYouSection).toBeAttached();
    await expect(this.hotDealBlock).toBeAttached();
  }
}
export default HomePage;
