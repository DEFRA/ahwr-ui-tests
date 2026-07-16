import { browser, $, $$, expect } from "@wdio/globals";
import {
  BO_AGREEMENTS_TAB,
  getAgreementReferenceSelector,
  getViewClaimLinkSelector,
  BO_RECOMMEND_TO_PAY_BUTTON,
  BO_RECOMMEND_TO_REJECT_BUTTON,
  BO_CHECKED_CHECKLIST_CHECKBOX,
  BO_SENT_CHECK_LIST_CHECKBOX,
  BO_CONFIRM_AND_CONTINUE_BUTTON,
  BO_CLAIM_STATUS_TEXT,
  BO_PAY_BUTTON,
  BO_PAY_CHECKBOX_ONE,
  BO_PAY_CHECKBOX_TWO,
  BO_REJECT_BUTTON,
  BO_AGREEMENT_LIST,
  BO_AGREEMENT_ROW_VALUE,
  BO_NO_AGREEMENTS_MESSAGE,
  BO_ADVANCED_SEARCH_SUMMARY,
  BO_AGREEMENT_TYPE_SELECT,
  BO_ADVANCED_SEARCH_BUTTON,
  BO_AGREEMENT_REFERENCE_LINKS,
  BO_NO_CLAIMS_MESSAGE,
  BO_AGREEMENT_DATE_FROM_DAY,
  BO_AGREEMENT_DATE_FROM_MONTH,
  BO_AGREEMENT_DATE_FROM_YEAR,
  BO_AGREEMENT_DATE_TO_DAY,
  BO_AGREEMENT_DATE_TO_MONTH,
  BO_AGREEMENT_DATE_TO_YEAR,
} from "./backoffice-selectors.js";
import { swapBackOfficeUser, getBackOfficeUrl } from "./common.js";

export async function approveClaim(agreementReference, claimReference) {
  await swapBackOfficeUser("Admin2");
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(getAgreementReferenceSelector(agreementReference)).click();
  await $(getViewClaimLinkSelector(claimReference)).click();
  await $(BO_RECOMMEND_TO_PAY_BUTTON).click();
  await $(BO_CHECKED_CHECKLIST_CHECKBOX).click();
  await $(BO_SENT_CHECK_LIST_CHECKBOX).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Recommended to pay"));

  // Swapping to another user to approve the claim
  await swapBackOfficeUser("Admin");
  await $(BO_AGREEMENTS_TAB).click();
  await $(getAgreementReferenceSelector(agreementReference)).click();
  await $(getViewClaimLinkSelector(claimReference)).click();
  await $(BO_PAY_BUTTON).click();
  await $(BO_PAY_CHECKBOX_ONE).click();
  await $(BO_PAY_CHECKBOX_TWO).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Ready to pay"));

  // Swapping to a different user to the approver to continue with other journeys
  await swapBackOfficeUser("Admin2");
}

// A single auto-waiting selector lets the read survive the navigation that
// precedes it, and the awaited matcher retries until the page has settled.
export async function expectAgreementReference(expectedReference) {
  await expect($(BO_AGREEMENT_LIST).$(BO_AGREEMENT_ROW_VALUE)).toHaveText(expectedReference);
}

export async function expectNoAgreementsFound() {
  await expect($(BO_NO_AGREEMENTS_MESSAGE)).toHaveText("No agreements found.");
}

export async function expectNoClaimsFound() {
  await expect($(BO_NO_CLAIMS_MESSAGE)).toHaveText("No claims found.");
}

// Opens the advanced search disclosure and filters the agreements list by the
// given agreement type (e.g. "IAHW" or "PBR").
export async function searchAgreementsByType(agreementType) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  await $(BO_AGREEMENT_TYPE_SELECT).selectByAttribute("value", agreementType);
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

// Asserts the results list is non-empty and that every agreement reference
// begins with one of the allowed prefixes for the searched-for type.
export async function expectAllAgreementsToStartWith(allowedPrefixes) {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);

  for (const referenceLink of referenceLinks) {
    const reference = await referenceLink.getText();
    expect(allowedPrefixes.some((prefix) => reference.startsWith(prefix))).toBe(true);
  }
}

// Opens the advanced search disclosure and filters agreements by an
// "agreement date from" and/or "agreement date to" range. Each bound is an
// optional { day, month, year } object; an omitted bound is left blank.
export async function searchAgreementsByDateRange({ from, to } = {}) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  if (from) {
    await $(BO_AGREEMENT_DATE_FROM_DAY).setValue(from.day);
    await $(BO_AGREEMENT_DATE_FROM_MONTH).setValue(from.month);
    await $(BO_AGREEMENT_DATE_FROM_YEAR).setValue(from.year);
  }
  if (to) {
    await $(BO_AGREEMENT_DATE_TO_DAY).setValue(to.day);
    await $(BO_AGREEMENT_DATE_TO_MONTH).setValue(to.month);
    await $(BO_AGREEMENT_DATE_TO_YEAR).setValue(to.year);
  }
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

// Asserts the results list holds at least one agreement.
export async function expectAgreementsFound() {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);
}

// Moves a claim that is already 'In check' to 'Recommended to reject'. Assumes
// the claim page is already open.
export async function recommendClaimToReject() {
  await $(BO_RECOMMEND_TO_REJECT_BUTTON).waitForDisplayed();
  await $(BO_RECOMMEND_TO_REJECT_BUTTON).click();
  await $(BO_CHECKED_CHECKLIST_CHECKBOX).click();
  await $(BO_SENT_CHECK_LIST_CHECKBOX).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(
    expect.stringContaining("Recommended to reject"),
  );
}

// Finalises a claim that is already 'Recommended to reject' by swapping to a
// rejector and confirming the rejection.
export async function rejectClaim(agreementReference, claimReference) {
  await swapBackOfficeUser("Rejector");
  await $(BO_AGREEMENTS_TAB).click();
  await $(getAgreementReferenceSelector(agreementReference)).click();
  await $(getViewClaimLinkSelector(claimReference)).click();
  await $(BO_REJECT_BUTTON).waitForDisplayed();
  await $(BO_REJECT_BUTTON).click();
  await $(BO_PAY_CHECKBOX_ONE).click();
  await $(BO_PAY_CHECKBOX_TWO).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Rejected"));
}
