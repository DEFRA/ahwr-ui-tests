import { $ } from "@wdio/globals";
import {
  clickRejectButton,
  clickSubmitButton,
  verifySubmission,
  performDevLogin,
} from "../../utils/common.js";
import { TERMS_AND_CONDITIONS_CHECKBOX } from "../../utils/selectors.js";
import { APPLY_REVIEW_CLAIM_SBI } from "../../utils/constants.js";

describe("Apply journeys for livestock", async function () {
  it("can reject terms and create a not-agreed agreement", async () => {
    await performDevLogin(APPLY_REVIEW_CLAIM_SBI);
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickRejectButton();
    await verifySubmission("Agreement offer rejected");
  });

  it("can accept terms and create an agreement", async () => {
    await performDevLogin(APPLY_REVIEW_CLAIM_SBI);
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();

    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();
    await verifySubmission("Application complete");
  });
});
