export const HERD_NAME = "#herdName";

export const HERD_CPH = "#herdCph";

export const OTHER_HERDS_ON_SBI_YES = "#isOnlyHerdOnSbi";

export const OTHER_HERDS_ON_SBI_NO = "#isOnlyHerdOnSbi-2";

export const PREVIOUSLY_CLAIMED_YES_ON_SELECT_THE_HERD_PAGE = "#herdSelected";

export const PREVIOUSLY_CLAIMED_NO_ON_SELECT_THE_HERD_PAGE = "#herdSelected-2";

export const PREVIOUSLY_CLAIMED_YES_ON_SAME_HERD_PAGE = "#herdSame";

export const PREVIOUSLY_CLAIMED_NO_ON_SAME_HERD_PAGE = "#herdSame-2";

export function getSelectHerdSelector(textValue) {
  return `//div[contains(@class, "govuk-radios__item")][.//label[contains(normalize-space(), "${textValue}")]]//input`;
}
