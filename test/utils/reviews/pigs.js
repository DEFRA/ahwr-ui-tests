import { $ } from "@wdio/globals";
import {
  enterVisitDateAndContinue,
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  fillInputAndContinue,
  chooseRandomHerdReasonsAndContinue,
  clickContinueButton,
  enterWhenTestingWasCarriedOutAndContinue,
  verifySubmission,
} from "../common.js";
import {
  HERD_NAME,
  HERD_CPH,
  OTHER_HERDS_ON_SBI_NO,
  getSelectHerdSelector,
} from "../multiple-herd-selectors.js";
import {
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  NUMBER_OF_ANIMALS_TESTED,
  VETS_NAME,
  VET_RCVS_NUMBER,
  LABORATORY_URN,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTestResultsSelector,
  NUMBER_OF_ORAL_FLUID_SAMPLES,
} from "../selectors.js";

export async function createPigsReviewClaim({
  multipleHerdFlag = false,
  urn = "pg-rr-5343461",
  enterVisitDateAndContinueFunc = enterVisitDateAndContinue,
  isUnnamedHerdClaimPresent = false,
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("review"));
  await enterVisitDateAndContinueFunc();

  if (multipleHerdFlag) {
    await fillInputAndContinue(HERD_NAME, "Puddle of Piglets");
    await fillInputAndContinue(HERD_CPH, "22/333/1234");
    await clickOnElementAndContinue(OTHER_HERDS_ON_SBI_NO);
    await chooseRandomHerdReasonsAndContinue();
    await clickContinueButton();
  }

  if (isUnnamedHerdClaimPresent) {
    await clickOnElementAndContinue(getSelectHerdSelector("a different herd"));
  }

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await fillInputAndContinue(LABORATORY_URN, urn);
  await fillInputAndContinue(NUMBER_OF_ORAL_FLUID_SAMPLES, "6");
  await clickOnElementAndContinue(getTestResultsSelector("positive"));

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return await $(CLAIM_REFERENCE).getText();
}

export async function createPigsReviewForAdditionalHerd({
  herd = "Pigs additional herd 1",
  reviewTestResult = "positive",
  urn = "pg-rr-5343462",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("review"));
  await enterVisitDateAndContinue();
  await clickOnElementAndContinue(getSelectHerdSelector("a different"));
  await fillInputAndContinue(HERD_NAME, herd);
  await fillInputAndContinue(HERD_CPH, "22/333/4444");
  await chooseRandomHerdReasonsAndContinue();
  await clickContinueButton();

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await fillInputAndContinue(LABORATORY_URN, urn);
  await fillInputAndContinue(NUMBER_OF_ORAL_FLUID_SAMPLES, "6");
  await clickOnElementAndContinue(getTestResultsSelector(reviewTestResult));

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return await $(CLAIM_REFERENCE).getText();
}
