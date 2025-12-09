import { expect, $ } from "@wdio/globals";
import { performDevLogin } from "../../utils/common.js";
import { CLAIM_REFERENCE } from "../../utils/selectors.js";
import { MULTIPLE_HERDS_SBI, MULTIPLE_HERD_AGREEMENT_REF } from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import {
  createDairyReviewClaim,
  createDairyReviewForAdditionalHerd,
} from "../../utils/reviews/index.js";
import {
  createMultipleHerdDairyFollowUpForFirstHerd,
  createMultipleHerdDairyFollowUpForAdditionalHerd,
} from "../../utils/follow-ups/index.js";

let claimNumber;
const additionalHerd = "Diary additional herd 1";
describe("Multiple herds dairy cattle claim journeys", async function () {
  it("can create the first review claim with a positive test result for a dairy herd for a farmer business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createDairyReviewClaim({
      reviewTestResult: "positive",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REDC"));
  });

  it("can create a PI hunt follow-up claim for an approved dairy review claim with positive test result", async () => {
    // Answer yes to all PI hunt questions
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdDairyFollowUpForFirstHerd();

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUDC"));
  });

  it("can create a review claim with negative test result for a different group (herd) of dairy species for the same farmer business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createDairyReviewForAdditionalHerd({
      herd: additionalHerd,
      reviewTestResult: "negative",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REDC"));
  });

  it("can create a PI hunt follow-up claim for the approved dairy review claim with negative test result", async () => {
    // Use the review claim from the test above and answer yes to all PI hunt questions for doing the follow-up claim
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdDairyFollowUpForAdditionalHerd({
      herdName: additionalHerd,
      reviewTestResult: "negative",
      urn: "dc-fu-521348",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUDC"));
  });

  it("can create a dairy herd follow-up claim journey when PI hunt for bovine viral diarrhoea has not been done", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Diary additional herd 2";

    claimNumber = await createDairyReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "dc-rr-511148",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REDC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdDairyFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "dc-fu-511248",
      piHuntBvdDone: "no",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUDC"));
  });

  it("can create a dairy herd follow-up claim journey when PI hunt was not recommended by the vet", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Diary additional herd 3";

    claimNumber = await createDairyReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "dc-rr-511149",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REDC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdDairyFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "dc-fu-511250",
      piHuntRecommendedByVet: "no",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUDC"));
  });

  it("can create a dairy herd follow-up claim journey when PI hunt wasn't done on all dairy cattle in the herd", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Diary additional herd 4";

    claimNumber = await createDairyReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "dc-rr-511151",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REDC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdDairyFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "dc-fu-511252",
      piHuntDoneForAllCattleHerd: "no",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUDC"));
  });
});
