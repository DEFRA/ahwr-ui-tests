import { $ } from "@wdio/globals";
import {
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
  fillInputAndContinue,
  verifySubmission,
  enterVisitDateAndContinue,
  chooseRandomHerdReasonsAndContinue,
  clickContinueButton,
  selectHerdAndContinue,
} from "../common.js";
import {
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  VETS_NAME,
  VET_RCVS_NUMBER,
  getPiHuntForBvdDoneSelector,
  getPiHuntRecommendedByVetSelector,
  getPiHuntDoneForAllCattleSelector,
  LABORATORY_URN,
  getTestResultsSelector,
  CONTINUE_YOUR_CLAIM,
  getBiosecuritySelector,
  SUBMIT_CLAIM_BUTTON,
} from "../selectors.js";
import {
  PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE,
  PREVIOUSLY_CLAIMED_YES_ON_SAME_HERD_PAGE,
  HERD_NAME,
  HERD_CPH,
  OTHER_HERDS_ON_SBI_NO,
} from "../multiple-herd-selectors.js";

export async function createMultipleHerdBeefFollowUpForFirstHerd({
  isUnnamedHerdClaimPresent = false,
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("beef"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
  await enterVisitDateAndContinue();

  if (isUnnamedHerdClaimPresent) {
    await fillInputAndContinue(HERD_NAME, "Black Label Beef");
    await fillInputAndContinue(HERD_CPH, "33/123/1234");
    await clickOnElementAndContinue(OTHER_HERDS_ON_SBI_NO);
    await chooseRandomHerdReasonsAndContinue();
    await clickContinueButton();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SAME_HERD_PAGE);
  } else {
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);
  }
  await clickContinueButton();

  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await clickOnElementAndContinue(getPiHuntForBvdDoneSelector("yes"));
  await clickOnElementAndContinue(getPiHuntDoneForAllCattleSelector("yes"));
  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await fillInputAndContinue(LABORATORY_URN, "bc-fu-521346");
  await clickOnElementAndContinue(getTestResultsSelector("positive"));
  await clickOnElementAndContinue(getBiosecuritySelector("yes"));
  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");
}

export async function createMultipleHerdBeefFollowUpForAdditionalHerd({
  herdName,
  reviewTestResult = "negative",
  isUnnamedHerdClaimPresent = false,
  urn = "bc-fu-521347",
  piHuntBvdDone = "yes",
  piHuntRecommendedByVet = "yes",
  piHuntDoneForAllCattleHerd = "yes",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("beef"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
  await enterVisitDateAndContinue();

  await selectHerdAndContinue(herdName);

  if (isUnnamedHerdClaimPresent) {
    await fillInputAndContinue(HERD_NAME, herdName);
    await fillInputAndContinue(HERD_CPH, "33/123/1234");
    await chooseRandomHerdReasonsAndContinue();
  }

  await clickContinueButton();
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

  await clickOnElementAndContinue(getPiHuntForBvdDoneSelector(piHuntBvdDone));

  if (piHuntBvdDone === "yes") {
    if (reviewTestResult === "negative") {
      await clickOnElementAndContinue(getPiHuntRecommendedByVetSelector(piHuntRecommendedByVet));
    }
    if (piHuntRecommendedByVet === "yes") {
      await clickOnElementAndContinue(
        getPiHuntDoneForAllCattleSelector(piHuntDoneForAllCattleHerd),
      );
    }
    if (piHuntRecommendedByVet === "no" || piHuntDoneForAllCattleHerd === "no") {
      await clickOnElementAndContinue(CONTINUE_YOUR_CLAIM);
    } else {
      await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
      await fillInputAndContinue(LABORATORY_URN, urn);
      await clickOnElementAndContinue(getTestResultsSelector("positive"));
    }
  }

  await clickOnElementAndContinue(getBiosecuritySelector("yes"));
  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");
}
