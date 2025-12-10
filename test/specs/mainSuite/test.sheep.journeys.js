import { expect, $ } from "@wdio/globals";
import {
  performDevLogin,
  clickOnElementAndContinue,
  enterVisitDateAndContinue,
  fillInputAndContinue,
  verifySubmission,
  clickStartNewClaimButton,
  clickContinueButton,
  enterWhenTestingWasCarriedOutAndContinue,
  chooseRandomHerdReasonsAndContinue,
} from "../../utils/common.js";
import {
  NUMBER_OF_ANIMALS_TESTED,
  VETS_NAME,
  VET_RCVS_NUMBER,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  CLAIMS_MAIN_HEADING_SELECTOR,
  LABORATORY_URN,
  EXTERNAL_GOV_LINK,
  DATE_OF_VISIT_GO_BACK_LINK,
} from "../../utils/selectors.js";
import {
  HERD_NAME,
  HERD_CPH,
  PREVIOUSLY_CLAIMED_NO_ON_SELECT_THE_HERD_PAGE,
  PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE,
} from "../../utils/multiple-herd-selectors.js";
import { MULTIPLE_HERDS_SBI, MULTIPLE_HERD_AGREEMENT_REF } from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import { createSheepReviewClaim } from "../../utils/reviews/index.js";
import { createMultipleHerdSheepFollowUp } from "../../utils/follow-ups/index.js";

let claimReference;

describe("Multiple herd sheep claim journeys", async function () {
  it("can create the first review claim for a flock of sheep for a business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimReference = await createSheepReviewClaim({
      multipleHerdFlag: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));
  });

  it("cannot create a second review claim for the same flock of sheep for the same business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
    await expect($(EXTERNAL_GOV_LINK)).toHaveText(
      expect.stringContaining("There must be at least 10 months between your reviews."),
    );
    await expect($(DATE_OF_VISIT_GO_BACK_LINK)).toHaveText(
      "Enter the date the vet last visited your farm for this review.",
    );
  });

  it("cannot create a follow-up claim for a flock of sheep when its review claim is not approved", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);
    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
    await expect($(EXTERNAL_GOV_LINK)).toHaveText(
      expect.stringContaining(
        "Your review claim must have been approved before you claim for the follow-up that happened after it.",
      ),
    );
  });

  it("cannot create follow-up claim for a different flock of sheep when a review claim hasn't been created and approved for it", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);
    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_NO_ON_SELECT_THE_HERD_PAGE);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
    await expect($(EXTERNAL_GOV_LINK)).toHaveText(
      expect.stringContaining(
        "You must have an approved review claim for the different herd or flock, before you can claim for a follow-up.",
      ),
    );
  });

  it("can create a follow-up claim when a review claim is approved for a flock of sheep", async () => {
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdSheepFollowUp();

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUSH"));
  });

  it("can create a review claim for a different flock of sheep for the same business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    await clickStartNewClaimButton();
    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));
    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterVisitDateAndContinue();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_NO_ON_SELECT_THE_HERD_PAGE);
    await fillInputAndContinue(HERD_NAME, "Commercial flocks");
    await fillInputAndContinue(HERD_CPH, "22/333/4444");
    await chooseRandomHerdReasonsAndContinue();
    await clickContinueButton();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
    await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "10");
    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
    await fillInputAndContinue(LABORATORY_URN, "sh-rr-534344");
    await $(SUBMIT_CLAIM_BUTTON).click();
    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("RESH"));
  });
});
