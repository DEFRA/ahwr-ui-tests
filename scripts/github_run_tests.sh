#!/bin/bash
set -eo pipefail

EXIT_CODE=0

./scripts/pull_latest_images.sh || EXIT_CODE=1
./scripts/build_wdio_test_image.sh || EXIT_CODE=1

./scripts/run_tests.sh mainSuite || EXIT_CODE=1
./scripts/run_tests.sh comp 5 || EXIT_CODE=1

./scripts/generate_allure_report.sh || EXIT_CODE=1

exit $EXIT_CODE
