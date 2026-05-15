#!/bin/bash
set -eo pipefail

EXIT_CODE=0

# Parse --local arguments to pass through to pull_latest_images.sh
LOCAL_ARGS=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --local)
      LOCAL_ARGS+=("--local" "$2")
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

./scripts/pull_latest_images.sh "${LOCAL_ARGS[@]}" || EXIT_CODE=1
./scripts/build_wdio_test_image.sh || EXIT_CODE=1

./scripts/run_tests.sh mainSuite || EXIT_CODE=1
./scripts/teardown.sh
./scripts/run_tests.sh comp 5 || EXIT_CODE=1
./scripts/teardown.sh
./scripts/run_tests.sh poultry || EXIT_CODE=1
./scripts/teardown.sh

./scripts/generate_allure_report.sh || EXIT_CODE=1

exit $EXIT_CODE
