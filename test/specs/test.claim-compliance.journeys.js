import { browser, expect } from "@wdio/globals";
import { getBackOfficeUrl, performDevLogin } from "../utils/common.js";
import { assertClaimToBeInCheck, assertClaimToBeOnHold } from "../utils/common-assertions.js";
import { createSheepReviewClaim } from "../utils/reviews/index.js";

const fillerSbis = ["106416234", "107361798", "107645299", "106258541", "107346082"];
const claimRefs = [];

describe("Claim compliance checks", async function () {
  beforeEach(async () => {
    for (const sbi of fillerSbis) {
      await performDevLogin(sbi);
      const claimReference = await createSheepReviewClaim({ multipleHerdFlag: true });
      expect(claimReference).toEqual(expect.stringContaining("RESH"));
      claimRefs.push(claimReference);
    }
  });

  it("sets 5th claim to in check status and others to on hold", async () => {
    await browser.url(getBackOfficeUrl());
    await assertClaimToBeInCheck(claimRefs[4]);

    for (const claimRef of claimRefs.slice(0, 4)) {
      await assertClaimToBeOnHold(claimRef);
    }
  });
});
