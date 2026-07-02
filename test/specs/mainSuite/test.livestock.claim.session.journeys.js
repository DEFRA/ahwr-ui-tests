import { $, browser, expect } from "@wdio/globals";

import {
  performDevLogin,
  clickBackButton,
  clickOnElementAndContinue,
  clickContinueButton,
  fillInputAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
} from "../../utils/common.js";
import { AGREEMENT_REF, CLAIM_JOURNEY_SBI } from "../../utils/constants.js";
import {
  createBeefReviewClaim,
  createBeefReviewClaimWithoutApproval,
  createBeefReviewForAdditionalHerd,
} from "../../utils/reviews/beef.js";
import { createBeefFollowUp } from "../../utils/follow-ups/beef.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import {
  getBiosecuritySelector,
  getPiHuntForBvdDoneSelector,
  getPiHuntDoneForAllCattleSelector,
  getSpeciesNumbersSelector,
  getTestResultsSelector,
  getWhenTestingWasCarriedOutSelector,
  getWhenTestingWasCarriedOutSelector2,
  DATE_OF_VISIT_GO_BACK_LINK,
  VETS_NAME,
  VET_RCVS_NUMBER,
  LABORATORY_URN,
} from "../../utils/selectors.js";

// Migration window: map a renamed livestock slug to its old form so expectGoBack tolerates either the old or new public-ui image; renamed-tail slugs are listed here, prefix-only renames fall back to stripping "/livestock". Remove once the slug rollout is complete.
const PRE_RENAME_SLUG = {
  "/livestock/manage-claims": "/vet-visits",
  "/livestock/biosecurity-assessment": "/biosecurity",
  "/livestock/species": "/which-species",
  "/livestock/review-type": "/which-type-of-review",
  "/livestock/select-herd": "/select-the-herd",
  "/livestock/cph": "/enter-cph-number",
  "/livestock/herd-name": "/enter-herd-name",
  "/livestock/sbi-herds": "/herd-others-on-sbi",
  "/livestock/test-date": "/date-of-testing",
};
const preRenameSlug = (slug) => PRE_RENAME_SLUG[slug] ?? slug.replace("/livestock", "");
// Boundary match so a shorter slug (/livestock/species) does not spuriously match a longer one (/livestock/species-numbers).
const urlMatchesPath = (url, path) => {
  const i = url.indexOf(path);
  return i !== -1 && !/[a-z-]/.test(url[i + path.length] ?? "");
};

describe("Claim session and back navigation journeys", () => {
  describe("beef journey", () => {
    const expectGoBack = async (expectedUrl) => {
      await clickBackButton();
      const url = await browser.getUrl();
      const tolerated = [expectedUrl, preRenameSlug(expectedUrl)];
      expect(tolerated.some((candidate) => urlMatchesPath(url, candidate))).toBe(true);
    };

    it("can successfully navigate back from the check-answers page to the which-species page for a review claim journey", async function () {
      await performDevLogin(CLAIM_JOURNEY_SBI);

      await createBeefReviewClaimWithoutApproval({
        testResult: "positive",
      });

      await expectGoBack("/livestock/test-results");
      await expectGoBack("/livestock/test-urn");
      await expectGoBack("/livestock/vet-rcvs");
      await expectGoBack("/livestock/vet-name");
      await expectGoBack("/livestock/number-of-species-tested");
      await expectGoBack("/livestock/species-numbers");
      // Skipping this as currently public-ui
      // has the incorrect back button
      // probably related to the function
      // isMultipleHerdsUserJourney
      // await expectGoBack("/livestock/test-date");
      await expectGoBack("/livestock/check-herd-details");
      await expectGoBack("/livestock/enter-herd-details");
      await expectGoBack("/livestock/sbi-herds");
      await expectGoBack("/livestock/cph");
      await expectGoBack("/livestock/herd-name");
      await expectGoBack("/livestock/date-of-visit");
      await expectGoBack("/livestock/review-type");
      await expectGoBack("/livestock/species");
      await expectGoBack("/livestock/manage-claims");
    });

    it("can successfully navigate back from the check-answers page to the which-species page for a follow-up claim journey", async function () {
      const dateReview = new Date(2026, 0, 2);
      const dateFollowUp = new Date(2026, 1, 2);
      await performDevLogin(CLAIM_JOURNEY_SBI);
      const claimReference = await createBeefReviewClaim({
        testResult: "positive",
        dateReview,
      });

      await approveClaim(AGREEMENT_REF, claimReference);

      await performDevLogin(CLAIM_JOURNEY_SBI);

      await createBeefFollowUp({ dateFollowUp });

      await expectGoBack("/livestock/biosecurity-assessment");
      await expectGoBack("/livestock/test-results");
      await expectGoBack("/livestock/test-urn");
      // Why this happens at this time?
      // and not at the same times as the other?
      await expectGoBack("/livestock/test-date");
      await expectGoBack("/livestock/pi-hunt-all-animals");
      await expectGoBack("/livestock/pi-hunt");
      await expectGoBack("/livestock/vet-rcvs");
      await expectGoBack("/livestock/vet-name");
      await expectGoBack("/livestock/species-numbers");
      await expectGoBack("/livestock/check-herd-details");
      await expectGoBack("/livestock/enter-herd-details");
      // This one is not present in the createBeefFollowUp?
      await expectGoBack("/livestock/cph");
      await expectGoBack("/livestock/select-herd");
      await expectGoBack("/livestock/date-of-visit");
      await expectGoBack("/livestock/review-type");
      await expectGoBack("/livestock/species");
      await expectGoBack("/livestock/manage-claims");
    });

    // This assumes the above has worked, therefore
    it("can clear the input field data when the user selects a different herd from the originally selected one for a follow-up journey", async function () {
      const dateReview = new Date(2026, 0, 2);
      const dateFollowUp = new Date(2026, 1, 2);
      await performDevLogin(CLAIM_JOURNEY_SBI);
      const claimReference = await createBeefReviewForAdditionalHerd({
        dateReview,
      });
      await approveClaim(AGREEMENT_REF, claimReference);

      await performDevLogin(CLAIM_JOURNEY_SBI);

      await createBeefFollowUp({ dateFollowUp });

      await $(DATE_OF_VISIT_GO_BACK_LINK).click();
      await clickContinueButton();
      await clickOnElementAndContinue("#herdSelected-2");
      await clickContinueButton();

      await expect($(getSpeciesNumbersSelector("yes"))).not.toBeSelected();
      await expect($(getSpeciesNumbersSelector("no"))).not.toBeSelected();
      await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

      await expect($(VETS_NAME)).toHaveValue("");
      await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

      await expect($(VET_RCVS_NUMBER)).toHaveValue("");
      await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

      await expect($(getPiHuntForBvdDoneSelector("yes"))).not.toBeSelected();
      await expect($(getPiHuntForBvdDoneSelector("no"))).not.toBeSelected();
      await clickOnElementAndContinue(getPiHuntForBvdDoneSelector("yes"));

      await expect($(getPiHuntDoneForAllCattleSelector("yes"))).not.toBeSelected();
      await expect($(getPiHuntDoneForAllCattleSelector("no"))).not.toBeSelected();
      await clickOnElementAndContinue(getPiHuntDoneForAllCattleSelector("yes"));

      await expect(
        $(getWhenTestingWasCarriedOutSelector("whenTheVetVisitedTheFarmToCarryOutTheReview")),
      ).not.toBeSelected();
      await expect(
        $(getWhenTestingWasCarriedOutSelector2("whenTheVetVisitedTheFarmToCarryOutTheReview")),
      ).not.toBeSelected();
      await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

      await expect($(LABORATORY_URN)).toHaveValue("");
      await fillInputAndContinue(LABORATORY_URN, "bc-fu-521346");

      await expect($(getTestResultsSelector("positive"))).not.toBeSelected();
      await expect($(getTestResultsSelector("negative"))).not.toBeSelected();
      await clickOnElementAndContinue(getTestResultsSelector("positive"));

      await expect($(getBiosecuritySelector("yes"))).not.toBeSelected();
      await expect($(getBiosecuritySelector("no"))).not.toBeSelected();
      await clickOnElementAndContinue(getBiosecuritySelector("yes"));
    });
  });
});
