import { test, expect } from "@playwright/test";
import HomePage from "../pageObjects/HomePage";
import LogInSignInPage from "../pageObjects/LogInSignInPage";
import SignInPage, { LoginSigninPage } from "../pageObjects/SignInPage";
import { environmentData } from "../utils/data/index";

test.describe("User is on a main app page", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.shouldBeOpen();
  });

  test("User is able to navigate to a registration page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.logInButton.click();
    const logInSignInPage = new LogInSignInPage(page);

    await logInSignInPage.shouldBeOpen();
    await logInSignInPage.signInButton.click();

    const signInPage = new SignInPage(page);
    await signInPage.shouldBeOpen();
  });
});

test.describe("User is on a registration page", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.shouldBeOpen();

    await homePage.logInButton.click();
    const logInSignInPage = new LogInSignInPage(page);

    await logInSignInPage.shouldBeOpen();
    await logInSignInPage.signInButton.click();

    const signInPage = new SignInPage(page);
    await signInPage.shouldBeOpen();
  });

  test("User is able to register new account successfully", async ({
    page,
  }) => {
    const email = `qa_automated_tests${Date.now()}@robusta.com`;
    const password = `${environmentData.existedUser.password}${Date.now()}`;

    const signInPage = new SignInPage(page);
    await signInPage.firstNameInput.fill("John");
    await signInPage.secondNameInput.fill("What");
    await signInPage.emailInput.fill(email);
    await signInPage.passwordWrapper.fill(password);

    await signInPage.signInButton.click();
    await expect(signInPage.registerSuccessMessage).toBeVisible();

    const logInSignInPage = new LogInSignInPage(page);

    await logInSignInPage.shouldBeOpen();
    await logInSignInPage.emailInput.fill(email);
    await logInSignInPage.passwordWrapper.fill(password);

    const homePage = new HomePage(page);
    await homePage.shouldBeOpen();
  });

  test("User is not able to register to an already existed email address", async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    await signInPage.firstNameInput.fill("John");
    await signInPage.secondNameInput.fill("What");
    await signInPage.emailInput.fill(environmentData.existedUser.email);
    await signInPage.passwordWrapper.fill(
      `${environmentData.existedUser.password}${Date.now()}`
    );

    await signInPage.signInButton.click();
    await expect(signInPage.registerErrorMessage).toBeVisible();

    await signInPage.shouldBeOpen();
  });

  test("User data are validated correctly - first name, second name", async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);

    await signInPage.signInButton.click();
    await signInPage.shouldBeOpen();

    await expect(
      signInPage.inputErrorLabel(await signInPage.firstNameWrapper)
    ).toBeVisible();
    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).toBeVisible();

    await signInPage.firstNameInput.fill("John");
    await signInPage.secondNameInput.fill("What");

    await signInPage.signInButton.click();

    await expect(
      signInPage.inputErrorLabel(await signInPage.firstNameWrapper)
    ).not.toBeVisible();
    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).not.toBeVisible();
  });

  test("User data are validated correctly - email", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.signInButton.click();
    await signInPage.shouldBeOpen();

    // empty email error
    await expect(
      signInPage.inputErrorLabel(await signInPage.emailWrapper)
    ).toBeVisible();

    await signInPage.emailInput.fill(
      `qa_automated_tests${Date.now()}@robusta.com`
    );
    await signInPage.signInButton.click();

    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).not.toBeVisible();

    // lack of domain error
    await signInPage.emailInput.fill(`qa_automated_tests${Date.now()}`);
    await signInPage.signInButton.click();

    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).toBeVisible();
    await expect(
      signInPage
        .inputErrorLabel(await signInPage.secondNameWrapper)
        .textContent()
    ).toContain("domain");
  });

  test("User data are validated correctly - password", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.signInButton.click();
    await signInPage.shouldBeOpen();

    // empty password
    await expect(
      signInPage.inputErrorLabel(await signInPage.emailWrapper)
    ).toBeVisible();

    await signInPage.passwordWrapper.fill(
      `${environmentData.existedUser.password}${Date.now()}`
    );
    await signInPage.signInButton.click();

    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).not.toBeVisible();

    // less than 8 chars
    await signInPage.passwordWrapper.fill(
      `${environmentData.existedUser.password.slice(0, 3)}`
    );
    await signInPage.signInButton.click();

    await expect(
      signInPage.inputErrorLabel(await signInPage.secondNameWrapper)
    ).toBeVisible();
  });
});
