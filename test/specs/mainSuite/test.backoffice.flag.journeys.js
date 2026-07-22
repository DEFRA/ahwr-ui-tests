import { expect, browser, $, $$ } from "@wdio/globals";
import {
  performDevLogin,
  fillInput,
  swapBackOfficeUser,
  getBackOfficeUrl,
} from "../../utils/common.js";
import {
  BO_FLAGS_TAB,
  BO_CLAIM_STATUS_TEXT,
  BO_CREATE_AGREEMENT_FLAG_CTA,
  BO_AGREEMENT_REFERENCE,
  BO_FLAG_CREATION_NOTE,
  BO_CREATE_FLAG_BUTTON,
  BO_DELETE_FLAG_BUTTON,
  BO_FLAG_DELETION_NOTE,
  BO_SUBMIT_DELETE_FLAG_BUTTON,
  getAgreementReferenceSelector,
  getFlaggedAgreementRowSelector,
} from "../../utils/backoffice-selectors.js";

import {
  POULTRY_FLAG_SBI,
  POULTRY_FLAG_AGREEMENT_REF,
  ON_HOLD_AGREEMENT_REF,
  LIVESTOCK_FLAG_SBI,
  LIVESTOCK_FLAG_AGREEMENT_REF,
} from "../../utils/constants.js";
import {
  openClaim,
  searchAgreementsByFlag,
  expectAllAgreementsToBeFlagged,
  expectNoAgreementsToBeFlagged,
} from "../../utils/backoffice-common.js";
import { createPoultryReviewClaim } from "../../utils/reviews/poultry.js";
import { createBeefReviewClaim } from "../../utils/reviews/beef.js";

describe("Backoffice flag journeys", async function () {
  it("creates and deletes a flag for an agreement", async () => {
    await swapBackOfficeUser("super");

    // Agreement flag creation
    await browser.url(getBackOfficeUrl());
    await $(BO_FLAGS_TAB).click();
    await $(BO_CREATE_AGREEMENT_FLAG_CTA).click();
    await fillInput(BO_AGREEMENT_REFERENCE, ON_HOLD_AGREEMENT_REF);
    await fillInput(BO_FLAG_CREATION_NOTE, "Flag creation notes");
    await $(BO_CREATE_FLAG_BUTTON).click();

    // Agreement flag deletion
    const flaggedAgreementRow = $(getFlaggedAgreementRowSelector(ON_HOLD_AGREEMENT_REF));
    await flaggedAgreementRow.$(BO_DELETE_FLAG_BUTTON).click();
    await fillInput(BO_FLAG_DELETION_NOTE, "Flag deletion notes");
    await $(BO_SUBMIT_DELETE_FLAG_BUTTON).click();
    const flaggedAgreementRows = await $$(getFlaggedAgreementRowSelector(ON_HOLD_AGREEMENT_REF));
    expect(flaggedAgreementRows.length).toBe(0);
  });

  it("poultry claim goes to in-check status when its agreement is flagged", async () => {
    await swapBackOfficeUser("super");

    // Agreement flag creation
    await browser.url(getBackOfficeUrl());
    await $(BO_FLAGS_TAB).click();
    await $(BO_CREATE_AGREEMENT_FLAG_CTA).click();
    await fillInput(BO_AGREEMENT_REFERENCE, POULTRY_FLAG_AGREEMENT_REF);
    await fillInput(BO_FLAG_CREATION_NOTE, "Flag creation notes");
    await $(BO_CREATE_FLAG_BUTTON).click();

    // Create the poultry claim and verify its status is in-check
    await performDevLogin(POULTRY_FLAG_SBI);
    const claimReference = await createPoultryReviewClaim({
      poultryType: "chickens",
      siteName: "Poultry Flag Site",
      siteCph: "99/284/4093",
      isReviewForAdditionalSite: false,
    });
    expect(claimReference).toEqual(expect.stringContaining("PORE"));
    await browser.url(getBackOfficeUrl());
    await openClaim(POULTRY_FLAG_AGREEMENT_REF, claimReference);
    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("In check"));
  });

  it("livestock claim goes to in-check status when its agreement is flagged", async () => {
    await swapBackOfficeUser("super");

    // Agreement flag creation
    await browser.url(getBackOfficeUrl());
    await $(BO_FLAGS_TAB).click();
    await $(BO_CREATE_AGREEMENT_FLAG_CTA).click();
    await fillInput(BO_AGREEMENT_REFERENCE, LIVESTOCK_FLAG_AGREEMENT_REF);
    await fillInput(BO_FLAG_CREATION_NOTE, "Flag creation notes");
    await $(BO_CREATE_FLAG_BUTTON).click();

    // Create a livestock claim and verify its status is in-check
    await performDevLogin(LIVESTOCK_FLAG_SBI);

    const claimReference = await createBeefReviewClaim({
      testResult: "positive",
      urn: "bc-rr-644351",
    });
    expect(claimReference).toEqual(expect.stringContaining("REBC"));
    await browser.url(getBackOfficeUrl());
    await openClaim(LIVESTOCK_FLAG_AGREEMENT_REF, claimReference);
    await expect($(BO_CLAIM_STATUS_TEXT)).toHaveText(expect.stringContaining("In check"));
  });

  // These run after the flags above have been created (and not deleted), so at
  // least one flagged agreement exists for the FLAGGED filter to return.
  describe("filters agreements by flag using advanced search", () => {
    it("returns only flagged agreements when FLAGGED is selected", async () => {
      await searchAgreementsByFlag("FLAGGED");
      await expectAllAgreementsToBeFlagged();
      await expect($(getAgreementReferenceSelector(POULTRY_FLAG_AGREEMENT_REF))).toBeDisplayed();
    });

    it("excludes flagged agreements when NOT_FLAGGED is selected", async () => {
      await searchAgreementsByFlag("NOT_FLAGGED");
      await expectNoAgreementsToBeFlagged();
      await expect($(getAgreementReferenceSelector(POULTRY_FLAG_AGREEMENT_REF))).not.toBeExisting();
    });
  });
});
