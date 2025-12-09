import { expect, browser, $, $$ } from "@wdio/globals";
import { addDescription, TYPE } from "@wdio/allure-reporter";
import {
  fillInput,
  createAgreement,
  swapBackOfficeUser,
  performDevLogin,
  getBackOfficeUrl,
} from "../../utils/common.js";
import {
  BO_AGREEMENTS_TAB,
  BO_FLAGS_TAB,
  BO_RECOMMEND_TO_REJECT_BUTTON,
  BO_CHECKED_CHECKLIST_CHECKBOX,
  BO_SENT_CHECK_LIST_CHECKBOX,
  BO_CONFIRM_AND_CONTINUE_BUTTON,
  BO_CLAIM_STATUS_TEXT,
  BO_PAY_CHECKBOX_ONE,
  BO_PAY_CHECKBOX_TWO,
  BO_CREATE_AGREEMENT_FLAG_CTA,
  BO_AGREEMENT_REFERENCE,
  BO_FLAG_CREATION_NOTE,
  BO_CREATE_FLAG_BUTTON,
  BO_DELETE_FLAG_BUTTON,
  BO_FLAG_DELETION_NOTE,
  BO_SUBMIT_DELETE_FLAG_BUTTON,
  getAgreementNumberSelector,
  getViewClaimLinkSelector,
  getAgreeToMultipleHerdTermsSelector,
  getFlaggedAgreementRowSelector,
  BO_REJECT_BUTTON,
  BO_MOVE_TO_IN_CHECK_BUTTON,
  BO_ON_HOLD_TO_IN_CHECK_CHECKBOX,
  BO_UPDATE_ISSUES_LOG_CHECKBOX,
  BO_CLAIM_SEARCH,
  BO_SEARCH_BUTTON,
  getClaimSelectorFromTable,
  BO_HISTORY_TAB,
} from "../../utils/backoffice-selectors.js";
import {
  BACK_OFFICE_APPROVE_SBI,
  BACK_OFFICE_REJECT_SBI,
  ON_HOLD_AGREEMENT_REF,
  ON_HOLD_CLAIM_REF,
} from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import { createSheepReviewClaim } from "../../utils/reviews/index.js";

describe("Backoffice journeys", async function () {
  // this.retries(2);

  it("can move a claim from 'In check' to 'Recommend to pay' and then to 'Ready to pay'", async () => {
    const agreementNumber = await createAgreement(BACK_OFFICE_APPROVE_SBI);

    await performDevLogin(BACK_OFFICE_APPROVE_SBI);

    const claimNumber = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimNumber).toEqual(expect.stringContaining("RESH"));

    await approveClaim(agreementNumber, claimNumber);
  });

  it("can move a claim from 'In check' to 'Recommend to reject' and then to 'Rejected'", async () => {
    const agreementNumber = await createAgreement(BACK_OFFICE_REJECT_SBI);

    await performDevLogin(BACK_OFFICE_REJECT_SBI);

    const claimNumber = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimNumber).toEqual(expect.stringContaining("RESH"));

    await browser.url(getBackOfficeUrl());
    await $(BO_AGREEMENTS_TAB).click();
    await $(getAgreementNumberSelector(agreementNumber)).click();
    await $(getViewClaimLinkSelector(claimNumber)).click();
    await $(BO_RECOMMEND_TO_REJECT_BUTTON).click();
    await $(BO_CHECKED_CHECKLIST_CHECKBOX).click();
    await $(BO_SENT_CHECK_LIST_CHECKBOX).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(
      expect.stringContaining("Recommended to reject"),
    );

    // Swapping to another user to reject the claim
    await swapBackOfficeUser("Rejector");
    await $(BO_AGREEMENTS_TAB).click();
    await $(getAgreementNumberSelector(agreementNumber)).click();
    await $(getViewClaimLinkSelector(claimNumber)).click();
    await $(BO_REJECT_BUTTON).click();
    await $(BO_PAY_CHECKBOX_ONE).click();
    await $(BO_PAY_CHECKBOX_TWO).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();
    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Rejected"));
  });

  it("creates and deletes a flag for an agreement", async () => {
    // Agreement flag creation
    await browser.url(getBackOfficeUrl());
    await $(BO_FLAGS_TAB).click();
    await $(BO_CREATE_AGREEMENT_FLAG_CTA).click();
    await fillInput(BO_AGREEMENT_REFERENCE, ON_HOLD_AGREEMENT_REF);
    await fillInput(BO_FLAG_CREATION_NOTE, "Flag creation notes");
    await $(getAgreeToMultipleHerdTermsSelector("yes")).click();
    await $(BO_CREATE_FLAG_BUTTON).click();

    // Agreement flag deletion
    const flaggedAgreementRow = $(getFlaggedAgreementRowSelector(ON_HOLD_AGREEMENT_REF, "Yes"));
    await flaggedAgreementRow.$(BO_DELETE_FLAG_BUTTON).click();
    await fillInput(BO_FLAG_DELETION_NOTE, "Flag deletion notes");
    await $(BO_SUBMIT_DELETE_FLAG_BUTTON).click();
    const flaggedAgreementRows = await $$(
      getFlaggedAgreementRowSelector(ON_HOLD_AGREEMENT_REF, "Yes"),
    );
    expect(flaggedAgreementRows.length).toBe(0);
  });

  it("can move an on hold claim from 'On hold' to 'In check' and then to 'Recommend to reject', and finally 'Rejected'", async () => {
    await swapBackOfficeUser("Initial-user");
    await $(BO_AGREEMENTS_TAB).click();
    await $(getAgreementNumberSelector(agreementNumber)).click();
    await $(getViewClaimLinkSelector(ON_HOLD_CLAIM_REF)).click();

    await $(BO_MOVE_TO_IN_CHECK_BUTTON).click();
    await $(BO_ON_HOLD_TO_IN_CHECK_CHECKBOX).click();
    await $(BO_UPDATE_ISSUES_LOG_CHECKBOX).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();

    await $(BO_RECOMMEND_TO_REJECT_BUTTON).click();
    await $(BO_CHECKED_CHECKLIST_CHECKBOX).click();
    await $(BO_SENT_CHECK_LIST_CHECKBOX).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();

    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(
      expect.stringContaining("Recommended to reject"),
    );

    // Swapping to another user to reject the claim
    await swapBackOfficeUser("Rejector");
    await $(BO_AGREEMENTS_TAB).click();
    await $(getAgreementNumberSelector(agreementNumber)).click();
    await $(getViewClaimLinkSelector(ON_HOLD_CLAIM_REF)).click();

    await $(BO_REJECT_BUTTON).click();
    await $(BO_PAY_CHECKBOX_ONE).click();
    await $(BO_PAY_CHECKBOX_TWO).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();

    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("Rejected"));
  });

  it("can search for a claim and view its information", async () => {
    await browser.url(getBackOfficeUrl());
    await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_CLAIM_REF);
    await $(BO_SEARCH_BUTTON).click();
    await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
    const agreementSummary = await $$("dl.govuk-summary-list")[0];
    const agreementReference = agreementSummary.$(
      ".govuk-summary-list__row .govuk-summary-list__value",
    );

    expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);

    await $(BO_HISTORY_TAB).click();

    const rows = await $$("table.govuk-table tbody tr");
    await expect(rows.length).toBeGreaterThan(0);
  });

  it("can find an agreement by searching using agreement number, business, SBI, agreement date or status and verify the the agreement details are correct.", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1314", TYPE.MARKDOWN);
    this.skip();
  });

  it("can find a claim by searching using visit type, SBI, claim date or status and verify the claim details are correct.", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1314", TYPE.MARKDOWN);
    this.skip();
  });

  it("can use the option to exempt an agreement from PII redaction — that is, to toggle the exemption flag ON or OFF", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1314", TYPE.MARKDOWN);
    this.skip();
  });
});
