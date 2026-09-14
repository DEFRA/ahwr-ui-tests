import { createAgreement, performDevLogin } from "../../utils/common.js";
import {
  BACK_OFFICE_WITHDRAW_SBI,
  WITHDRAWAL_REASON,
  WITHDRAWAL_ISSUE_DISCOVERY,
} from "../../utils/constants.js";
import {
  withdrawClaim,
  expectClaimActionsToBeHidden,
  expectWithdrawalHistoryEntry,
  expectAgreementFlaggedForWithdrawal,
} from "../../utils/backoffice-common.js";
import { assertClaimToBeWithdrawn } from "../../utils/common-assertions.js";
import { createBeefReviewClaim } from "../../utils/reviews/index.js";

describe("Backoffice withdrawal journeys", async function () {
  it("can withdraw an in-check claim as SuperAdmin", async () => {
    const agreementReference = await createAgreement(BACK_OFFICE_WITHDRAW_SBI);

    await performDevLogin(BACK_OFFICE_WITHDRAW_SBI);

    const claimReference = await createBeefReviewClaim({
      testResult: "positive",
    });

    const details = "PI hunt result recorded incorrectly on the vet summary.";

    await withdrawClaim(agreementReference, claimReference, {
      reason: WITHDRAWAL_REASON.value,
      discovery: WITHDRAWAL_ISSUE_DISCOVERY.value,
      details,
    });

    await assertClaimToBeWithdrawn();
    await expectClaimActionsToBeHidden();
    await expectWithdrawalHistoryEntry({
      reasonLabel: WITHDRAWAL_REASON.label,
      discoveryLabel: WITHDRAWAL_ISSUE_DISCOVERY.label,
      details,
    });
    await expectAgreementFlaggedForWithdrawal(agreementReference);
  });
});
