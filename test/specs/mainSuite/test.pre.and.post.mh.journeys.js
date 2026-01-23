import { expect, $ } from "@wdio/globals";
import { addDescription, TYPE } from "@wdio/allure-reporter";
import {
  clickOnElementAndContinue,
  clickStartNewClaimButton,
  enterPreMHReleaseDateAndContinue,
  enterVisitDateAndContinue,
  performDevLogin,
} from "../../utils/common.js";
import {
  CLAIM_REFERENCE,
  CLAIMS_MAIN_HEADING_SELECTOR,
  EXTERNAL_GOV_LINK,
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
} from "../../utils/selectors.js";
import { PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE } from "../../utils/multiple-herd-selectors.js";
import {
  createMultipleHerdSheepFollowUp,
  createMultipleHerdPigsFollowUpForFirstHerd,
} from "../../utils/follow-ups/index.js";
import { createPigsReviewClaim } from "../../utils/reviews/index.js";
import {
  PRE_POST_MULTIPLE_HERD_SBI,
  PRE__POST_MULTIPLE_HERD_AGREEMENT_REF,
} from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";

// This test suite covers various claim journeys with a visit date after the MH release date for the pre-MH claims

describe("Multiple herds journeys when Pre-MH claims present", async function () {
  it("can create a follow-up claim for a pre-MH sheep review claim if the follow-up visit date is after the MH release date - associating the pre-MH unnamed flock with a real flock", async () => {
    // This test uses data from the script located at changelog/insert_pre_post_mh_application_review.sql
    await performDevLogin(PRE_POST_MULTIPLE_HERD_SBI);

    await createMultipleHerdSheepFollowUp({
      isUnnamedHerdClaimPresent: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUSH"));
  });

  it("cannot create a second follow-up claim, with visit date after MH release date and within 10 months of the first follow-up claim for pre-MH sheep review", async () => {
    // This test uses data from the script located at changelog/insert_pre_post_mh_application_review.sql
    await performDevLogin(PRE_POST_MULTIPLE_HERD_SBI);

    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
    await expect($(EXTERNAL_GOV_LINK)).toHaveText(
      expect.stringContaining("There must be at least 10 months between your follow-ups."),
    );
  });

  it("can create follow-up claim with a visit date after the MH release date for a pre-MH pigs review - associating the pre-MH unnamed herd with a real herd", async () => {
    await performDevLogin(PRE_POST_MULTIPLE_HERD_SBI);

    // note the review is positive - important when creating pig follow ups
    const claimReference = await createPigsReviewClaim({
      enterVisitDateAndContinueFunc: enterPreMHReleaseDateAndContinue,
      isVisitDatePrePigUpdates: true
    });
    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REPI"));

    await approveClaim(PRE__POST_MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(PRE_POST_MULTIPLE_HERD_SBI);

    await createMultipleHerdPigsFollowUpForFirstHerd({
      isUnnamedHerdClaimPresent: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("cannot create a second review claim for pigs unnamed herd when visit date is after MH release date and second review claim date is within 10 months of its pre-MH review claim", async () => {
    await performDevLogin(PRE_POST_MULTIPLE_HERD_SBI);

    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));
    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
    await expect($(EXTERNAL_GOV_LINK)).toHaveText(
      expect.stringContaining("There must be at least 10 months between your reviews."),
    );
  });

  it("cannot create a second follow-up claim for a different herd or flock when the visit date falls on or after the MH release date and both MH and pre-MH claims are present", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1050", TYPE.MARKDOWN);
    this.skip();
  });

  it("can create a second follow-up claim for an existing herd or flock if the visit date is on or after the MH release date and there are multiple pre-MH claims", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1049", TYPE.MARKDOWN);
    this.skip();
  });

  it("can create a second follow-up claim for an existing herd or flock when the visit date falls on or after the MH release date and both MH and pre-MH claims are present", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1049", TYPE.MARKDOWN);
    this.skip();
  });
});
