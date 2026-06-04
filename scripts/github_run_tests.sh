#!/bin/bash
set -eo pipefail

EXIT_CODE=0

# Parse arguments
LOCAL_ARGS=()
SUITE=""
SPEC_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --local)
      LOCAL_ARGS+=("--local" "$2")
      shift 2
      ;;
    --spec)
      SPEC_ARGS+=("--spec" "$2")
      shift 2
      ;;
    mainSuite|comp|compFA|poultry|accessibility|compatibility)
      SUITE="$1"
      shift
      ;;
    *)
      echo "❌ Unknown argument: $1"
      echo "Usage: ./github_run_tests.sh [suite] [--spec <spec_file>] [--local <image>]"
      echo "Suites: mainSuite, comp, compFA, poultry, accessibility, compatibility"
      echo "Examples:"
      echo "  ./github_run_tests.sh                    # Run all suites"
      echo "  ./github_run_tests.sh mainSuite          # Run only mainSuite"
      echo "  ./github_run_tests.sh mainSuite --spec test/specs/mainSuite/test.beef.journeys.js"
      exit 1
      ;;
  esac
done

./scripts/pull_latest_images.sh "${LOCAL_ARGS[@]}" || EXIT_CODE=1
./scripts/build_wdio_test_image.sh || EXIT_CODE=1

if [ -n "$SUITE" ]; then
  # Run specific suite
  if [[ "$SUITE" == "comp" ]]; then
    ./scripts/run_tests.sh comp 5 "${SPEC_ARGS[@]}" || EXIT_CODE=1
  else
    ./scripts/run_tests.sh "$SUITE" "${SPEC_ARGS[@]}" || EXIT_CODE=1
  fi
  ./scripts/teardown.sh
else
  # Run all suites
  ./scripts/run_tests.sh mainSuite || EXIT_CODE=1
  ./scripts/teardown.sh
  ./scripts/run_tests.sh comp 5 || EXIT_CODE=1
  ./scripts/teardown.sh
  ./scripts/run_tests.sh poultry || EXIT_CODE=1
  ./scripts/teardown.sh
fi

./scripts/generate_allure_report.sh || EXIT_CODE=1

exit $EXIT_CODE
