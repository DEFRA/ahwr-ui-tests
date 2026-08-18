import neostandard from "neostandard";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  ...neostandard({
    env: ["node", "mocha"],
    ignores: ["allure-results", "allure-report"],
  }),
  eslintConfigPrettier,
  sonarjs.configs.recommended,
  {
    // A floating assertion cannot fail its test: the `it` resolves before the
    // assertion does, so the test reports green whatever the page says.
    files: ["test/**/*.js"],
    rules: {
      "sonarjs/no-commented-code": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExpressionStatement > CallExpression[callee.name=/^assert/]",
          message: "Await this assertion - an un-awaited assertion can never fail its test.",
        },
      ],
    },
  },
];
