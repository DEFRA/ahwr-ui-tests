import { expect, browser, $, $$ } from "@wdio/globals";
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
  getAgreementReferenceSelector,
  getViewClaimLinkSelector,
  getAgreeToMultipleHerdTermsSelector,
  getFlaggedAgreementRowSelector,
  BO_REJECT_BUTTON,
  BO_MOVE_TO_IN_CHECK_BUTTON,
  BO_ON_HOLD_TO_IN_CHECK_CHECKBOX,
  BO_UPDATE_ISSUES_LOG_CHECKBOX,
  BO_CLAIM_SEARCH,
  BO_AGREEMENT_SEARCH,
  BO_SEARCH_BUTTON,
  getClaimSelectorFromTable,
  BO_HISTORY_TAB,
  BO_PII_TEXT,
  BO_PII_CHANGE_BUTTON,
  BO_PII_SUBMIT_BUTTON,
  BO_PII_YES_RADIO,
  BO_PII_NO_RADIO,
  BO_PII_NOTE,
  BO_AGREEMENT_LIST,
  BO_AGREEMENT_ROW_VALUE,
} from "../../utils/backoffice-selectors.js";
import {
  BACK_OFFICE_APPROVE_SBI,
  BACK_OFFICE_REJECT_SBI,
  ON_HOLD_AGREEMENT_REF,
  ON_HOLD_SBI,
  ON_HOLD_COMPANY,
  ON_HOLD_STATUS,
  ON_HOLD_CLAIM_REF,
  ON_HOLD_AGREEMENT_DATE,
  ON_HOLD_CLAIM_DATE,
  ON_HOLD_CLAIM_STATUS,
  ON_HOLD_HERD_TYPE,
} from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import { createSheepReviewClaim } from "../../utils/reviews/index.js";

describe("Backoffice journeys", async function () {
  it("can move a claim from 'In check' to 'Recommend to pay' and then to 'Ready to pay'", async () => {
    const agreementReference = await createAgreement(BACK_OFFICE_APPROVE_SBI);

    await performDevLogin(BACK_OFFICE_APPROVE_SBI);

    const claimReference = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));

    await approveClaim(agreementReference, claimReference);
  });

  it("can move a claim from 'In check' to 'Recommend to reject' and then to 'Rejected'", async () => {
    const agreementReference = await createAgreement(BACK_OFFICE_REJECT_SBI);

    await performDevLogin(BACK_OFFICE_REJECT_SBI);

    const claimReference = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));

    await browser.url(getBackOfficeUrl());
    await $(BO_AGREEMENTS_TAB).click();
    await $(getAgreementReferenceSelector(agreementReference)).click();
    await $(getViewClaimLinkSelector(claimReference)).click();
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
    await $(getAgreementReferenceSelector(agreementReference)).click();
    await $(getViewClaimLinkSelector(claimReference)).click();
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
    await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
    await $(getViewClaimLinkSelector(ON_HOLD_CLAIM_REF)).click();

    await $(BO_MOVE_TO_IN_CHECK_BUTTON).waitForDisplayed();
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
    await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
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
    const agreementSummary = await $$(BO_AGREEMENT_LIST)[0];
    const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

    expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);

    await $(BO_HISTORY_TAB).click();

    const rows = await $$("table.govuk-table tbody tr");
    await expect(rows.length).toBeGreaterThan(0);
  });

  describe("can find correct agreement", () => {
    it("by searching using agreement reference.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_AGREEMENT_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using SBI.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_SBI);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using business.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_COMPANY);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using agreement date.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_AGREEMENT_DATE);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using status.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_STATUS);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });
  });

  describe("can find a claim", () => {
    it("by searching using claim reference.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_CLAIM_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using SBI.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_SBI);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using herd type.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_HERD_TYPE);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using claim date.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_CLAIM_DATE);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using status.", async function () {
      await browser.url(getBackOfficeUrl());
      // Be aware that as part of other tests, the status
      // was changed to Rejected
      await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_CLAIM_STATUS);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
      const agreementSummary = $$(BO_AGREEMENT_LIST)[0];
      const agreementReference = agreementSummary.$(BO_AGREEMENT_ROW_VALUE);

      expect(agreementReference).toHaveText(ON_HOLD_AGREEMENT_REF);
    });
  });

  describe("can use the option to exempt an agreement from PII redaction", () => {
    beforeEach(async () => {
      // Only super users currently can change
      // This user (that gets converted to developer+super@defra.gov.uk
      // Is given super admin in the docker.composer.yml
      await swapBackOfficeUser("super");
    });

    afterEach(async () => {
      await swapBackOfficeUser("Admin");
    });

    it("toggle OFF", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_AGREEMENT_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();

      await $(BO_PII_CHANGE_BUTTON).click();

      // We select No in the form that has appeared
      await $(BO_PII_NO_RADIO).click();
      await $(BO_PII_NOTE).setValue("Setting to no");
      await $(BO_PII_SUBMIT_BUTTON).click();

      const eligibleValue = $(BO_PII_TEXT);
      expect(eligibleValue).toHaveText("No");
    });

    it("toggle ON", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_AGREEMENT_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();

      await $(BO_PII_CHANGE_BUTTON).click();

      // We select No in the form that has appeared
      await $(BO_PII_YES_RADIO).click();
      await $(BO_PII_NOTE).setValue("Setting to yes");
      await $(BO_PII_SUBMIT_BUTTON).click();

      const eligibleValue = $(BO_PII_TEXT);
      expect(eligibleValue).toHaveText("Yes");
    });
  });
});
