#!/bin/bash
set -e

ALLURE_RESULTS_DIR="./allure-results"
ALLURE_REPORT_DIR="./allure-report"

echo "📄 Generating Allure report from $ALLURE_RESULTS_DIR..."

# Make sure the report output directory exists
mkdir -p "$ALLURE_REPORT_DIR"

# Generate the report
npx allure-commandline generate "$ALLURE_RESULTS_DIR" --clean -o "$ALLURE_REPORT_DIR"

# Update report title
REPORT_TITLE="Combined Test Report - $(date +'%Y-%m-%d %H:%M')"

# GNU/Linux or macOS compatibility for sed
if sed --version >/dev/null 2>&1; then
  sed -i "s/Allure Report/${REPORT_TITLE}/g" "$ALLURE_REPORT_DIR"/index.html
else
  sed -i '' "s/Allure Report/${REPORT_TITLE}/g" "$ALLURE_REPORT_DIR"/index.html
fi

echo "📁 Report available in $ALLURE_REPORT_DIR/"
