import { expect } from "@wdio/globals";
import { performDevLogin } from "../../utils/common.js";
import { POULTRY_SBI } from "../../utils/constants.js";
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
