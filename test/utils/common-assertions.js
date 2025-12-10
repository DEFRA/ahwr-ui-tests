import { $, expect } from "@wdio/globals";
import {
  getClaimSelectorFromTable,
  getClaimTableStatusColumnIfStatusSelector,
} from "./backoffice-selectors.js";

export const assertClaimToBeInCheck = async (claimReference) => {
  expect(isClaimStatusInCheck(claimReference)).toBe(true);
};

export const assertClaimToBeOnHold = async (claimReference) => {
  expect(isClaimStatusOnHold(claimReference)).toBe(true);
};

export const assertAllClaimsAreInCheck = async (claimReferences) => {
  claimReferences.forEach((claimReference) => expect(isClaimStatusInCheck(claimReference)).toBe(true));
};

export const assertSomeClaimsAreOnHold = async (claimReferences) => {
  expect(claimReferences.some((claimReference) => isClaimStatusOnHold(claimReference)).toBe(true));
};

const isClaimStatusInCheck = async (claimReference) => {
  const claimRow = $(getClaimSelectorFromTable(claimReference)).parentElement();
  return await claimRow.$(getClaimTableStatusColumnIfStatusSelector("IN CHECK")).isDisplayed();
};

const isClaimStatusOnHold = async (claimReference) => {
  const claimRow = $(getClaimSelectorFromTable(claimReference)).parentElement();
  return await claimRow.$(getClaimTableStatusColumnIfStatusSelector("ON HOLD")).isDisplayed();
};
