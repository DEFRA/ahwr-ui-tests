import { browser, $, $$, expect } from "@wdio/globals";
import {
  BO_AGREEMENTS_TAB,
  BO_AGREEMENT_SEARCH,
  BO_SEARCH_BUTTON,
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
  BO_CLAIM_REFERENCE_LINKS,
  BO_NO_CLAIMS_MESSAGE,
  BO_DATE_FROM_DAY,
  BO_DATE_FROM_MONTH,
  BO_DATE_FROM_YEAR,
  BO_DATE_TO_DAY,
  BO_DATE_TO_MONTH,
  BO_DATE_TO_YEAR,
} from "./backoffice-selectors.js";
import { swapBackOfficeUser, getBackOfficeUrl } from "./common.js";

/**
 * Opens an agreement from the backoffice.
 *
 * The agreements list is paginated (20 per page) and recency-sorted, so under a
 * parallel run an agreement can be pushed off the first page; search for it by
 * reference instead of scanning the default list, so it is found regardless of
 * how many other agreements exist.
 *
 * @param {string} agreementReference - the agreement to open.
 * @returns {Promise<void>}
 */
export async function openAgreement(agreementReference) {
  await $(BO_AGREEMENTS_TAB).click();
  await $(BO_AGREEMENT_SEARCH).setValue(agreementReference);
  await $(BO_SEARCH_BUTTON).click();
  await $(getAgreementReferenceSelector(agreementReference)).click();
}

/**
 * Opens an agreement then the given claim within it.
 *
 * The agreement page is server-rendered, so a claim created moments earlier can
 * be missing from the freshly-loaded list; reload until the claim link appears
 * before clicking, rather than relying on a single auto-wait against a static
 * DOM that will never gain the row on its own.
 *
 * @param {string} agreementReference - the agreement the claim belongs to.
 * @param {string} claimReference - the claim to open within it.
 * @returns {Promise<void>}
 */
export async function openClaim(agreementReference, claimReference) {
  await openAgreement(agreementReference);
  const claimLink = $(getViewClaimLinkSelector(claimReference));
  await browser.waitUntil(
    async () => {
      if (await claimLink.isExisting()) {
        return true;
      }
      await browser.refresh();
      return false;
    },
    {
      timeout: 60000,
      interval: 2000,
      timeoutMsg: `Claim ${claimReference} did not appear on agreement ${agreementReference}`,
    },
  );
  await claimLink.click();
}

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
  await openClaim(agreementReference, claimReference);
  await $(BO_RECOMMEND_TO_PAY_BUTTON).click();
  await $(BO_CHECKED_CHECKLIST_CHECKBOX).click();
  await $(BO_SENT_CHECK_LIST_CHECKBOX).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Recommended to pay"));

  // Swapping to another user to approve the claim
  await swapBackOfficeUser("Admin");
  await openClaim(agreementReference, claimReference);
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
  await fillDateRange({ from, to });
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Opens the advanced search disclosure and filters the claims list by a "claim
 * date from" and/or "claim date to" range. The claims list is the backoffice
 * landing page, so no tab click is needed.
 *
 * @param {object} [range] - the date range to filter by.
 * @param {{ day: string, month: string, year: string }} [range.from] - the "date from" bound; omitted leaves it blank.
 * @param {{ day: string, month: string, year: string }} [range.to] - the "date to" bound; omitted leaves it blank.
 * @returns {Promise<void>}
 */
export async function searchClaimsByDateRange({ from, to } = {}) {
  await browser.url(getBackOfficeUrl());
  await fillDateRange({ from, to });
  await $(BO_ADVANCED_SEARCH_BUTTON).click();
}

/**
 * Opens the advanced search disclosure and writes the date range into the
 * shared "date from"/"date to" inputs.
 *
 * Every field is written, blanking omitted parts, so date values left in the
 * session from an earlier search don't survive to invert the current range.
 *
 * @param {{ from?: object, to?: object }} range - the date range to write.
 * @returns {Promise<void>}
 */
async function fillDateRange({ from, to }) {
  await $(BO_ADVANCED_SEARCH_SUMMARY).click();
  const fields = [
    [BO_DATE_FROM_DAY, from?.day],
    [BO_DATE_FROM_MONTH, from?.month],
    [BO_DATE_FROM_YEAR, from?.year],
    [BO_DATE_TO_DAY, to?.day],
    [BO_DATE_TO_MONTH, to?.month],
    [BO_DATE_TO_YEAR, to?.year],
  ];
  for (const [selector, value] of fields) {
    const field = $(selector);
    await field.clearValue();
    if (value) {
      await field.setValue(value);
    }
  }
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
 * Asserts the results list holds at least one claim.
 *
 * @returns {Promise<void>}
 */
export async function expectClaimsFound() {
  const referenceLinks = await $$(BO_CLAIM_REFERENCE_LINKS);
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
  await openClaim(agreementReference, claimReference);
  await $(BO_REJECT_BUTTON).waitForDisplayed();
  await $(BO_REJECT_BUTTON).click();
  await $(BO_PAY_CHECKBOX_ONE).click();
  await $(BO_PAY_CHECKBOX_TWO).click();
  await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
  await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Rejected"));
}
