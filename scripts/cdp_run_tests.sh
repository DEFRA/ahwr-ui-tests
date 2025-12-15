#!/bin/bash
set -eo pipefail

EXIT_CODE=0

npm run test:environment

./scripts/generate_allure_report.sh || EXIT_CODE=1

exit $EXIT_CODE
