import { $, expect } from "@wdio/globals";
import {
  getClaimSelectorFromTable,
  getClaimTableStatusColumnIfStatusSelector,
} from "./backoffice-selectors.js";

export const assertClaimToBeInCheck = async (claimNumber) => {
  expect(isClaimStatusInCheck(claimNumber)).toBe(true);
};

export const assertClaimToBeOnHold = async (claimNumber) => {
  expect(isClaimStatusOnHold(claimNumber)).toBe(true);
};

export const assertAllClaimsAreInCheck = async (claimNumbers) => {
  claimNumbers.forEach((claimNumber) => expect(isClaimStatusInCheck(claimNumber)).toBe(true));
};

export const assertSomeClaimsAreOnHold = async (claimNumbers) => {
  expect(claimNumbers.some((claimNumber) => isClaimStatusOnHold(claimNumber)).toBe(true));
};

const isClaimStatusInCheck = async (claimNumber) => {
  const claimRow = $(getClaimSelectorFromTable(claimNumber)).parentElement();
  return await claimRow.$(getClaimTableStatusColumnIfStatusSelector("IN CHECK")).isDisplayed();
};

const isClaimStatusOnHold = async (claimNumber) => {
  const claimRow = $(getClaimSelectorFromTable(claimNumber)).parentElement();
  return await claimRow.$(getClaimTableStatusColumnIfStatusSelector("ON HOLD")).isDisplayed();
};
