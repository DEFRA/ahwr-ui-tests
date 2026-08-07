import { expect, $ } from "@wdio/globals";
import {
  performDevLogin,
  selectFundingType,
  clickStartNewClaimButton,
  clickOnElementAndContinue,
  enterVisitDateAndContinue,
  fillInputAndContinue,
  clickContinueButton,
  verifySubmission,
} from "../../utils/common.js";
import {
  CLAIMS_MAIN_HEADING_SELECTOR,
  VETS_NAME,
  VET_RCVS_NUMBER,
  SUBMIT_CLAIM_BUTTON,
  CLAIM_REFERENCE,
  getBiosecuritySelector,
} from "../../utils/selectors.js";
import {
  NEW_SITE_OPTION,
  SAME_SITE_OPTION,
  getTypesOfPoultrySelector,
  getTypesOfChickenSelector,
  getMinimumNumberOfBirdsSelector,
  getBiosecurityUsefulnessSelector,
  getChangesInBiosecuritySelector,
  getCostOfChangesSelector,
} from "../../utils/poultry-selectors.js";
import { HERD_NAME, HERD_CPH, HERD_CPH_ERROR } from "../../utils/multiple-herd-selectors.js";
import { POULTRY_SBI, POULTRY_MULTIPLE_SITE_SBI } from "../../utils/constants.js";
import {
  createPoultryReviewClaim,
  verifyPoultryClaimBackNavigation,
  createPoultryApplication,
} from "../../utils/reviews/poultry.js";

describe("Claim journeys for poultry", async function () {
  // Create a poultry application before running any claim tests in this test suite.
  before(async () => {
    await createPoultryApplication(POULTRY_SBI);
  });

  it("can navigate back through poultry claim journey and verify retained values", async () => {
    await performDevLogin(POULTRY_SBI);
    await verifyPoultryClaimBackNavigation({
      poultryType: "chickens",
      siteName: "Poultry Site 1",
      siteCph: "11/222/3333",
      isReviewForAdditionalSite: false,
    });
  });

  it("can create a poultry review claim for the first site", async () => {
    await performDevLogin(POULTRY_SBI);
    const claimReference = await createPoultryReviewClaim({
      poultryType: "chickens",
      siteName: "Poultry Site 1",
      siteCph: "11/222/3334",
      isReviewForAdditionalSite: false,
    });
    expect(claimReference).toEqual(expect.stringContaining("PORE"));
  });

  it("can create a poultry review claim for an additional site", async () => {
    await performDevLogin(POULTRY_SBI);
    const claimReference = await createPoultryReviewClaim({
      poultryType: "chickens",
      siteName: "Poultry Site 2",
      siteCph: "11/222/3335",
      isReviewForAdditionalSite: true,
    });
    expect(claimReference).toEqual(expect.stringContaining("PORE"));
  });
});

describe("Additional poultry claim journeys and validations", async function () {
  it("cannot use same CPH number in two different poultry reviews", async () => {
    await performDevLogin(POULTRY_MULTIPLE_SITE_SBI);
    await selectFundingType("POUL");
    await clickStartNewClaimButton();

    // This date is after 10 months of the visit date of the existing review claim for this site in the test data
    const dateOfVisit = new Date(2025, 12, 27);
    await enterVisitDateAndContinue(dateOfVisit);
    await clickOnElementAndContinue(NEW_SITE_OPTION);
    await fillInputAndContinue(HERD_NAME, "Poultry Site 2");
    await fillInputAndContinue(HERD_CPH, "83/643/7369"); // This is the same CPH of the existing review claim for this site in the test data

    await expect($(HERD_CPH_ERROR)).toHaveText(
      expect.stringContaining("Enter a CPH that you have not used for a different site"),
    );
  });

  it("cannot create a second poultry review claim for the same site if its visit date is within 10 months of first review's visit date", async () => {
    await performDevLogin(POULTRY_MULTIPLE_SITE_SBI);
    await selectFundingType("POUL");
    await clickStartNewClaimButton();

    // This date is within 10 months of the visit date of the existing review claim for this site in the test data
    const dateOfVisit = new Date(2025, 3, 27);
    await enterVisitDateAndContinue(dateOfVisit);
    await clickOnElementAndContinue(SAME_SITE_OPTION);

    await expect($(CLAIMS_MAIN_HEADING_SELECTOR)).toHaveText(
      expect.stringContaining("You cannot continue with your claim"),
    );
  });

  it("can create a second poultry review claim for the same site if its visit date is after 10 months of first review's visit date", async () => {
    await performDevLogin(POULTRY_MULTIPLE_SITE_SBI);
    await selectFundingType("POUL");
    await clickStartNewClaimButton();

    // This date is after 10 months of the visit date of the existing review claim for this site in the test data
    const dateOfVisit = new Date(2025, 12, 27);
    await enterVisitDateAndContinue(dateOfVisit);
    await clickOnElementAndContinue(SAME_SITE_OPTION);

    await $(getTypesOfPoultrySelector("chickens")).click();
    await $(getTypesOfChickenSelector("broilers")).click();
    await clickContinueButton();

    await clickOnElementAndContinue(getMinimumNumberOfBirdsSelector("yes"));
    await fillInputAndContinue(VETS_NAME, "Mr Auto Tester");
    await fillInputAndContinue(VET_RCVS_NUMBER, "1234567");
    await clickOnElementAndContinue(getBiosecuritySelector("yes"));
    await clickOnElementAndContinue(getBiosecurityUsefulnessSelector("very-useful"));
    await clickOnElementAndContinue(getChangesInBiosecuritySelector("infra-and-control"));
    await clickOnElementAndContinue(getCostOfChangesSelector("0-1500"));
    await $(SUBMIT_CLAIM_BUTTON).click();
    await verifySubmission("Claim submitted");

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("PORE"));
  });
});
