import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class LogInSignInPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  logInSection = this.page.getByTestId("logInSection");
  logInForm = this.page.getByTestId("logInForm");
  emailWrapper = this.logInForm.locator("#email");
  emailInput = this.emailWrapper.locator("input");
  passwordWrapper = this.logInForm.locator("#password");
  passwordInput = this.passwordWrapper.locator("input");
  logInButton = this.logInSection.getByTestId("logInButton");
  signInSection = this.page.getByTestId("signInSection");
  signInButton = this.signInSection.locator(".actionButton");

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.logInSection).toBeVisible();
    await expect(this.logInButton).toBeVisible();
    await expect(this.signInSection).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }
}
export default LogInSignInPage;
