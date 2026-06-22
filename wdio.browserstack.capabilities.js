export const compatibilityTestCapabilities = [
  // Devices
  {
    browserName: "Safari",
    "bstack:options": {
      deviceName: "iPhone 17",
      osVersion: "26",
      realMobile: true,
    },
  },
  {
    browserName: "Chrome",
    "bstack:options": {
      deviceName: "Galaxy S23",
      osVersion: "13.0",
      realMobile: true,
      browserVersion: "latest",
    },
  },
  // Desktop browsers
  {
    browserName: "Safari",
    "bstack:options": {
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "OS X",
      osVersion: "Sequoia",
    },
  },
  {
    browserName: "Chrome",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Chrome",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest-3",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Edge",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Edge",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest-3",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Firefox",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Firefox",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest-3",
      os: "Windows",
      osVersion: "11",
    },
  },
  {
    browserName: "Chrome",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "OS X",
      osVersion: "Sequoia",
    },
  },
  {
    browserName: "Chrome",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest-3",
      os: "OS X",
      osVersion: "Sequoia",
    },
  },
  {
    browserName: "Firefox",
    "bstack:options": {
      idleTimeout: 300,
      resolution: "1920x1080",
      browserVersion: "latest",
      os: "OS X",
      osVersion: "Sequoia",
    },
  },
  {
    browserName: "Firefox",
    "bstack:options": {
      resolution: "1920x1080",
      browserVersion: "latest-3",
      os: "OS X",
      osVersion: "Sequoia",
    },
  },
];

const commonBrowserStackOptions = {
  buildName: "AHWR-UI-Tests",
  projectName: "AHWR-UI",
  idleTimeout: 300,
};

export function getBrowserStackCapabilities() {
  return compatibilityTestCapabilities.map((cap) => ({
    ...cap,
    "bstack:options": {
      ...commonBrowserStackOptions,
      ...(cap["bstack:options"] || {}),
    },
  }));
}
