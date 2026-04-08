import { expect, $ } from "@wdio/globals";
import { performDevLogin } from "../../utils/common.js";
import { CLAIM_REFERENCE } from "../../utils/selectors.js";
import { MULTIPLE_HERDS_SBI, MULTIPLE_HERD_AGREEMENT_REF } from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import {
  createBeefReviewClaim,
  createBeefReviewForAdditionalHerd,
} from "../../utils/reviews/index.js";
import {
  createMultipleHerdBeefFollowUpForFirstHerd,
  createMultipleHerdBeefFollowUpForAdditionalHerd,
} from "../../utils/follow-ups/index.js";

let claimReference;
const additionalHerd = "Beef additional herd 1";

describe("Multiple herds beef cattle claim journeys when poultry is switched on", async function () {
  it("can create the first review claim with a positive test result for a beef herd for a farmer business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimReference = await createBeefReviewClaim({
      testResult: "positive",
      isPoultryEnabled: true,
    });

    expect(claimReference).toEqual(expect.stringContaining("REBC"));
  });

  it("can create a PI hunt follow-up claim for an approved review claim with positive test result", async () => {
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdBeefFollowUpForFirstHerd({ isPoultryEnabled: true });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });

  it("can create a review claim with negative test result for a different group (herd) of beef species for the same farmer business", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimReference = await createBeefReviewForAdditionalHerd({
      herd: additionalHerd,
      reviewTestResult: "negative",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REBC"));
  });

  it("can create a PI hunt follow-up claim for the approved beef review claim with negative test result", async () => {
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdBeefFollowUpForAdditionalHerd({
      herdName: additionalHerd,
      testResult: "negative",
      urn: "bc-fu-521348",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });

  it("can create a beef herd follow-up claim journey when PI hunt for bovine viral diarrhoea has not been done", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Beef additional herd 2";

    claimReference = await createBeefReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "bc-rr-511148",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REBC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdBeefFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "bc-fu-511248",
      piHuntBvdDone: "no",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });

  it("can create a beef herd follow-up claim journey when PI hunt was not recommended by the vet", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Beef additional herd 3";

    claimReference = await createBeefReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "bc-rr-511149",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REBC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdBeefFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "bc-fu-511250",
      piHuntRecommendedByVet: "no",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });

  it("can create a beef herd follow-up claim journey when PI hunt wasn't done on all beef cattle in the herd", async () => {
    // This test is only applicable for review claim with negative test result
    await performDevLogin(MULTIPLE_HERDS_SBI);
    const herdName = "Beef additional herd 4";

    claimReference = await createBeefReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "bc-rr-511151",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("REBC"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimReference);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdBeefFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "bc-fu-511252",
      piHuntDoneForAllCattleHerd: "no",
      isPoultryEnabled: true,
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUBC"));
  });
});
