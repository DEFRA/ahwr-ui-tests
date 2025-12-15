import neostandard from "neostandard";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  ...neostandard({
    env: ["node", "mocha"],
    ignores: ["allure-results", "allure-report"],
  }),
  eslintConfigPrettier,
];
