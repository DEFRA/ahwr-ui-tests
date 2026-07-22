#!/bin/bash
set -eo pipefail

EXIT_CODE=0

# Parse arguments
LOCAL_ARGS=()
SUITE=""
SPEC_ARGS=()

# Suites that have run, recorded as "SuiteName|logDir|STATUS" for the final summary
RUN_SUITES=()

log_dir_for_suite() {
  case "$1" in
    comp) echo "logsComp" ;;
    compFA) echo "logsCompFA" ;;
    *) echo "logs" ;;
  esac
}

# Run a suite, record its pass/fail status (from the exit code), then tear down.
# Usage: run_suite <suite> [extra run_tests.sh args...]
run_suite() {
  local suite="$1"
  shift
  local status="PASSED"
  if ! ./scripts/run_tests.sh "$suite" "$@"; then
    status="FAILED"
    EXIT_CODE=1
  fi
  RUN_SUITES+=("$suite|$(log_dir_for_suite "$suite")|$status")
  ./scripts/teardown.sh
}

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
    mainSuite|comp|compFA|accessibility|compatibility)
      SUITE="$1"
      shift
      ;;
    *)
      echo "❌ Unknown argument: $1"
      echo "Usage: ./github_run_tests.sh [suite] [--spec <spec_file>] [--local <image>]"
      echo "Suites: mainSuite, comp, compFA, accessibility, compatibility"
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
    run_suite comp 5 "${SPEC_ARGS[@]}"
  else
    run_suite "$SUITE" "${SPEC_ARGS[@]}"
  fi
else
  # Run all suites
  run_suite mainSuite
  run_suite comp 5
fi

./scripts/generate_allure_report.sh || EXIT_CODE=1

echo ""
echo "📊 Suite results summary:"
for ENTRY in "${RUN_SUITES[@]}"; do
  IFS='|' read -r SUITE_NAME SUITE_LOGDIR SUITE_STATUS <<< "$ENTRY"
  RESULT=$(grep "Spec Files:" "$SUITE_LOGDIR/wdio_test_output.log" 2>/dev/null | tail -1 | sed 's/^[[:space:]]*//' || true)
  echo "  • $SUITE_NAME: $SUITE_STATUS${RESULT:+ — $RESULT}"
done

exit $EXIT_CODE
