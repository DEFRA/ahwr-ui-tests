import { browser, $, $$, expect } from "@wdio/globals";
import {
  BO_AGREEMENTS_TAB,
  getAgreementReferenceSelector,
  getViewClaimLinkSelector,
  getAgreementStatusColumnSelector,
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
  BO_AGREEMENT_STATUS_SELECT,
  BO_AGREEMENT_FLAG_SELECT,
  BO_AGREEMENT_FLAG_COLUMN,
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

/**
 * Approves a claim end to end: recommends it to pay as one user, then swaps to
 * a second user to authorise it, leaving the claim "Ready to pay".
 *
 * @param {string} agreementReference - the agreement the claim belongs to.
 * @param {string} claimReference - the claim to approve.
 * @returns {Promise<void>}
 */
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

/**
 * Asserts the open agreement's reference matches the expected value.
 *
 * A single auto-waiting selector lets the read survive the navigation that
 * precedes it, and the awaited matcher retries until the page has settled.
 *
 * @param {string} expectedReference - the agreement reference expected on the page.
 * @returns {Promise<void>}
 */
export async function expectAgreementReference(expectedReference) {
  await expect($(BO_AGREEMENT_LIST).$(BO_AGREEMENT_ROW_VALUE)).toHaveText(expectedReference);
}

/**
 * Asserts the agreements search returned no results.
 *
 * @returns {Promise<void>}
 */
export async function expectNoAgreementsFound() {
  await expect($(BO_NO_AGREEMENTS_MESSAGE)).toHaveText("No agreements found.");
}

/**
 * Asserts the claims search returned no results.
 *
 * @returns {Promise<void>}
 */
export async function expectNoClaimsFound() {
  await expect($(BO_NO_CLAIMS_MESSAGE)).toHaveText("No claims found.");
}

/**
 * Opens the advanced search disclosure and filters the agreements list by the
 * given agreement type (e.g. "IAHW" or "PBR").
 *
 * @param {string} agreementType - the agreement type to filter by.
 * @returns {Promise<void>}
 */
export async function searchAgreementsByType(agreementType) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  await $(BO_AGREEMENT_TYPE_SELECT).selectByAttribute("value", agreementType);
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Opens the advanced search disclosure and filters the agreements list by the
 * given status ("ALL", "AGREED" or "NOT_AGREED").
 *
 * @param {string} status - the status value to filter by.
 * @returns {Promise<void>}
 */
export async function searchAgreementsByStatus(status) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  await $(BO_AGREEMENT_STATUS_SELECT).selectByAttribute("value", status);
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Opens the advanced search disclosure and filters the agreements list by the
 * given flag value ("ALL", "FLAGGED" or "NOT_FLAGGED").
 *
 * @param {string} flag - the flag value to filter by.
 * @returns {Promise<void>}
 */
export async function searchAgreementsByFlag(flag) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  await $(BO_AGREEMENT_FLAG_SELECT).selectByAttribute("value", flag);
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Asserts the results list is non-empty and that every agreement is flagged,
 * i.e. its flag column reads "Yes".
 *
 * @returns {Promise<void>}
 */
export async function expectAllAgreementsToBeFlagged() {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);

  const flagCells = await $$(BO_AGREEMENT_FLAG_COLUMN);
  for (const flagCell of flagCells) {
    expect(await flagCell.getText()).toContain("Yes");
  }
}

/**
 * Asserts the results list is non-empty and that no agreement is flagged,
 * i.e. every flag column is empty.
 *
 * @returns {Promise<void>}
 */
export async function expectNoAgreementsToBeFlagged() {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);

  const flagCells = await $$(BO_AGREEMENT_FLAG_COLUMN);
  for (const flagCell of flagCells) {
    expect(await flagCell.getText()).toBe("");
  }
}

/**
 * Asserts the results list is non-empty and that every agreement reference
 * begins with one of the allowed prefixes for the searched-for type.
 *
 * @param {string[]} allowedPrefixes - the reference prefixes every result must start with.
 * @returns {Promise<void>}
 */
export async function expectAllAgreementsToStartWith(allowedPrefixes) {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);

  for (const referenceLink of referenceLinks) {
    const reference = await referenceLink.getText();
    expect(allowedPrefixes.some((prefix) => reference.startsWith(prefix))).toBe(true);
  }
}

/**
 * Asserts the results list is non-empty and that every agreement has the
 * given status (e.g. "AGREED").
 *
 * @param {string} status - the status every result must have.
 * @returns {Promise<void>}
 */
export async function expectAllAgreementsToHaveStatus(status) {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);

  const statusCells = await $$(getAgreementStatusColumnSelector(status));
  expect(statusCells.length).toBe(referenceLinks.length);
}

/**
 * Opens the advanced search disclosure and filters agreements by an
 * "agreement date from" and/or "agreement date to" range.
 *
 * @param {object} [range] - the date range to filter by.
 * @param {{ day: string, month: string, year: string }} [range.from] - the "date from" bound; omitted leaves it blank.
 * @param {{ day: string, month: string, year: string }} [range.to] - the "date to" bound; omitted leaves it blank.
 * @returns {Promise<void>}
 */
export async function searchAgreementsByDateRange({ from, to } = {}) {
  await browser.url(getBackOfficeUrl());
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  // Every field is written, blanking omitted parts, so date values left in the
  // session from an earlier search don't survive to invert the current range.
  const fields = [
    [BO_AGREEMENT_DATE_FROM_DAY, from?.day],
    [BO_AGREEMENT_DATE_FROM_MONTH, from?.month],
    [BO_AGREEMENT_DATE_FROM_YEAR, from?.year],
    [BO_AGREEMENT_DATE_TO_DAY, to?.day],
    [BO_AGREEMENT_DATE_TO_MONTH, to?.month],
    [BO_AGREEMENT_DATE_TO_YEAR, to?.year],
  ];
  for (const [selector, value] of fields) {
    const field = $(selector);
    await field.clearValue();
    if (value) {
      await field.setValue(value);
    }
  }
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Asserts the results list holds at least one agreement.
 *
 * @returns {Promise<void>}
 */
export async function expectAgreementsFound() {
  const referenceLinks = await $$(BO_AGREEMENT_REFERENCE_LINKS);
  expect(referenceLinks.length).toBeGreaterThan(0);
}

/**
 * Moves a claim that is already 'In check' to 'Recommended to reject'. Assumes
 * the claim page is already open.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Finalises a claim that is already 'Recommended to reject' by swapping to a
 * rejector and confirming the rejection.
 *
 * @param {string} agreementReference - the agreement the claim belongs to.
 * @param {string} claimReference - the claim to reject.
 * @returns {Promise<void>}
 */
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
