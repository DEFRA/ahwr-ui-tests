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
import { createPoultryReviewClaim } from "../../utils/reviews/poultry.js";

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

  it("can create a poultry review claim", async () => {
    await performDevLogin(POULTRY_SBI);

    const claimReference = await createPoultryReviewClaim();
  });
});
