import { expect, $ } from "@wdio/globals";
import { performDevLogin } from "../../utils/common.js";
import { CLAIM_REFERENCE } from "../../utils/selectors.js";
import { MULTIPLE_HERDS_SBI, MULTIPLE_HERD_AGREEMENT_REF } from "../../utils/constants.js";
import { approveClaim } from "../../utils/backoffice-common.js";
import {
  createPigsReviewClaim,
  createPigsReviewForAdditionalHerd,
} from "../../utils/reviews/index.js";
import {
  createMultipleHerdPigsFollowUpForFirstHerd,
  createMultipleHerdPigsFollowUpForAdditionalHerd,
} from "../../utils/follow-ups/index.js";

let claimNumber;

describe("Multiple herds pigs claim journeys", async function () {
  it("can create the first review claim for a pigs herd for a farmer business with a positive test result", async () => {
    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewClaim({
      multipleHerdFlag: true,
      reviewTestResult: "positive",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));
  });

  it("can create a vaccinated follow-up claim incorporating both PCR positive and genetic sequencing outcomes for a pigs review with a positive test result", async () => {
    // Use the review claim from the test above for doing the follow-up claim
    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForFirstHerd({ urn: "pg-fc-5343463" });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create a vaccinated follow-up claim incorporating PCR negative but no genetic sequencing outcomes for a pigs review with a positive test result", async () => {
    const herdName = "Pigs additional herd 2";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "positive",
      urn: "pg-rr-5343463",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "positive",
      urn: "pg-fc-5343464",
      vaccinationStatus: "vaccinated",
      pcrTestResult: "negative",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create an un-vaccinated follow-up claim incorporating both PCR positive and genetic sequencing outcomes for a pigs review with a positive test result", async () => {
    const herdName = "Pigs additional herd 3";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "positive",
      urn: "pg-rr-5343464",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "positive",
      urn: "pg-fc-5343465",
      vaccinationStatus: "notVaccinated",
      pcrTestResult: "positive",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create an un-vaccinated follow-up claim incorporating PCR negative but no genetic sequencing outcomes for a pigs review with a positive test result", async () => {
    const herdName = "Pigs additional herd 4";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "positive",
      urn: "pg-rr-5343465",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "positive",
      urn: "pg-fc-5343466",
      vaccinationStatus: "notVaccinated",
      pcrTestResult: "negative",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create a vaccinated follow-up claim incorporating both PCR positive and genetic sequencing outcomes for a pigs review with a negative test result", async () => {
    const herdName = "Pigs additional herd 5";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "pg-rr-5343466",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "pg-fc-5343467",
      vaccinationStatus: "vaccinated",
      pcrTestResult: "positive",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create a vaccinated follow-up claim incorporating PCR negative but no genetic sequencing outcomes for a pigs review with a negative test result", async () => {
    const herdName = "Pigs additional herd 6";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "pg-rr-5343467",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "pg-fc-5343468",
      vaccinationStatus: "vaccinated",
      pcrTestResult: "negative",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create an un-vaccinated follow-up claim incorporating only positive ELISA test result for a pigs review with a negative test result", async () => {
    const herdName = "Pigs additional herd 7";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "pg-rr-5343468",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "pg-fc-5343469",
      vaccinationStatus: "notVaccinated",
      elisaTestResult: "positive",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });

  it("can create an un-vaccinated follow-up claim incorporating only negative ELISA test result for a pigs review with a negative test result", async () => {
    const herdName = "Pigs additional herd 8";

    await performDevLogin(MULTIPLE_HERDS_SBI);

    claimNumber = await createPigsReviewForAdditionalHerd({
      herd: herdName,
      reviewTestResult: "negative",
      urn: "pg-rr-5343469",
    });

    expect(claimNumber).toEqual(expect.stringContaining("REPI"));

    await approveClaim(MULTIPLE_HERD_AGREEMENT_REF, claimNumber);

    await performDevLogin(MULTIPLE_HERDS_SBI);

    await createMultipleHerdPigsFollowUpForAdditionalHerd({
      herdName,
      reviewTestResult: "negative",
      urn: "pg-fc-5343470",
      vaccinationStatus: "notVaccinated",
      elisaTestResult: "negative",
    });

    await expect($(CLAIM_REFERENCE)).toHaveText(expect.stringContaining("FUPI"));
  });
});
