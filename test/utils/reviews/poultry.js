import { $ } from "@wdio/globals";
import {
  enterVisitDateAndContinue,
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  fillInputAndContinue,
  clickContinueButton,
  verifySubmission,
  selectFundingType,
} from "../common.js";
import {
  SITE_NAME,
  SITE_CPH,
  SITE_OTHERS_ON_SBI_NO,
  VETS_NAME,
  VET_RCVS_NUMBER,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getTypesOfPoultrySelector,
  getTypesOfChickenSelector,
  getMinimumNumberOfBirdsSelector,
  getBiosecuritySelector,
  getBiosecurityUsefulnessSelector,
  getChangesInBiosecuritySelector,
  getCostOfChangesSelector,
  getInterviewSelector,
} from "../selectors.js";

export async function createPoultryReviewClaim({
  poultryType = "chickens",
  chickenType = "broilers",
  siteName = "Poultry Site 1",
  siteCph = "11/222/3333",
  enterVisitDateAndContinueFunc = enterVisitDateAndContinue,
  biosecurityUsefulness = "very-useful",
  changesInBiosecurity = "infra-and-control",
  costOfChanges = "0-1500",
  participateInInterview = "yes",
} = {}) {
  await selectFundingType("POUL");

  await clickStartNewClaimButton();

  await enterVisitDateAndContinueFunc();

  await fillInputAndContinue(SITE_NAME, siteName);

  await fillInputAndContinue(SITE_CPH, siteCph);

  await clickOnElementAndContinue(SITE_OTHERS_ON_SBI_NO);

  await $(getTypesOfPoultrySelector(poultryType)).click();
  // If chickens selected, also need to select chicken type
  if (poultryType === "chickens") {
    await $(getTypesOfChickenSelector(chickenType)).click();
  }
  await clickContinueButton();

  await clickOnElementAndContinue(getMinimumNumberOfBirdsSelector("yes"));

  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");

  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");

  await clickOnElementAndContinue(getBiosecuritySelector("yes"));

  await clickOnElementAndContinue(getBiosecurityUsefulnessSelector(biosecurityUsefulness));

  await clickOnElementAndContinue(getChangesInBiosecuritySelector(changesInBiosecurity));

  await clickOnElementAndContinue(getCostOfChangesSelector(costOfChanges));

  await clickOnElementAndContinue(getInterviewSelector(participateInInterview));

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return await $(CLAIM_REFERENCE).getText();
}
