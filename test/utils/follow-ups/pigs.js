import { $ } from "@wdio/globals";
import {
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  enterPreMHReleaseDateAndContinue,
  enterWhenTestingWasCarriedOutAndContinue,
  fillInputAndContinue,
  verifySubmission,
  clickContinueButton,
  enterVisitDateAndContinue,
  chooseRandomHerdReasonsAndContinue,
  selectHerdAndContinue,
} from "../common.js";
import {
  getTypeOfLivestockSelector,
  getTypeOfReviewSelector,
  getSpeciesNumbersSelector,
  NUMBER_OF_ANIMALS_TESTED,
  VETS_NAME,
  VET_RCVS_NUMBER,
  getHerdVaccinationStatus,
  LABORATORY_URN,
  NUMBER_OF_SAMPLES_TESTED,
  getPcrTestResultSelector,
  getElisaTestResultSelector,
  getGeneticSequencingSelector,
  getBiosecuritySelector,
  ASSESSMENT_PERCENTAGE,
  SUBMIT_CLAIM_BUTTON,
} from "../selectors.js";
import {
  PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE,
  PREVIOUSLY_CLAIMED_YES_ON_SAME_HERD_PAGE,
  HERD_NAME,
  HERD_CPH,
  OTHER_HERDS_ON_SBI_NO,
} from "../multiple-herd-selectors.js";

export async function createPreMultipleHerdPigsFollowUp(urn = "pg-fc-5343462") {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
  await enterPreMHReleaseDateAndContinue();
  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await clickOnElementAndContinue(getHerdVaccinationStatus("vaccinated"));
  await fillInputAndContinue(LABORATORY_URN, urn);
  await fillInputAndContinue(NUMBER_OF_SAMPLES_TESTED, "6");
  await clickOnElementAndContinue(getPcrTestResultSelector("positive"));
  await clickOnElementAndContinue(getGeneticSequencingSelector("prrs1"));
  await clickOnElementAndContinue(getBiosecuritySelector("yes"));
  await fillInputAndContinue(ASSESSMENT_PERCENTAGE, "50");
  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");
}

export async function createMultipleHerdPigsFollowUpForFirstHerd({
  isUnnamedHerdClaimPresent = false,
  urn = "pg-fc-5343461",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
  await enterVisitDateAndContinue();

  if (isUnnamedHerdClaimPresent) {
    await fillInputAndContinue(HERD_NAME, "Puddle of Piglets Herd");
    await fillInputAndContinue(HERD_CPH, "11/333/4444");
    await clickOnElementAndContinue(OTHER_HERDS_ON_SBI_NO);
    await chooseRandomHerdReasonsAndContinue();
    await clickContinueButton();
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SAME_HERD_PAGE);
  } else {
    await clickOnElementAndContinue(PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE);
  }

  await clickContinueButton();

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await clickOnElementAndContinue(getHerdVaccinationStatus("vaccinated"));
  await fillInputAndContinue(LABORATORY_URN, urn);
  await fillInputAndContinue(NUMBER_OF_SAMPLES_TESTED, "6");
  await clickOnElementAndContinue(getPcrTestResultSelector("positive"));
  await clickOnElementAndContinue(getGeneticSequencingSelector("prrs1"));
  await clickOnElementAndContinue(getBiosecuritySelector("yes"));
  await fillInputAndContinue(ASSESSMENT_PERCENTAGE, "50");
  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");
}

export async function createMultipleHerdPigsFollowUpForAdditionalHerd({
  herdName,
  isUnnamedHerdClaimPresent = false,
  reviewTestResult = "positive",
  urn = "pg-fc-5343462",
  vaccinationStatus = "vaccinated",
  pcrTestResult = "positive",
  elisaTestResult = "positive",
} = {}) {
  await clickStartNewClaimButton();
  await clickOnElementAndContinue(getTypeOfLivestockSelector("pigs"));
  await clickOnElementAndContinue(getTypeOfReviewSelector("endemics"));
  await enterVisitDateAndContinue();

  await selectHerdAndContinue(herdName);

  if (isUnnamedHerdClaimPresent) {
    await fillInputAndContinue(HERD_NAME, herdName);
    await fillInputAndContinue(HERD_CPH, "33/123/1234");
    await chooseRandomHerdReasonsAndContinue();
  }
  await clickContinueButton();

  await enterWhenTestingWasCarriedOutAndContinue("whenTheVetVisitedTheFarmToCarryOutTheReview");
  await clickOnElementAndContinue(getSpeciesNumbersSelector("yes"));
  await fillInputAndContinue(NUMBER_OF_ANIMALS_TESTED, "30");
  await fillInputAndContinue(VETS_NAME, "Mr Auto Test");
  await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
  await clickOnElementAndContinue(getHerdVaccinationStatus(vaccinationStatus));
  await fillInputAndContinue(LABORATORY_URN, urn);

  const numberOfSamplesTested = reviewTestResult === "positive" ? 6 : 30;
  await fillInputAndContinue(NUMBER_OF_SAMPLES_TESTED, numberOfSamplesTested.toString());

  if (reviewTestResult === "negative" && vaccinationStatus === "notVaccinated") {
    await clickOnElementAndContinue(getElisaTestResultSelector(elisaTestResult));
  } else {
    await clickOnElementAndContinue(getPcrTestResultSelector(pcrTestResult));
    if (pcrTestResult === "positive") {
      await clickOnElementAndContinue(getGeneticSequencingSelector("prrs1"));
    }
  }

  await clickOnElementAndContinue(getBiosecuritySelector("yes"));
  await fillInputAndContinue(ASSESSMENT_PERCENTAGE, "50");
  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");
}
