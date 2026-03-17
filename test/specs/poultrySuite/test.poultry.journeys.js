import { $ } from "@wdio/globals";
import { clickSubmitButton, verifySubmission, performDevLogin, selectFundingType } from "../../utils/common.js";
import { TERMS_AND_CONDITIONS_CHECKBOX } from "../../utils/selectors.js";
import { POULTRY_SBI } from "../../utils/constants.js";

describe("Apply journeys for poultry", async function () {
  it("can create a new application", async () => {
    await performDevLogin(POULTRY_SBI);
    await selectFundingType("POUL");
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();
    await verifySubmission("Application complete", "POUL");
  });
});
