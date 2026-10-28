# 📦 ahwr-ui-tests

## 📝 Table of Contents

- [📖 Overview](#-overview)
- [🚀 Prerequisites](#️-prerequisites)
- [🪟 Windows Setup (WSL2)](#-windows-setup-wsl2)
- [🧪 Running Automated Tests](#-running-automated-tests)
- [📦 Working with Pipeline Artifacts](#-Working-with-Pipeline-Artifacts)
- [🙈 Gotchas](#-gotchas)
- [Dependabot](#dependabot)
- [SonarCloud](#sonarcloud)

---

## 📖 Overview

This project is home to the Vets Visits teams automated acceptance tests using the public user ui. We pull the images for the services we need to run the project locally,
run them in a Docker container, and then run Webdriver IO automated tests to validate the key journeys work. These can be run in the pipeline as well as locally.

We use the pull_latest_images.sh script inside the /scripts folder to pull the latest images for the services we need to run from the Docker Hub. Once we have these, we can use the run_tests script to set some env vars, and it uses docker compose to start the needed services, before the Webdriver IO tests execute.

When you run the tests, they output the logs in a /logs directory which gets created in the root of your repo (note it's not committed to the repo). These
logs also get generated in the pipeline when it runs, and they can be accessed from the Github actions test executions.

---

## 🚀 Prerequisites

- On Windows: WSL2 with Ubuntu — see [🪟 Windows Setup (WSL2)](#-windows-setup-wsl2). Everything below is run from the Ubuntu terminal, not from PowerShell or cmd.
- Node version 24.22.1 (see `.nvmrc`)
- NVM (Node Version manager)
- Docker
- [jq](https://jqlang.org/)
- Create a .env file in the root of the repo
- Make sure you have MESSAGE_QUEUE_PASSWORD, MESSAGE_QUEUE_SUFFIX and APPLICATIONINSIGHTS_CONNECTION_STRING in your .env file
- MESSAGE_QUEUE_SUFFIX should be whichever queues you want to use in DEV, e.g. -auto. The -pipe queues are reserved for the pipeline.
- Add CLEANUP_FIRST=true to your .env file if you want to ensure a clean-up of logs and screenshots before running the tests locally
- Add USE_INSTANCES=10 to your .env file if you want to run tests in parallel, to make things faster
- You can find these values by speaking to the AHWR dev team

## 🪟 Windows Setup (WSL2)

The orchestration scripts in `/scripts` are bash-based, so on Windows the tests are run from inside WSL2 rather than PowerShell or cmd. The tests themselves run headless inside Docker containers, so results are identical to macOS/Linux.

### One-time setup

1. **Install WSL2 with Ubuntu** from an elevated PowerShell prompt, then restart when prompted:

   ```powershell
   wsl --install
   ```

   Launch Ubuntu from the Start menu and create a Linux username and password.

2. **Install Docker Desktop for Windows** with the WSL 2 based engine enabled (Settings → General) and WSL integration enabled for Ubuntu (Settings → Resources → WSL Integration). This makes the `docker` and `docker compose` commands available inside the Ubuntu terminal.

3. **In the Ubuntu terminal**, install the remaining prerequisites:

   ```bash
   sudo apt update && sudo apt install -y curl jq
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   ```

### Clone into the Linux filesystem

Keep the repository inside the WSL filesystem (e.g. `~/repos/ahwr-ui-tests`), not under `/mnt/c/...`:

```bash
mkdir -p ~/repos && cd ~/repos
git clone git@github.com:DEFRA/ahwr-ui-tests.git
cd ahwr-ui-tests
nvm install   # picks up the version from .nvmrc
```

Bind mounts from the Windows drives are much slower under WSL2, and the tests stream screenshots, logs and Allure results through those mounts. To work with the files from Windows, use `\\wsl$\Ubuntu\home\<you>\repos\ahwr-ui-tests` in File Explorer or the WSL remote in VS Code.

### Line endings

Git inside WSL checks files out with LF endings by default, which is what the scripts and the `.env` parsing in `scripts/run_tests.sh` expect. If you have `core.autocrlf=true` set in your WSL git config, override it for this repo:

```bash
git config core.autocrlf input
```

### Running the tests

Everything from [Running Automated Tests locally](#-running-automated-tests-locally) works unchanged inside the Ubuntu terminal once your `.env` file is in place, e.g.:

```bash
./scripts/github_run_tests.sh mainSuite
```

Ports are forwarded from WSL2 to Windows automatically, so the services (and the Allure report served with `python3 -m http.server`) are reachable in your Windows browser as usual.

### Known limitations

- The compose file pins `platform: linux/amd64`. On Windows-on-ARM devices those images run under emulation and will be significantly slower.
- Do not run the `.sh` scripts from PowerShell or cmd — they will not work there.

## 🧪 Running Automated Tests locally

### Setup Environment variables

The environment variables are setup on github actions. Those variables will be used by the backend and the public user ui. For local you will have them under `.env`

The `MESSAGE_QUEUE_HOST` comes from Azure Service Bus. We are using the dev service bus instance, where there is a queue already created for use on CI, but you will need your own specific one for local development. The `EVENT_QUEUE_ADDRESS` follows the schema "ffc-ahwr-event-{your initials}".

The `MESSAGE_QUEUE_USER` will be "RootManageSharedAccessKey". You can find the key needed to be used under Settings->Shared access policies. You will set that up under `FCP_AHWR_EVENT_QUEUE_SA_KEY`

The `BACKOFFICE_UI_API_KEY` is needed if we cleanup data for any SBIs using the `cleanupSbi` endpoint.

The `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` are needed to run compatibility test suite in BrowserStack.

### Commands

To run all functional test suites (such as mainSuite and comp) with a single command, use:

```bash
./scripts/github_run_tests.sh
```

To run each step individually, use the following commands:

```bash
# Pull latest images
./scripts/pull_latest_images.sh

# Build test image
./scripts/build_wdio_test_image.sh

# Run main suite
./scripts/run_tests.sh mainSuite; ./scripts/teardown.sh

# Run compliance suite
./scripts/run_tests.sh comp 5; ./scripts/teardown.sh

# Run accessibility suite
./scripts/run_tests.sh accessibility; ./scripts/teardown.sh

# Run compatibility suite - This will run all the compatibility tests in BrowserStack for the defined capabilities
./scripts/run_tests.sh compatibility; ./scripts/teardown.sh
```

### Local Images

You can run local images when passing parameters to `./scripts/github_run_tests.sh`, in the form of `./scripts/github_run_tests.sh --local ahwr-public-user-ui`.

The assumption is that the local images exists and is called `app-development`. For example `ahwr-public-user-development:latest`

The image gets retagged so as to keep the names in the rest of the script(s) the same.

### Filtering suites and spec files

You now can pass the name of a suite to `./scripts/github_run_tests.sh` to execute only the tests on that suite. Also, you can pass `--spec <filename>` parameter to only execute the tests on that file. If you pass `--spec` you need to pass the name of the suite too.

Some examples:

```bash
# Run all suites (original behavior)
./scripts/github_run_tests.sh
./scripts/github_run_tests.sh mainSuite
./scripts/github_run_tests.sh comp

# Run a specific file within a suite
./scripts/github_run_tests.sh mainSuite --spec test/specs/mainSuite/test.beef.journeys.js
```

## 📦 Working with Pipeline Artifacts

When the automated tests run in the pipeline, several files are collected and uploaded as artifacts so they can be inspected after the run. These include:

- Allure report: The full test report in HTML format, generated from the test results.
- Logs: All logs captured from the running services and the tests themselves.
- Screenshots: Screenshots captured during test failures.

# 🔍 Accessing Artifacts in GitHub Actions

- Go to the ahwr-ui-tests repository in GitHub.
- Click on Actions in the top menu.
- Select the workflow run you want to inspect.
- At the bottom, you’ll see an Artifacts section. Click the artifact you want to download (e.g., allure-report, logs, or screenshots).
- Download the .zip file to your local machine.
- Screenshots and logs are simple to work with in this form, though the allure report is a little different (see below).

# 📂 Viewing Allure Report Locally

- Unzip the allure-report folder
- Via a terminal, go into the allure-report directory (cd ~/Downloads/allure-report)
- Run `python3 -m http.server 8080`
- Access http://localhost:8080/ in your browser

## 🙈 Gotchas

- We use the -auto queues that have been created in the DEV environment. When the tests run in the pipeline, they will use the -auto queues too. If this becomes an issue, we can create -pipe queues.

- The orchestration scripts are bash-based, so the tests must be run from macOS, Linux, or Windows via WSL2 (see [🪟 Windows Setup (WSL2)](#-windows-setup-wsl2)). They will not run from PowerShell or cmd.

- Screenshots have been added to the tests, and volume in the /screenshots folder. If any errors occur, they will be visible there.

- Artifacts are retained only for a limited time (default 90 days in GitHub Actions). Download them if you need a permanent copy.

## Dependabot

Currently setup to work into four groups, so we don't have PRs per package. The updates run once a week, on a Monday. Except for the security group, which is advisory-triggered and ignores the schedule.

## SonarCloud

This project is set up to integrate with sonarcloud, and scans will be performed on all pull requests, and on
publish to main branch. We follow the quality gates as per DEFRA standards, and if coverage falls below the
acceptable level, or new issues are introduced the build will fail.

