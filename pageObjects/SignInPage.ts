import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class LoginSigninPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  signInForm = this.page.getByTestId("signInSection");
  firstNameWrapper = this.signInForm.locator("#firstName");
  firstNameInput = this.firstNameWrapper.locator("input");
  secondNameWrapper = this.signInForm.locator("#secondName");
  secondNameInput = this.secondNameWrapper.locator("input");
  emailWrapper = this.signInForm.locator("#email");
  emailInput = this.emailWrapper.locator("input");
  passwordWrapper = this.signInForm.locator("#password");
  passwordInput = this.passwordWrapper.locator("input");
  signInButton = this.signInForm.locator(".submitButton");
  agreementsSection = this.signInForm.locator("#agreements");
  allAgreementsCheckbox = this.agreementsSection.getByTestId("allAgreements");
  firstAgreementCheckbox =
    this.agreementsSection.getByTestId("firstAgreements");
  secondAgreementCheckbox =
    this.agreementsSection.getByTestId("secondAgreements");
  thirdAgreementCheckbox =
    this.agreementsSection.getByTestId("thirdAgreements");
  registerSuccessMessage = this.page.locator(".message-success");
  registerErrorMessage = this.page.locator(".message-error");

  inputErrorLabel(elem: any) {
    return elem.locator(".label-error");
  }

  async shouldBeOpen() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.signInForm).toBeVisible();
    await expect(this.firstNameWrapper).toBeVisible();
    await expect(this.secondNameWrapper).toBeVisible();
    await expect(this.emailWrapper).toBeVisible();
    await expect(this.passwordWrapper).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.agreementsSection).toBeAttached();
    await expect(this.firstAgreementCheckbox).toBeVisible();
    await expect(this.secondAgreementCheckbox).toBeVisible();
    await expect(this.thirdAgreementCheckbox).toBeVisible();
  }
}
export default LoginSigninPage;
