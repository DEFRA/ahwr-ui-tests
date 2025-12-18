import { $, expect } from "@wdio/globals";
import {
  getClaimTableStatusColumnForClaimRef,
} from "./backoffice-selectors.js";

export const assertClaimToBeInCheck = async (claimReference) => {
  await expect(await getInCheckStatusElement(claimReference)).toHaveText(/In check/);
};

export const assertClaimToBeOnHold = async (claimReference) => {
  await expect(await getOnHoldStatusElement(claimReference)).toHaveText(/On hold/);
};

export const assertAllClaimsAreInCheck = async (claimReferences) => {
  for(const claimReference of claimReferences) {
    await expect(await getInCheckStatusElement(claimReference)).toHaveText(/In check/);
  }
};

export const assertSomeClaimsAreOnHold = async (claimReferences) => {
  const results = await Promise.all(
    claimReferences.map(async (ref) => {
      const el = await getOnHoldStatusElement(ref);
      return el.isExisting() && /On hold/.test(await el.getText());
    })
  );

  await expect(results.some(Boolean)).toBe(true);
};

const getInCheckStatusElement = async (claimReference) => {
  return $(getClaimTableStatusColumnForClaimRef(claimReference, 'IN_CHECK'))
};

const getOnHoldStatusElement = async (claimReference) => {
  return $(getClaimTableStatusColumnForClaimRef(claimReference, 'ON_HOLD'))
};
