export const BO_AGREEMENTS_TAB = 'a.govuk-tabs__list-item[href="/agreements"]';

export const BO_FLAGS_TAB = 'a.govuk-tabs__list-item[href="/flags"]';

export const BO_CHECKED_CHECKLIST_CHECKBOX =
  'input[type="checkbox"][value="checkedAgainstChecklist"]';

export const BO_SENT_CHECK_LIST_CHECKBOX = 'input[type="checkbox"][value="sentChecklist"]';

export const BO_ON_HOLD_TO_IN_CHECK_CHECKBOX =
  'input[type="checkbox"][value="recommendToMoveOnHoldClaim"]';

export const BO_UPDATE_ISSUES_LOG_CHECKBOX = 'input[type="checkbox"][value="updateIssuesLog"]';

export const BO_CONFIRM_AND_CONTINUE_BUTTON = "button=Confirm and continue";

export const BO_CLAIM_STATUS_TEXT = ".govuk-summary-list__row .govuk-tag";

export const BO_RECOMMEND_TO_PAY_BUTTON = 'a[href*="recommendToPay"]';

export const BO_RECOMMEND_TO_REJECT_BUTTON = 'a[href*="recommend-to-reject"]';

export const BO_MOVE_TO_IN_CHECK_BUTTON = 'a[href*="move-to-in-check"]';

export const BO_PAY_BUTTON = 'a[href*="authorise"]';

export const BO_REJECT_BUTTON = 'a[href*="reject"]';

export const BO_PAY_CHECKBOX_ONE = "#confirm";

export const BO_PAY_CHECKBOX_TWO = "#confirm-2";

export const BO_CREATE_AGREEMENT_FLAG_CTA = 'a[href*="createFlag"]';

export const BO_AGREEMENT_REFERENCE = "#agreement-reference";

export const BO_FLAG_CREATION_NOTE = "#note";

export const BO_CREATE_FLAG_BUTTON = "button=Create flag";

export const BO_DELETE_FLAG_BUTTON = 'a[href*="deleteFlag"]';

export const BO_FLAG_DELETION_NOTE = "#deletedNote";

export const BO_SUBMIT_DELETE_FLAG_BUTTON = "button.govuk-button--warning=Delete flag";

export const BO_CLAIM_SEARCH = "#searchText";

export const BO_SEARCH_BUTTON = ".search-button";

export const BO_HISTORY_TAB = "#tab_history";

export function getClaimSelectorFromTable(claimReference) {
  return `a[href*="${claimReference}"]`;
}

export function getAgreementNumberSelector(agreementReference) {
  return `a[href*="${agreementReference}"]`;
}

export function getViewClaimLinkSelector(claimReference) {
  return `a[href*="${claimReference}"]`;
}

export function getAgreeToMultipleHerdTermsSelector(value) {
  return `input[name="appliesToMh"][value="${value}"]`;
}

export function getFlaggedAgreementRowSelector(agreementReference, multipleHerdTermsValue) {
  return `//tr[td[contains(text(), "${agreementReference}")] and td[text()="${multipleHerdTermsValue}"]]`;
}

export function getClaimTableStatusColumnIfStatusSelector(status) {
  return `td[data-sort-value="${status}"]`;
}
