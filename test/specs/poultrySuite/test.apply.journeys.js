import { $ } from "@wdio/globals";
import {
  clickRejectButton,
  clickSubmitButton,
  verifySubmission,
  performDevLogin,
  selectFundingType,
  verifyApplicationType,
} from "../../utils/common.js";
import { TERMS_AND_CONDITIONS_CHECKBOX } from "../../utils/selectors.js";
import { LIVESTOCK_SBI } from "../../utils/constants.js";

describe("Apply journeys for livestock when poultry is switched on", async function () {
  it("can reject terms and create a not-agreed agreement", async () => {
    await performDevLogin(LIVESTOCK_SBI);
    await selectFundingType("IAHW");
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickRejectButton();
    await verifySubmission("Agreement offer rejected");
  });

  it("can accept terms and create an agreement", async () => {
    await performDevLogin(LIVESTOCK_SBI);
    await selectFundingType("IAHW");
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();
    await verifySubmission("Application complete");
    await verifyApplicationType("IAHW");
  });
});
