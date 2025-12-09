import { expect, $ } from "@wdio/globals";
import {
  performDevLogin,
  clickOnElementAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
  fillInputAndContinue,
  verifySubmission,
  clickStartNewClaimButton,
  enterPreMHReleaseDateAndContinue,
} from "../../utils/common.js";
import {
  NUMBER_OF_ANIMALS_TESTED,
  VETS_NAME,
  VET_RCVS_NUMBER,
  LABORATORY_URN,
  NUMBER_OF_ORAL_FLUID_SAMPLES,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  getTestResultsSelector,
} from "../../utils/selectors.js";
import { PRE_MH_REVIEWS_HERD_SBI } from "../../utils/constants.js";

describe("Review claim journeys for various species before multiple herds launch", async function () {
  // this.retries(2);

  it("can create a new review claim for Sheep", async () => {
    await performDevLogin(PRE_MH_REVIEWS_HERD_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterPreMHReleaseDateAndContinue();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "10");
    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
    await fillInputAndContinue(LABORATORY_URN, "sh-rr-534346");

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("RESH"));
  });

  it("can create a new pre-MH launch review claim for Pigs", async () => {
    await performDevLogin(PRE_MH_REVIEWS_HERD_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterPreMHReleaseDateAndContinue();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");

    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

    await fillInputAndContinue(LABORATORY_URN, "pg-rr-534346");

    await fillInputAndContinue(NUMBER_OF_ORAL_FLUID_SAMPLES, "10");

    await clickOnElementAndContinue(getTestResultsSelector("positive"));

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REPI"));
  });

  it("can create a new pre-MH launch review claim for Dairy cattle", async () => {
    await performDevLogin(PRE_MH_REVIEWS_HERD_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("dairy"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterPreMHReleaseDateAndContinue();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
    await fillInputAndContinue(LABORATORY_URN, "dc-rr-534346");
    await clickOnElementAndContinue(getTestResultsSelector("positive"));

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REDC"));
  });

  it("can create a new pre-MH launch review claim for Beef cattle", async () => {
    await performDevLogin(PRE_MH_REVIEWS_HERD_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("beef"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("review"));

    await enterPreMHReleaseDateAndContinue();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "10");

    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

    await fillInputAndContinue(LABORATORY_URN, "bc-rr-534346");

    await clickOnElementAndContinue(getTestResultsSelector("positive"));

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REBC"));
  });
});
