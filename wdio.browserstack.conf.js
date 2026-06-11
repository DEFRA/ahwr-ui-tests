import { config as baseConfig } from "./wdio.conf.js";
import { getBrowserStackCapabilities } from "./wdio.browserstack.capabilities.js";

export const config = {
  ...baseConfig,
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  maxInstances: 1,
  capabilities: getBrowserStackCapabilities(),
  suites: {
    compatibility: ["./test/specs/mainSuite/test.apply.journeys.js"],
  },
  services: [
    [
      "browserstack",
      {
        acceptInsecureCerts: true,
        browserstackLocal: true,
      },
    ],
  ],
  logLevel: "info",
};
