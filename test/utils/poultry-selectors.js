export const NEW_SITE_OPTION = "input[value='NEW_SITE']";

export function getTypesOfPoultrySelector(value) {
  return `input[name="typesOfPoultry"][value="${value}"]`;
}

export function getTypesOfChickenSelector(value) {
  return `input[name="typesOfChicken"][value="${value}"]`;
}

export function getMinimumNumberOfBirdsSelector(value) {
  return `input[name="minimumNumberOfBirds"][value="${value}"]`;
}

export function getBiosecurityUsefulnessSelector(value) {
  return `input[name="biosecurityUsefulness"][value="${value}"]`;
}

export function getChangesInBiosecuritySelector(value) {
  return `input[name="changesInBiosecurity"][value="${value}"]`;
}

export function getCostOfChangesSelector(value) {
  return `input[name="costOfChanges"][value="${value}"]`;
}

export function getInterviewSelector(value) {
  return `input[name="interview"][value="${value}"]`;
}
