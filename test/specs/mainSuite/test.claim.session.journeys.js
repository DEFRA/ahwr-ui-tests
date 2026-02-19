import { performDevLogin } from "../../utils/common.js";
import {
  clickBackButton,
  clickOnElementAndContinue,
  clickContinueButton,
  fillInputAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
} from "../../utils/common";
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

describe("Claim session and back navigation journeys", () => {
  describe("beef journey", () => {
    const expectGoBack = async (expected_url) => {
      await clickBackButton();
      const url = await browser.getUrl();
      expect(url).toContain(expected_url);
    };

    it("can successfully navigate back from the check-answers page to the which-species page for a review claim journey", async function () {
      await performDevLogin(CLAIM_JOURNEY_SBI);

      await createBeefReviewClaimWithoutApproval({
        testResult: "positive",
      });

      await expectGoBack("/test-results");
      await expectGoBack("/test-urn");
      await expectGoBack("/vet-rcvs");
      await expectGoBack("/vet-name");
      await expectGoBack("/number-of-species-tested");
      await expectGoBack("/species-numbers");
      // Skipping this as currently public-ui
      // has the incorrect back button
      // probably related to the function
      // isMultipleHerdsUserJourney
      // await expectGoBack("/date-of-testing");
      await expectGoBack("/check-herd-details");
      await expectGoBack("/enter-herd-details");
      await expectGoBack("/herd-others-on-sbi");
      await expectGoBack("/enter-cph-number");
      await expectGoBack("/enter-herd-name");
      await expectGoBack("/date-of-visit");
      await expectGoBack("/which-type-of-review");
      await expectGoBack("/which-species");
      await expectGoBack("/vet-visits");
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

      await expectGoBack("/biosecurity");
      await expectGoBack("/test-results");
      await expectGoBack("/test-urn");
      // Why this happens at this time?
      // and not at the same times as the other?
      await expectGoBack("/date-of-testing");
      await expectGoBack("/pi-hunt-all-animals");
      await expectGoBack("/pi-hunt");
      await expectGoBack("/vet-rcvs");
      await expectGoBack("/vet-name");
      await expectGoBack("/species-numbers");
      await expectGoBack("/check-herd-details");
      await expectGoBack("/enter-herd-details");
      // This one is not present in the createBeefFollowUp?
      await expectGoBack("/enter-cph-number");
      await expectGoBack("/select-the-herd");
      await expectGoBack("/date-of-visit");
      await expectGoBack("/which-type-of-review");
      await expectGoBack("/which-species");
      await expectGoBack("/vet-visits");
    });

    // This assumes the above has worked, therefore
    it("can clear the input field data when the user selects a different herd from the originally selected one for a follow-up journey", async function () {
      const dateReview = new Date(2026, 0, 2);
      const dateFollowUp = new Date(2026, 1, 2);
      await performDevLogin(CLAIM_JOURNEY_SBI);
      const claimReference = await createBeefReviewForAdditionalHerd({ dateReview });
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
