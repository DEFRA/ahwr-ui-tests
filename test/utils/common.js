import { expect, browser, $, $$ } from "@wdio/globals";
import {
  SBI,
  CONTINUE_BUTTON,
  VISIT_DATE_DAY,
  VISIT_DATE_MONTH,
  VISIT_DATE_YEAR,
  SUBMIT_BUTTON,
  SUBMISSION_PANEL_TITLE,
  getWhenTestingWasCarriedOutSelector,
  getSheepTestsDiseaseConditionSelector,
  START_NEW_CLAIM_BUTTON,
  AGREEMENT_REFERENCE_SELECTOR,
  TERMS_AND_CONDITIONS_CHECKBOX,
  GOV_RADIOS_INPUT_LABEL,
  getConfirmCheckDetailsSelector,
} from "./selectors.js";

function getDevSignInUrl() {
  const localhostDevLandingPage = "http://localhost:3003/dev-landing-page";
  const dockerDevLandingPage = "http://ahwr-public-user-ui:3000/dev-landing-page";

  if (process.env.DOCKER_MODE === "true") {
    return dockerDevLandingPage;
  }

  return localhostDevLandingPage;
}

export function getBackOfficeUrl() {
  const localhostBackOfficeClaimsPage = "http://localhost:3002/claims";
  const dockerBackOfficeClaimsPage = "http:/ahwr-backoffice-ui:3000/claims";

  if (process.env.DOCKER_MODE === "true") {
    return dockerBackOfficeClaimsPage;
  }

  return localhostBackOfficeClaimsPage;
}

export async function clickSubmitButton() {
  await $(SUBMIT_BUTTON).click();
}

export async function fillAndSubmitSBI(sbi) {
  await $(SBI).setValue(sbi);
  await clickSubmitButton();
}

export async function performDevLogin(sbi) {
  await browser.url(getDevSignInUrl());
  await fillAndSubmitSBI(sbi);
  await $(getConfirmCheckDetailsSelector("yes")).click();
  await clickSubmitButton();
}

export async function enterVisitDateAndContinue() {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();

  await $(VISIT_DATE_DAY).setValue(day);
  await $(VISIT_DATE_MONTH).setValue(month);
  await $(VISIT_DATE_YEAR).setValue(year);
  await clickContinueButton();
}

export async function enterPreMHReleaseDateAndContinue() {
  await $(VISIT_DATE_DAY).setValue("30");
  await $(VISIT_DATE_MONTH).setValue("4");
  await $(VISIT_DATE_YEAR).setValue("2025");
  await clickContinueButton();
}

export async function chooseRandomHerdReasonsAndContinue() {
  const count = Math.floor(Math.random() * 5) + 1;

  for (let index = 0; index < count; index++) {
    const selector = index === 0 ? "#herdReasons" : `#herdReasons-${index + 1}`;
    await $(selector).click();
  }

  await clickContinueButton();
}

export async function enterWhenTestingWasCarriedOutAndContinue(value) {
  await $(getWhenTestingWasCarriedOutSelector(value)).click();
  await clickContinueButton();
}

export async function clickOnElementAndContinue(selector) {
  await $(selector).click();
  await clickContinueButton();
}

export async function selectSheepTestsAndContinue(testTypes) {
  for (const testType of testTypes) {
    const checkbox = $(getSheepTestsDiseaseConditionSelector(testType));
    await checkbox.click();
    await clickContinueButton();
  }
}

export async function fillInput(selector, value) {
  await $(selector).setValue(value);
}

export async function fillInputAndContinue(selector, value) {
  await fillInput(selector, value);
  await clickContinueButton();
}

export async function selectHerdAndContinue(herdName) {
  const herdLabelElement = await $$(GOV_RADIOS_INPUT_LABEL).find(async (element) => {
    const text = await element.getText();
    return text.trim() === herdName;
  });

  const herdInputId = await herdLabelElement.getAttribute("for");
  await $(`#${herdInputId}`).click();

  await clickContinueButton();
}

export async function verifySubmission(expectedText) {
  const title = $(SUBMISSION_PANEL_TITLE);
  await expect(title).toHaveText(expect.stringContaining(expectedText));
}

export async function clickContinueButton() {
  await $(CONTINUE_BUTTON).click();
}

export async function clickStartNewClaimButton() {
  await $(START_NEW_CLAIM_BUTTON).click();
}

export async function createAgreement(sbi) {
  await browser.url(getDevSignInUrl());
  await fillAndSubmitSBI(sbi);
  await $(getConfirmCheckDetailsSelector("yes")).click();
  await clickSubmitButton();
  await clickSubmitButton();
  await clickSubmitButton();
  await clickSubmitButton();
  await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
  await clickSubmitButton();
  await verifySubmission("Application complete");
  const agreementReference = (await $(AGREEMENT_REFERENCE_SELECTOR).getText()).trim();

  return agreementReference;
}

export async function swapBackOfficeUser(userName) {
  const backOfficeClaimsRoute = getBackOfficeUrl();
  const loginRoute = backOfficeClaimsRoute.replace("claims", `login?userId=${userName}`);
  await browser.url(loginRoute);
}

export async function verifyElementsExist(selectors = []) {
  for (const selector of selectors) {
    await expect($(selector)).toBeExisting();
  }
}
