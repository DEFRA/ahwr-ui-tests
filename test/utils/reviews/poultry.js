import { expect, $, browser } from "@wdio/globals";
import {
  enterVisitDateAndContinue,
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  fillInputAndContinue,
  clickContinueButton,
  verifySubmission,
  selectFundingType,
  clickBackButton,
} from "../common.js";
import {
  SITE_NAME,
  SITE_CPH,
  SITE_OTHERS_ON_SBI_NO,
  VETS_NAME,
  VET_RCVS_NUMBER,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  VISIT_DATE_DAY,
  VISIT_DATE_MONTH,
  VISIT_DATE_YEAR,
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

export async function verifyPoultryClaimBackNavigation({
  poultryType = "chickens",
  chickenType = "broilers",
  siteName = "Poultry Site 1",
  siteCph = "11/222/3334",
  biosecurityUsefulness = "very-useful",
  changesInBiosecurity = "infra-and-control",
  costOfChanges = "0-1500",
  participateInInterview = "yes",
} = {}) {
  const today = new Date();
  const expectedDay = today.getDate().toString();
  const expectedMonth = (today.getMonth() + 1).toString();
  const expectedYear = today.getFullYear().toString();

  await selectFundingType("POUL");

  await clickStartNewClaimButton();

  await enterVisitDateAndContinue();

  await fillInputAndContinue(SITE_NAME, siteName);

  await fillInputAndContinue(SITE_CPH, siteCph);

  await clickOnElementAndContinue(SITE_OTHERS_ON_SBI_NO);

  await $(getTypesOfPoultrySelector(poultryType)).click();
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

  // Now we're at check-answers page - start going back and verify each value
  await clickBackButton();
  await expect($(getInterviewSelector(participateInInterview))).toBeChecked();

  await clickBackButton();
  await expect($(getCostOfChangesSelector(costOfChanges))).toBeChecked();

  await clickBackButton();
  await expect($(getChangesInBiosecuritySelector(changesInBiosecurity))).toBeChecked();

  await clickBackButton();
  await expect($(getBiosecurityUsefulnessSelector(biosecurityUsefulness))).toBeChecked();

  await clickBackButton();
  await expect($(getBiosecuritySelector("yes"))).toBeChecked();

  await clickBackButton();
  await expect($(VET_RCVS_NUMBER)).toHaveValue("1234567");

  await clickBackButton();
  await expect($(VETS_NAME)).toHaveValue("Mr Auto Test");

  await clickBackButton();
  await expect($(getMinimumNumberOfBirdsSelector("yes"))).toBeChecked();

  await clickBackButton();
  await expect($(getTypesOfPoultrySelector(poultryType))).toBeChecked();
  if (poultryType === "chickens") {
    await expect($(getTypesOfChickenSelector(chickenType))).toBeChecked();
  }

  await clickBackButton();
  await expect($(SITE_OTHERS_ON_SBI_NO)).toBeChecked();

  await clickBackButton();
  await expect($(SITE_CPH)).toHaveValue(siteCph);

  await clickBackButton();
  await expect($(SITE_NAME)).toHaveValue(siteName);

  await clickBackButton();
  await expect($(VISIT_DATE_DAY)).toHaveValue(expectedDay);
  await expect($(VISIT_DATE_MONTH)).toHaveValue(expectedMonth);
  await expect($(VISIT_DATE_YEAR)).toHaveValue(expectedYear);

  await clickBackButton();
  await expect(browser).toHaveUrl(expect.stringContaining("/poultry/vet-visits"));
}
