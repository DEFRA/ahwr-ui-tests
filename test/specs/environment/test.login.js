import { browser, expect, $ } from "@wdio/globals";
import {
  DEFRA_ID_CRN_FIELD,
  DEFRA_ID_PASSWORD_FIELD,
  DEFRA_ID_SIGN_IN_BUTTON,
  DEFRA_ID_SIGN_IN_CHECKBOX,
  DEFRA_ID_CONTINUE_BUTTON,
  getConfirmCheckDetailsSelector,
} from "../../utils/selectors";
import { clickSubmitButton } from "../../utils/common";
import { DEFRA_ID_CRN, DEFRA_ID_PASSWORD, PUBLIC_USER_UI_URL } from "../../utils/constants";

describe("Login checks", async function () {
  it("can log into an account", async () => {
    await browser.url(PUBLIC_USER_UI_URL);
    await $(DEFRA_ID_CRN_FIELD).setValue(DEFRA_ID_CRN);
    await $(DEFRA_ID_PASSWORD_FIELD).setValue(DEFRA_ID_PASSWORD);
    await $(DEFRA_ID_SIGN_IN_BUTTON).click();
    await $(DEFRA_ID_SIGN_IN_CHECKBOX).click();
    await $(DEFRA_ID_CONTINUE_BUTTON).click();
    await $(getConfirmCheckDetailsSelector("yes")).click();
    await clickSubmitButton();
    await expect($("#SBI")).toHaveText(expect.stringContaining("106821850"));
  });
});
