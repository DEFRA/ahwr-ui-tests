import { $ } from "@wdio/globals";
import { addDescription, TYPE } from "@wdio/allure-reporter";
import {
  clickSubmitButton,
  verifySubmission,
  performDevLogin,
  selectFundingType,
  verifyApplicationType,
} from "../../utils/common.js";
import { TERMS_AND_CONDITIONS_CHECKBOX } from "../../utils/selectors.js";
import { LIVESTOCK_SBI } from "../../utils/constants.js";

describe("Apply journeys for livestock when poultry is switched on", async function () {
  it("can create a new application", async () => {
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

  it("can successfully reject an agreement", function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1315", TYPE.MARKDOWN);
    this.skip();
  });

  it("can reject first and then create an agreement successfully", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1315", TYPE.MARKDOWN);
    this.skip();
  });
});
