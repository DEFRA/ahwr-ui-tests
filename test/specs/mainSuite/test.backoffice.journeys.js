import { expect, browser, $ } from "@wdio/globals";
import {
  createAgreement,
  swapBackOfficeUser,
  performDevLogin,
  getBackOfficeUrl,
} from "../../utils/common.js";
import {
  BO_AGREEMENTS_TAB,
  BO_CONFIRM_AND_CONTINUE_BUTTON,
  getAgreementReferenceSelector,
  BO_MOVE_TO_IN_CHECK_BUTTON,
  BO_ON_HOLD_TO_IN_CHECK_CHECKBOX,
  BO_UPDATE_ISSUES_LOG_CHECKBOX,
  BO_CLAIM_SEARCH,
  BO_AGREEMENT_SEARCH,
  BO_SEARCH_BUTTON,
  BO_ADVANCED_SEARCH_SUMMARY,
  BO_AGREEMENT_TYPE_SELECT,
  BO_CLAIM_TYPE_SELECT,
  BO_ADVANCED_SEARCH_BUTTON,
  BO_CLEAR_FILTERS_LINK,
  getClaimSelectorFromTable,
  BO_HISTORY_TAB,
  BO_PII_TEXT,
  BO_PII_CHANGE_BUTTON,
  BO_PII_SUBMIT_BUTTON,
  BO_PII_YES_RADIO,
  BO_PII_NO_RADIO,
  BO_PII_NOTE,
} from "../../utils/backoffice-selectors.js";
import {
  BACK_OFFICE_POULTRY_APPROVE_SBI,
  BACK_OFFICE_POULTRY_REJECT_SBI,
  ON_HOLD_AGREEMENT_REF,
  ON_HOLD_SBI,
  ON_HOLD_COMPANY,
  ON_HOLD_STATUS,
  ON_HOLD_CLAIM_REF,
  SEARCH_SBI,
  SEARCH_CLAIM_DATE,
  SEARCH_CLAIM_REF,
  SEARCH_HERD_TYPE,
  SEARCH_CLAIM_STATUS,
  SEARCH_AGREEMENT_REF,
  SEARCH_FOLLOW_UP_CLAIM_REF,
  IAHW_REFERENCE_PREFIXES,
  PBR_REFERENCE_PREFIXES,
  POULTRY_CLAIM_REF,
} from "../../utils/constants.js";
import {
  approveClaim,
  openClaim,
  expectAgreementReference,
  expectNoAgreementsFound,
  expectNoClaimsFound,
  recommendClaimToReject,
  rejectClaim,
  searchAgreementsByType,
  expectAllAgreementsToStartWith,
  searchAgreementsByDateRange,
  expectAgreementsFound,
  searchAgreementsByStatus,
  expectAllAgreementsToHaveStatus,
} from "../../utils/backoffice-common.js";
import { createSheepReviewClaim } from "../../utils/reviews/index.js";

describe("Backoffice journeys", async function () {
  it("can move a claim from 'In check' to 'Recommend to pay' and then to 'Ready to pay'", async () => {
    const agreementReference = await createAgreement(BACK_OFFICE_POULTRY_APPROVE_SBI);

    await performDevLogin(BACK_OFFICE_POULTRY_APPROVE_SBI);

    const claimReference = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));

    await approveClaim(agreementReference, claimReference);
  });

  it("can move a claim from 'In check' to 'Recommend to reject' and then to 'Rejected'", async () => {
    const agreementReference = await createAgreement(BACK_OFFICE_POULTRY_REJECT_SBI);

    await performDevLogin(BACK_OFFICE_POULTRY_REJECT_SBI);

    const claimReference = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));

    await browser.url(getBackOfficeUrl());
    await openClaim(agreementReference, claimReference);
    await recommendClaimToReject();

    await rejectClaim(agreementReference, claimReference);
  });

  it("can move an on hold claim from 'On hold' to 'In check' and then to 'Recommend to reject', and finally 'Rejected'", async () => {
    await swapBackOfficeUser("Initial-user");
    await openClaim(ON_HOLD_AGREEMENT_REF, ON_HOLD_CLAIM_REF);

    await $(BO_MOVE_TO_IN_CHECK_BUTTON).waitForDisplayed();
    await $(BO_MOVE_TO_IN_CHECK_BUTTON).click();
    await $(BO_ON_HOLD_TO_IN_CHECK_CHECKBOX).click();
    await $(BO_UPDATE_ISSUES_LOG_CHECKBOX).click();
    await $(BO_CONFIRM_AND_CONTINUE_BUTTON).click();

    await recommendClaimToReject();

    await rejectClaim(ON_HOLD_AGREEMENT_REF, ON_HOLD_CLAIM_REF);
  });

  it("can search for a claim and view its information", async () => {
    await browser.url(getBackOfficeUrl());
    await $(BO_CLAIM_SEARCH).setValue(ON_HOLD_CLAIM_REF);
    await $(BO_SEARCH_BUTTON).click();
    await $(getClaimSelectorFromTable(ON_HOLD_CLAIM_REF)).click();
    await expectAgreementReference(ON_HOLD_AGREEMENT_REF);

    await $(BO_HISTORY_TAB).click();

    // At least one history row is present once the tab has rendered.
    await expect($("table.govuk-table tbody tr")).toBeDisplayed();
  });

  describe("can find correct agreement", () => {
    it("by searching using agreement reference.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_AGREEMENT_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      await expectAgreementReference(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using SBI.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_SBI);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      await expectAgreementReference(ON_HOLD_AGREEMENT_REF);
    });

    it("by searching using business.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_COMPANY);
      await $(BO_SEARCH_BUTTON).click();
      await $(getAgreementReferenceSelector(ON_HOLD_AGREEMENT_REF)).click();
      await expectAgreementReference(ON_HOLD_AGREEMENT_REF);
    });
  });

  describe("uses advanced search to filter agreements", () => {
    describe("by type", () => {
      it("can search by IAHW agreement type", async function () {
        await searchAgreementsByType("IAHW");
        await expectAllAgreementsToStartWith(IAHW_REFERENCE_PREFIXES);
      });

      it("can search by PBR agreement type", async function () {
        await searchAgreementsByType("PBR");
        await expectAllAgreementsToStartWith(PBR_REFERENCE_PREFIXES);
      });
    });

    describe("by date", () => {
      // Bounds chosen to sit outside every seeded and freshly-created agreement
      // date, so each test proves the corresponding filter is actually applied.
      const FAR_FUTURE = { day: "1", month: "1", year: "3000" };
      const FAR_PAST = { day: "1", month: "1", year: "2000" };

      it("applies the date-from filter, excluding earlier agreements", async function () {
        await searchAgreementsByDateRange({ from: FAR_FUTURE });
        await expectNoAgreementsFound();
      });

      it("applies the date-to filter, excluding later agreements", async function () {
        await searchAgreementsByDateRange({ to: FAR_PAST });
        await expectNoAgreementsFound();
      });

      it("returns agreements that fall within the date range", async function () {
        await searchAgreementsByDateRange({ from: FAR_PAST, to: FAR_FUTURE });
        await expectAgreementsFound();
      });
    });

    describe("by status", () => {
      it("can search by Agreed status", async function () {
        await searchAgreementsByStatus("AGREED");
        await expectAllAgreementsToHaveStatus("AGREED");
      });
    });
  });

  describe("does not search agreements by status", () => {
    it("returns no results when searching by status.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_AGREEMENTS_TAB).click();
      await $(BO_AGREEMENT_SEARCH).setValue(ON_HOLD_STATUS);
      await $(BO_SEARCH_BUTTON).click();
      await expectNoAgreementsFound();
    });
  });

  describe("can find a claim", () => {
    it("by searching using claim reference.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(SEARCH_CLAIM_REF);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(SEARCH_CLAIM_REF)).click();
      await expectAgreementReference(SEARCH_AGREEMENT_REF);
    });

    it("by searching using SBI.", async function () {
      await browser.url(getBackOfficeUrl());
      await $(BO_CLAIM_SEARCH).setValue(SEARCH_SBI);
      await $(BO_SEARCH_BUTTON).click();
      await $(getClaimSelectorFromTable(SEARCH_CLAIM_REF)).click();
      await expectAgreementReference(SEARCH_AGREEMENT_REF);
    });

    describe("does not search claims", () => {
      it("by searching using herd type.", async function () {
        await browser.url(getBackOfficeUrl());
        await $(BO_CLAIM_SEARCH).setValue(SEARCH_HERD_TYPE);
        await $(BO_SEARCH_BUTTON).click();
        await expectNoClaimsFound();
      });

      it("by searching using claim date.", async function () {
        await browser.url(getBackOfficeUrl());
        await $(BO_CLAIM_SEARCH).setValue(SEARCH_CLAIM_DATE);
        await $(BO_SEARCH_BUTTON).click();
        await expectNoClaimsFound();
      });

      it("by searching using status.", async function () {
        await browser.url(getBackOfficeUrl());
        await $(BO_CLAIM_SEARCH).setValue(SEARCH_CLAIM_STATUS);
        await $(BO_SEARCH_BUTTON).click();
        await expectNoClaimsFound();
      });
    });
  });

  describe("can filter claims by agreement type using advanced search", () => {
    it("returns poultry claims and excludes livestock claims when PBR is selected.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_AGREEMENT_TYPE_SELECT).selectByAttribute("value", "PBR");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();

      await expect($(getClaimSelectorFromTable(POULTRY_CLAIM_REF))).toBeDisplayed();
      await expect($(getClaimSelectorFromTable(SEARCH_CLAIM_REF))).not.toBeExisting();
    });

    it("returns livestock claims and excludes poultry claims when IAHW is selected.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_AGREEMENT_TYPE_SELECT).selectByAttribute("value", "IAHW");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();

      await expect($("table.govuk-table tbody tr")).toBeDisplayed();
      await expect($(getClaimSelectorFromTable(POULTRY_CLAIM_REF))).not.toBeExisting();
    });

    it("resets the agreement type to all types when the filters are cleared.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_AGREEMENT_TYPE_SELECT).selectByAttribute("value", "PBR");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();
      await expect($(getClaimSelectorFromTable(SEARCH_CLAIM_REF))).not.toBeExisting();

      // The advanced search reload collapses the accordion, so re-open it to reach the clear link.
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_CLEAR_FILTERS_LINK).click();

      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await expect($(BO_AGREEMENT_TYPE_SELECT)).toHaveValue("ALL");
    });
  });

  describe("can filter claims by claim type using advanced search", () => {
    it("excludes follow-up claims when Review is selected.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_CLAIM_TYPE_SELECT).selectByAttribute("value", "REVIEW");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();

      await expect($("table.govuk-table tbody tr")).toBeDisplayed();
      await expect($(getClaimSelectorFromTable(SEARCH_FOLLOW_UP_CLAIM_REF))).not.toBeExisting();
    });

    it("excludes review claims when Endemics is selected.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_CLAIM_TYPE_SELECT).selectByAttribute("value", "FOLLOW_UP");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();

      await expect($("table.govuk-table tbody tr")).toBeDisplayed();
      await expect($(getClaimSelectorFromTable(SEARCH_CLAIM_REF))).not.toBeExisting();
    });

    it("resets the claim type to all types when the filters are cleared.", async () => {
      await browser.url(getBackOfficeUrl());
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_CLAIM_TYPE_SELECT).selectByAttribute("value", "FOLLOW_UP");
      await $(BO_ADVANCED_SEARCH_BUTTON).click();
      await expect($(getClaimSelectorFromTable(SEARCH_CLAIM_REF))).not.toBeExisting();

      // The advanced search reload collapses the accordion, so re-open it to reach the clear link.
      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await $(BO_CLEAR_FILTERS_LINK).click();

      await $(BO_ADVANCED_SEARCH_SUMMARY).click();
      await expect($(BO_CLAIM_TYPE_SELECT)).toHaveValue("ALL");
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
