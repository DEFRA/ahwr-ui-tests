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

export const BO_REJECT_BUTTON = 'a[href*="reject=true"]:not([href*="recommend"])';

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
export const BO_AGREEMENT_SEARCH = "#searchText";

export const BO_SEARCH_BUTTON = ".search-button";

export const BO_ADVANCED_SEARCH_SUMMARY = ".govuk-details__summary";
export const BO_AGREEMENT_TYPE_SELECT = "#agreementType";
export const BO_AGREEMENT_STATUS_SELECT = "#status";
export const BO_ADVANCED_SEARCH_BUTTON = 'button[name="submit"][value="advancedSearch"]';
export const BO_CLEAR_FILTERS_LINK = 'a[href="/claims/clear"]';

export const BO_AGREEMENT_DATE_FROM_DAY = "#dateFrom-day";
export const BO_AGREEMENT_DATE_FROM_MONTH = "#dateFrom-month";
export const BO_AGREEMENT_DATE_FROM_YEAR = "#dateFrom-year";
export const BO_AGREEMENT_DATE_TO_DAY = "#dateTo-day";
export const BO_AGREEMENT_DATE_TO_MONTH = "#dateTo-month";
export const BO_AGREEMENT_DATE_TO_YEAR = "#dateTo-year";

export const BO_AGREEMENT_REFERENCE_LINKS = "#agreements tbody td:first-child a";

export function getAgreementStatusColumnSelector(status) {
  return `#agreements tbody td[data-sort-value="${status}"]`;
}

export const BO_NO_AGREEMENTS_MESSAGE = "p.no-results-message";
export const BO_NO_CLAIMS_MESSAGE = "p.no-results-message";

export const BO_HISTORY_TAB = "#tab_history";

export const BO_PII_ROW_SELECTOR = "dt*=Eligible for automated data redaction";
export const BO_PII_CHANGE_BUTTON =
  '//dt[contains(text(), "Eligible for automated data redaction")]/following-sibling::dd[@class="govuk-summary-list__actions"]//a';
export const BO_PII_TEXT =
  '//dt[contains(text(), "Eligible for automated data redaction")]/following-sibling::dd[@class="govuk-summary-list__value"]//p';
export const BO_PII_YES_RADIO = "#eligiblePiiRedaction";
export const BO_PII_NO_RADIO = "#eligiblePiiRedaction-2";
export const BO_PII_NOTE = "#note";
export const BO_PII_SUBMIT_BUTTON = 'button[type="submit"]';

export const BO_AGREEMENT_LIST = "dl.govuk-summary-list";
export const BO_AGREEMENT_ROW_VALUE = ".govuk-summary-list__row .govuk-summary-list__value";

export function getClaimSelectorFromTable(claimReference) {
  return `a[href*="${claimReference}"]`;
}

export function getAgreementReferenceSelector(agreementReference) {
  return `a[href*="${agreementReference}"]`;
}

export function getViewClaimLinkSelector(claimReference) {
  return `a[href*="${claimReference}"]`;
}

export function getFlaggedAgreementRowSelector(agreementReference) {
  return `//tr[td[contains(text(), "${agreementReference}")]]`;
}

export function getClaimTableStatusColumnForClaimRef(claimReference, status) {
  return `//tr[
     .//a[normalize-space()="${claimReference}"]
     and
     .//td[@data-sort-value="${status}"]
   ]`;
}
