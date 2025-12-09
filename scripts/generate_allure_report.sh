#!/bin/bash
set -e

MERGED_RESULTS_DIR="./merged-allure-results"
ALLURE_REPORT_DIR="./allure-report"

echo "📊 Merging Allure results from the three test stages..."

# Create merged result folder
mkdir -p "$MERGED_RESULTS_DIR"

# Copy results from three test sets if they exist
cp -r ./allure-results/mainSuite/* "$MERGED_RESULTS_DIR"/ 2>/dev/null || true
cp -r ./allure-results/comp/* "$MERGED_RESULTS_DIR"/ 2>/dev/null || true
cp -r ./allure-results/compFA/* "$MERGED_RESULTS_DIR"/ 2>/dev/null || true

echo "📄 Generating merged Allure report..."
npx allure-commandline generate "$MERGED_RESULTS_DIR" --clean -o "$ALLURE_REPORT_DIR"

# Update report title
echo "📝 Setting custom report title..."
REPORT_TITLE="Combined Test Report - $(date +'%Y-%m-%d %H:%M')"

# Use GNU sed if available (macOS vs Linux compatibility)
if sed --version >/dev/null 2>&1; then
  sed -i "s/Allure Report/${REPORT_TITLE}/g" "$ALLURE_REPORT_DIR"/index.html
else
  sed -i '' "s/Allure Report/${REPORT_TITLE}/g" "$ALLURE_REPORT_DIR"/index.html
fi

echo "📁 Report available in $ALLURE_REPORT_DIR/"
