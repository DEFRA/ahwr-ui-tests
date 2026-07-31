function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Builds an index.html listing every page that was accessibility-tested, so
 * scope of coverage (and pass/fail per page) is visible without opening each
 * page's individual report.
 *
 * @param {string} reportTitle - the project/report title shown in the heading.
 * @param {Array<{ pageName: string, url: string, violationCount: number, passed: boolean, reportFile: string }>} pageSummaries
 * @param {number} totalViolations - total violations across all pages.
 * @returns {string} the index.html content.
 */
export function buildAccessibilityIndex(reportTitle, pageSummaries, totalViolations) {
  const rows = pageSummaries
    .map(
      (page) => `
        <tr>
          <td>${escapeHtml(page.pageName)}</td>
          <td>${escapeHtml(page.url)}</td>
          <td class="${page.passed ? "status-pass" : "status-fail"}">${page.passed ? "Passed" : "Failed"}</td>
          <td>${page.violationCount}</td>
          <td><a href="${escapeHtml(page.reportFile)}">View report</a></td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(reportTitle)} — Accessibility Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { text-align: left; padding: 0.5rem 1rem; border-bottom: 1px solid #ccc; }
    .status-pass { color: #006435; font-weight: bold; }
    .status-fail { color: #d4351c; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${escapeHtml(reportTitle)} — Accessibility Report</h1>
  <p>Pages tested: ${pageSummaries.length}. Total violations: ${totalViolations}.</p>
  <table>
    <thead>
      <tr>
        <th>Page</th>
        <th>URL</th>
        <th>Status</th>
        <th>Violations</th>
        <th>Report</th>
      </tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>
</body>
</html>
`;
}
