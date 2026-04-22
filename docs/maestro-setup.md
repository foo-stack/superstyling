# Maestro setup

[Maestro](https://maestro.mobile.dev) is a lightweight mobile UI E2E test runner that drives the actual app on iOS Simulator / Android Emulator using YAML flow files. We chose it over Detox for its simpler authoring model and lack of test-app rebuild requirement.

## Why this isn't a dev dependency

Maestro is a CLI binary, not a Node package. Installing it via Homebrew or curl is the official path. We deliberately keep it out of `package.json`'s `devDependencies` and instead document the install here. CI installs Maestro on demand in the slow-lane workflow (`.github/workflows/ci-e2e.yml`).

## Local install

### macOS / Linux (recommended)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Then add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export PATH="$PATH:$HOME/.maestro/bin"
```

Reload your shell, then verify:

```bash
maestro --version
```

### macOS via Homebrew

```bash
brew tap mobile-dev-inc/tap
brew install maestro
```

### Other platforms

See the [official Maestro install docs](https://maestro.mobile.dev/getting-started/installing-maestro).

## Prerequisites for running flows

### iOS

- macOS host (Maestro can't drive iOS from Linux/Windows)
- Xcode + iOS Simulator installed
- A booted simulator: `xcrun simctl boot "iPhone 15"` (or whatever device you prefer)

### Android

- Java 17+ (e.g., `brew install openjdk@17` on macOS)
- Android Studio + an AVD (Android Virtual Device) configured
- The emulator running before invoking Maestro

## Where flows live

```
apps/playground/.maestro/
├── modal-open-close.yaml
├── form-submit.yaml
└── color-mode-toggle.yaml
```

Each `.yaml` file is one Maestro flow. See the [Maestro YAML reference](https://maestro.mobile.dev/api-reference/commands).

## Running flows locally

From the repo root:

```bash
cd apps/playground
maestro test .maestro
```

Or a single flow:

```bash
maestro test .maestro/modal-open-close.yaml
```

## Running in CI

`.github/workflows/ci-e2e.yml` runs Maestro on every PR but is **advisory only** (does not block merge). Failures should still be triaged before release.

## Maestro Cloud (optional)

If GitHub Actions macOS runners get too slow for our needs, we can sign up for [Maestro Cloud](https://cloud.mobile.dev) and replace the `runs-on: macos-14` jobs with their hosted runner. Decision deferred until we have real signal on iOS Simulator timing.
