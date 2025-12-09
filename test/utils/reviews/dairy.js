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
  VETS_NAME,
  VET_RCVS_NUMBER,
  LABORATORY_URN,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTestResultsSelector,
} from "../selectors.js";

export async function createDairyReviewClaim({
  reviewTestResult = "positive",
  isUnnamedHerdClaimPresent = false,
  urn = "dc-rr-5343461",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("dairy"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("review"));
  await enterVisitDateAndContinue();

  await fillInputAndContinue(HERD_NAME, "Legacy Dairy Herd");
  await fillInputAndContinue(HERD_CPH, "33/124/1234");
  await clickOnElementAndContinue(OTHER_HERDS_ON_SBI_NO);
  await chooseRandomHerdReasonsAndContinue();
  await clickContinueButton();

  if (isUnnamedHerdClaimPresent) {
    await clickOnElementAndContinue(getSelectHerdSelector("a different herd"));
  }

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await fillInputAndContinue(LABORATORY_URN, urn);
  await clickOnElementAndContinue(getTestResultsSelector(reviewTestResult));

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return await $(CLAIM_REFERENCE).getText();
}

export async function createDairyReviewForAdditionalHerd({
  herd = "Dairy additional herd 1",
  reviewTestResult = "positive",
  urn = "dc-rr-534351",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("dairy"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("review"));
  await enterVisitDateAndContinue();
  await clickOnElementAndContinue(getSelectHerdSelector("a different"));
  await fillInputAndContinue(HERD_NAME, herd);
  await fillInputAndContinue(HERD_CPH, "22/333/4444");
  await chooseRandomHerdReasonsAndContinue();
  await clickContinueButton();

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await fillInputAndContinue(LABORATORY_URN, urn);
  await clickOnElementAndContinue(getTestResultsSelector(reviewTestResult));

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return await $(CLAIM_REFERENCE).getText();
}
