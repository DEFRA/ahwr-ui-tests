import { browser, expect } from "@wdio/globals";
import { getBackOfficeUrl, performDevLogin } from "../utils/common.js";
import { assertClaimToBeInCheck, assertClaimToBeOnHold } from "../utils/common-assertions.js";
import { createSheepReviewClaim } from "../utils/reviews/index.js";

const fillerSbis = ["106416234", "107361798", "107645299", "106258541", "107346082"];

describe("Claim compliance checks", async function () {
  beforeEach(async () => {
    for (const sbi of fillerSbis) {
      await performDevLogin(sbi);
      const claimReference = await createSheepReviewClaim({ multipleHerdFlag: true });
      expect(claimReference).toEqual(expect.stringContaining("RESH"));
    }
  });

  it("sets 5th claim to in check status and others to on hold", async () => {
    await browser.url(getBackOfficeUrl());
    assertClaimToBeInCheck(fillerSbis[4]);

    for (const sbi of fillerSbis.slice(0, 4)) {
      assertClaimToBeOnHold(sbi);
    }
  });
});
