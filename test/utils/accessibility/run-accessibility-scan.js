import fs from "fs";
import path from "path";
import AxeBuilder from "@axe-core/webdriverio";

const RAW_DIR = path.join(process.cwd(), "accessibility-report/raw");

function safeFileName(name) {
  return name
    .replace(/\//g, "-")
    .replace(/\\/g, "-")
    .replace(/[:*?"<>|]/g, "")
    .replace(/\s+/g, "-");
}

export async function runAccessibilityScan(browser, pageName) {
  const results = await new AxeBuilder({ client: browser })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .exclude([".govuk-header", ".govuk-footer"])
    .analyze();

  fs.mkdirSync(RAW_DIR, { recursive: true });

  const fileName = `${Date.now()}-${safeFileName(pageName)}.json`;

  fs.writeFileSync(
    path.join(RAW_DIR, fileName),
    JSON.stringify(
      {
        pageName,
        url: await browser.getUrl(),
        results,
      },
      null,
      2,
    ),
  );

  console.log(`Accessibility results saved for: ${pageName}`);
}
