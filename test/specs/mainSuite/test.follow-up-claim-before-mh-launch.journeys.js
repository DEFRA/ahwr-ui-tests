import { expect, $ } from "@wdio/globals";
import {
  performDevLogin,
  clickOnElementAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
  fillInputAndContinue,
  selectSheepTestsAndContinue,
  verifySubmission,
  clickStartNewClaimButton,
  enterPreMHReleaseDateAndContinue,
} from "../../utils/common.js";
import {
  NUMBER_OF_ANIMALS_TESTED,
  VETS_NAME,
  VET_RCVS_NUMBER,
  LABORATORY_URN,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  getSheepEndemicsPackageSelector,
  getTestResultSelector,
  getPiHuntForBvdDoneSelector,
  getPiHuntDoneForAllCattleSelector,
  getTestResultsSelector,
  getBiosecuritySelector,
} from "../../utils/selectors.js";
import {
  SHEEP_ENDEMIC_CLAIM_SBI,
  BEEF_ENDEMIC_CLAIM_SBI,
  JOHNES_DISEASE,
} from "../../utils/constants.js";

describe("Follow-up claim journeys for various species before multiple herds launch", async function () {
  

  it("can create a follow-up claim for sheep", async () => {
    await performDevLogin(SHEEP_ENDEMIC_CLAIM_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("sheep"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));

    await enterPreMHReleaseDateAndContinue();

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "10");

    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

    await fillInputAndContinue(VET_RCVS_NUMBER, "7654321");

    await clickOnElementAndContinue(getSheepEndemicsPackageSelector("improvedEwePerformance"));

    await selectSheepTestsAndContinue([JOHNES_DISEASE]);

    await clickOnElementAndContinue(getTestResultSelector("positive"));

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUSH"));
  });

  it("can create a follow-up claim for beef", async () => {
    await performDevLogin(BEEF_ENDEMIC_CLAIM_SBI);

    await clickStartNewClaimButton();

    await clickOnElementAndContinue(getTypeOfLivestockSelector("beef"));

    await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));

    await enterPreMHReleaseDateAndContinue();

    await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));

    await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

    await clickOnElementAndContinue(getPiHuntForBvdDoneSelector("yes"));

    await clickOnElementAndContinue(getPiHuntDoneForAllCattleSelector("yes"));

    await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");

    await fillInputAndContinue(LABORATORY_URN, "bc-fu-521341");

    await clickOnElementAndContinue(getTestResultsSelector("positive"));

    await clickOnElementAndContinue(getBiosecuritySelector("yes"));

    await $(SUBMIT_CLAIM_BUTTON).click();

    await verifySubmission("Claim complete");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });
});
