import { performDevLogin } from "../../utils/common.js";
import { addDescription, TYPE } from "@wdio/allure-reporter";
import { clickBackButton } from "../../utils/common";
import { CLAIM_JOURNEY_SBI } from "../../utils/constants.js";
import { createBeefReviewClaimWithoutApproval } from "../../utils/reviews/beef.js";

describe("Claim session and back navigation journeys", () => {
  it("can clear the input field data when the user selects a different herd from the originally selected one for a follow-up journey", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1054", TYPE.MARKDOWN);
    this.skip();
  });

  describe("beef review journey", () => {
    const expectGoBack = async (expected_url) => {
      await clickBackButton();
      const url = await browser.getUrl();
      expect(url).toContain(expected_url);
    };

    it("can successfully navigate back from the check-answers page to the which-species page for a review claim journey", async function () {
      await performDevLogin(CLAIM_JOURNEY_SBI);

      await createBeefReviewClaimWithoutApproval({
        testResult: "positive",
      });

      await expectGoBack("/test-results");
      await expectGoBack("/test-urn");
      await expectGoBack("/vet-rcvs");
      await expectGoBack("/vet-name");
      await expectGoBack("/number-of-species-tested");
      await expectGoBack("/species-numbers");
      // Skipping this as currently public-ui
      // has the incorrect back button
      // probably related to the function
      // isMultipleHerdsUserJourney
      // await expectGoBack("/date-of-testing");
      await expectGoBack("/check-herd-details");
      await expectGoBack("/enter-herd-details");
      await expectGoBack("/herd-others-on-sbi");
      await expectGoBack("/enter-cph-number");
      await expectGoBack("/enter-herd-name");
      await expectGoBack("/date-of-visit");
      await expectGoBack("/which-type-of-review");
      await expectGoBack("/which-species");
      await expectGoBack("/vet-visits");
    });
  });

  it("can successfully navigate back from the check-answers page to the which-species page for a follow-up claim journey", async function () {
    addDescription("Test not implemented yet, Jira ticket: AHWR-1054", TYPE.MARKDOWN);
    this.skip();
  });
});
