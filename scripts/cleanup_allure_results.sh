#!/bin/bash
set -e

rm -rf ./allure-results ./allure-report ./merged-allure-results || true

# Recreate allure-results folder for next run
mkdir -p ./allure-results

echo "✅ Workspace cleaned for allure results and reports and ready for test execution."
