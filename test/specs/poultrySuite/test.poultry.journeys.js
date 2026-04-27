import { $ } from "@wdio/globals";
import {
  clickSubmitButton,
  verifySubmission,
  performDevLogin,
  selectFundingType,
  verifyApplicationType,
} from "../../utils/common.js";
import { TERMS_AND_CONDITIONS_CHECKBOX } from "../../utils/selectors.js";
import { POULTRY_SBI } from "../../utils/constants.js";
import {
  createPoultryReviewClaim,
  verifyPoultryClaimBackNavigation,
} from "../../utils/reviews/poultry.js";

describe("Apply journeys for poultry", async function () {
  it("can create a new application", async () => {
    await performDevLogin(POULTRY_SBI);
    await selectFundingType("POUL");
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();
    await verifySubmission("Application complete");
    await verifyApplicationType("POUL");
  });

  // For now, the order of test is important due to the single agreement
  it("can navigate back through poultry claim journey and verify retained values", async () => {
    await performDevLogin(POULTRY_SBI);

    await verifyPoultryClaimBackNavigation();
  });

  it("can create a poultry review claim", async () => {
    await performDevLogin(POULTRY_SBI);

    await createPoultryReviewClaim();
  });
});
