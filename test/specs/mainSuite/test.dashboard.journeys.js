import { expect, $ } from "@wdio/globals";
import {
  clickSubmitButton,
  verifySubmission,
  verifyElementsExist,
  performDevLogin,
} from "../../utils/common.js";
import {
  TERMS_AND_CONDITIONS_CHECKBOX,
  AGREEMENT_SUMMARY_LINK,
  START_A_NEW_CLAIM_BUTTON,
  CLAIM_TABLE_ROW,
  LIVESTOCK_BEEF_RADIO,
  LIVESTOCK_DAIRY_RADIO,
  LIVESTOCK_PIGS_RADIO,
  LIVESTOCK_SHEEP_RADIO,
  AGREEMENT_REFERENCE_SELECTOR,
} from "../../utils/selectors.js";
import { DASHBOARD_SBI } from "../../utils/constants.js";
import { createSheepReviewClaim } from "../../utils/reviews/index.js";

describe("Vet-visits dashboard journeys", async function () {
  

  it("can verify agreement summary exists and a claim journey can be started from the dashboard", async () => {
    await performDevLogin(DASHBOARD_SBI);

    // Create an agreement
    await clickSubmitButton();
    await clickSubmitButton();
    await clickSubmitButton();
    await $(TERMS_AND_CONDITIONS_CHECKBOX).click();
    await clickSubmitButton();
    await verifySubmission("Application complete");

    const agreementReference = (await $(AGREEMENT_REFERENCE_SELECTOR).getText()).trim();

    // Create a claim
    await performDevLogin(DASHBOARD_SBI);
    const claimReference = await createSheepReviewClaim({ multipleHerdFlag: true });

    expect(claimReference).toEqual(expect.stringContaining("RESH"));

    // Dashboard verifications
    await performDevLogin(DASHBOARD_SBI);
    expect(await $(AGREEMENT_SUMMARY_LINK).getAttribute("href")).toContain(
      `download-application/${DASHBOARD_SBI}/${agreementReference}`,
    );
    await $(AGREEMENT_SUMMARY_LINK).click();
    await expect($(CLAIM_TABLE_ROW)).toHaveText(expect.stringContaining(claimReference));
    await $(START_A_NEW_CLAIM_BUTTON).click();

    const liveStockSelectors = [
      LIVESTOCK_BEEF_RADIO,
      LIVESTOCK_DAIRY_RADIO,
      LIVESTOCK_PIGS_RADIO,
      LIVESTOCK_SHEEP_RADIO,
    ];
    await verifyElementsExist(liveStockSelectors);
  });
});
