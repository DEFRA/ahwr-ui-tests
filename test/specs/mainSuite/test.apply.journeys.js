import { expect, browser } from "@wdio/globals";
import {
  clickRejectButton,
  clickSubmitButton,
  verifySubmission,
  performDevLogin,
  selectFundingType,
  verifyApplicationType,
  submitYouCanClaimMultipleForm,
  submitNumbersForm,
  submitTimingsForm,
  selectTermsAndConditions,
} from "../../utils/common.js";
import { LIVESTOCK_SBI } from "../../utils/constants.js";
import { cleanupSbi } from "../../utils/cleanupSbi.js";

describe("Apply journeys for livestock", function () {
  beforeEach(async () => {
    await cleanupSbi(LIVESTOCK_SBI);
  });

  it("can reject terms and create a not-agreed agreement", async () => {
    await performDevLogin(LIVESTOCK_SBI);
    await selectFundingType("IAHW");

    await submitYouCanClaimMultipleForm();
    await submitNumbersForm();
    await submitTimingsForm();
    await selectTermsAndConditions();

    await clickRejectButton();
    await verifySubmission("Agreement offer rejected");
  });

  it("can accept terms and create an agreement", async () => {
    await performDevLogin(LIVESTOCK_SBI);
    await selectFundingType("IAHW");
    await expect(browser).toHaveUrl(expect.stringContaining("/livestock/what-you-can-claim"));

    await submitYouCanClaimMultipleForm();
    await submitNumbersForm();
    await submitTimingsForm();
    await selectTermsAndConditions();

    await clickSubmitButton();
    await verifySubmission("Application complete");
    await verifyApplicationType("IAHW");
  });
});
