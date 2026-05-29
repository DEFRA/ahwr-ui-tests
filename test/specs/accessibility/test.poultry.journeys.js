import { browser, $ } from "@wdio/globals";
import {
  getDevSignInUrl,
  fillAndSubmitSBI,
  selectFundingType,
  clickSubmitButton,
  verifySubmission,
  verifyApplicationType,
} from "../../utils/common.js";
import {
  TERMS_AND_CONDITIONS_CHECKBOX,
  getConfirmCheckDetailsSelector,
} from "../../utils/selectors.js";
import { POULTRY_SBI } from "../../utils/constants.js";

import { runAccessibilityScan } from "../../utils/accessibility/run-accessibility-scan.js";

describe("Accessibility verifications for poultry journeys", async function () {
  it("Run accessibility scan when creating poultry application", async () => {
    await browser.url(getDevSignInUrl());
    await fillAndSubmitSBI(POULTRY_SBI);

    await runAccessibilityScan(browser, "check-details");
    await $(getConfirmCheckDetailsSelector("yes")).click();
    await clickSubmitButton();

    await runAccessibilityScan(browser, "select-funding");
    await selectFundingType("POUL");

    await runAccessibilityScan(browser, "poultry/you-can-claim-multiple");
    await clickSubmitButton();

    await runAccessibilityScan(browser, "poultry/numbers");
    await clickSubmitButton();

    await runAccessibilityScan(browser, "poultry/timings");
    await clickSubmitButton();

    await runAccessibilityScan(browser, "poultry/declaration");
    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();

    await runAccessibilityScan(browser, "poultry/declaration");
    await verifySubmission("Application complete");
    await verifyApplicationType("POUL");
  });
});
