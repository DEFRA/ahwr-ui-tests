import { browser, $, expect } from "@wdio/globals";
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
