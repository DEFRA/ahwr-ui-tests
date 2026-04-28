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
  clickSubmitButton,
  performDevLogin,
  verifyApplicationType,
} from "../common.js";
import {
  VETS_NAME,
  VET_RCVS_NUMBER,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  VISIT_DATE_DAY,
  VISIT_DATE_MONTH,
  VISIT_DATE_YEAR,
  TERMS_AND_CONDITIONS_CHECKBOX,
  getBiosecuritySelector,
} from "../selectors.js";
import {
  NEW_SITE_OPTION,
  getTypesOfPoultrySelector,
  getTypesOfChickenSelector,
  getMinimumNumberOfBirdsSelector,
  getBiosecurityUsefulnessSelector,
  getChangesInBiosecuritySelector,
  getCostOfChangesSelector,
  getInterviewSelector,
} from "../poultry-selectors.js";
import { HERD_NAME, HERD_CPH, OTHER_HERDS_ON_SBI_NO } from "../multiple-herd-selectors.js";

async function enterClaimData(
  poultryType,
  siteName,
  siteCph,
  isReviewForAdditionalSite = false,
  options = {},
) {
  const {
    vetName = "Mr Auto Test",
    vetRcvsNumber = "1234567",
    minBirds = "yes",
    biosecurity = "yes",
    biosecurityUsefulness = "very-useful",
    biosecurityChanges = "infra-and-control",
    costOfChanges = "0-1500",
    interviewRequired = "yes",
    chickenType = "broilers",
  } = options;

  await selectFundingType("POUL");
  await clickStartNewClaimButton();
  await enterVisitDateAndContinue();

  if (isReviewForAdditionalSite) {
    await clickOnElementAndContinue(NEW_SITE_OPTION);
  }

  await fillInputAndContinue(HERD_NAME, siteName);
  await fillInputAndContinue(HERD_CPH, siteCph);

  await clickOnElementAndContinue(OTHER_HERDS_ON_SBI_NO);

  await $(getTypesOfPoultrySelector(poultryType)).click();

  if (poultryType === "chickens") {
    await $(getTypesOfChickenSelector(chickenType)).click();
  }

  await clickContinueButton();

  await clickOnElementAndContinue(getMinimumNumberOfBirdsSelector(minBirds));

  await fillInputAndContinue(VETS_NAME, vetName);
  await fillInputAndContinue(VET_RCVS_NUMBER, vetRcvsNumber);

  await clickOnElementAndContinue(getBiosecuritySelector(biosecurity));
  await clickOnElementAndContinue(getBiosecurityUsefulnessSelector(biosecurityUsefulness));
  await clickOnElementAndContinue(getChangesInBiosecuritySelector(biosecurityChanges));
  await clickOnElementAndContinue(getCostOfChangesSelector(costOfChanges));
  await clickOnElementAndContinue(getInterviewSelector(interviewRequired));
}

export const createPoultryApplication = async (sbi) => {
  await performDevLogin(sbi);
  await selectFundingType("POUL");

  await clickSubmitButton();
  await clickSubmitButton();
  await clickSubmitButton();

  await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
  await clickSubmitButton();

  await verifySubmission("Application complete");
  await verifyApplicationType("POUL");
};

export async function verifyPoultryClaimBackNavigation({
  poultryType = "chickens",
  siteName = "Poultry Site 1",
  siteCph = "11/222/3333",
  isReviewForAdditionalSite = false,
} = {}) {
  const today = new Date();
  const expectedDay = today.getDate().toString();
  const expectedMonth = (today.getMonth() + 1).toString();
  const expectedYear = today.getFullYear().toString();

  await enterClaimData(poultryType, siteName, siteCph, isReviewForAdditionalSite);

  // Now we're at check-answers page - start going back and verify each value
  await clickBackButton();
  await expect($(getInterviewSelector("yes"))).toBeChecked();

  await clickBackButton();
  await expect($(getCostOfChangesSelector("0-1500"))).toBeChecked();

  await clickBackButton();
  await expect($(getChangesInBiosecuritySelector("infra-and-control"))).toBeChecked();

  await clickBackButton();
  await expect($(getBiosecurityUsefulnessSelector("very-useful"))).toBeChecked();

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
    await expect($(getTypesOfChickenSelector("broilers"))).toBeChecked();
  }

  await clickBackButton();
  await expect($(OTHER_HERDS_ON_SBI_NO)).toBeChecked();

  await clickBackButton();
  await expect($(HERD_CPH)).toHaveValue(siteCph);

  await clickBackButton();
  await expect($(HERD_NAME)).toHaveValue(siteName);

  await clickBackButton();
  await expect($(VISIT_DATE_DAY)).toHaveValue(expectedDay);
  await expect($(VISIT_DATE_MONTH)).toHaveValue(expectedMonth);
  await expect($(VISIT_DATE_YEAR)).toHaveValue(expectedYear);

  await clickBackButton();
  await expect(browser).toHaveUrl(expect.stringContaining("/poultry/vet-visits"));
}

export async function createPoultryReviewClaim({
  poultryType = "chickens",
  siteName = "Poultry Site 1",
  siteCph = "11/222/3334",
  isReviewForAdditionalSite = false,
} = {}) {
  await enterClaimData(poultryType, siteName, siteCph, isReviewForAdditionalSite);

  await $(SUBMIT_CLAIM_BUTTON).click();
  await verifySubmission("Claim complete");

  return $(CLAIM_REFERENCE).getText();
}
