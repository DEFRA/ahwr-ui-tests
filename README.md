# 📦 ahwr-ui-tests

## 📝 Table of Contents

- [📖 Overview](#-overview)
- [🚀 Prerequisites](#️-prerequisites)
- [🧪 Running Automated Tests](#-running-automated-tests)
- [🙈 Gotchas](#-gotchas)

---

## 📖 Overview

This project is home to the Vets Visits teams automated tests. We pull the images for the services we need to run the project locally,
run them in a Docker container, and then run Webdriver IO automated tests to validate the key journeys work. These can be run in the pipeline
as well as locally.

We use the pull_latest_images.sh script inside the /scripts folder to pull the latest images from ACR in Azure for the services we need to run. Once we have these,
we can use the run_tests script to set some env vars, and it uses docker compose to start the needed services, before the Webdriver IO tests execute.

When you run the tests, they output the logs in a /logs directory which gets created in the root of your repo (note it's not committed to the repo). These
logs also get generated in the pipeline when it runs, and they can be accessed via the Jenkins workspace (click into the pipeline run, click on workspaces).

---

## 🚀 Prerequisites

- macOS (this repo has been developed on a Macbook laptop, so if you are running Windows it probably needs some changes to get it to work)
- Node version 20.18.1
- NVM (Node Version manager)
- Azure login for SND2 tenant
- Make sure you are on the VPN
- Docker
- Create a .env file in the root of the repo
- Make sure you have MESSAGE_QUEUE_PASSWORD, MESSAGE_QUEUE_SUFFIX and APPLICATIONINSIGHTS_CONNECTION_STRING in your .env file
- MESSAGE_QUEUE_SUFFIX should be whichever queues you want to use in SND2, e.g. -auto. The -pipe queues are reserved for the pipeline.
- Add CLEANUP_FIRST=true to your .env file if you want to ensure a clean-up of logs and screenshots before running the tests locally
- Add USE_INSTANCES=10 to your .env file if you want to run tests in parallel, to make things faster
- You can find these values by speaking to a dev

## 🧪 Running Automated Tests

```bash
# Install dependencies
npm install

# Log into Azure, and select the SND2 tenant when prompted
az login

# Pull latest images
./scripts/pull_latest_images.sh

# Build WDIO test image
./scripts/build_wdio_test_image.sh

# Run tests (provide mainSuite, comp or compFA argument, dependant on which test suite you want to run from wdio.conf.js)
./scripts/run_tests.sh mainSuite

```

## 🙈 Gotchas

- We use the -auto queues that have been created in the SND2 environment. When the tests run in the pipeline, they will use the -pipe queues. This
  is to avoid clashes where if someone still has the images running locally, they might consume the messages for someone else running them. If wanted,
  this could be avoided by people creating their own -auto-INITIALS_HERE queues - but it likely wont be needed because its likely only 1 person is
  working on these tests at one moment.

- The repo has been developed to work on macOS / Linux. This means you might struggle to run it on Windows, unless you can make alterations to scripts etc.

- Screenshots have been added to the tests, and volume in the /screenshots folder. If any errors occur, they will be visible there.
