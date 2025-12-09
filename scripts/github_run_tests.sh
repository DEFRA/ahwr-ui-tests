#!/bin/bash

./scripts/pull_latest_images.sh
./scripts/build_wdio_test_image.sh
./scripts/run_tests.sh mainSuite
./scripts/run_tests.sh comp 5
./scripts/run_tests.sh compFA 5