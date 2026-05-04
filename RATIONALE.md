# Pipeline rationale (~390 words)

## What gates exist

The pipeline has two workflows. The `ci` workflow runs on every pull request and on every push to `main`. It performs nine sequential gates: source checkout with full history, Node 20 setup with dependency caching, `npm ci` for reproducible installs, ESLint for static analysis, Jest unit tests against the in-memory store, Jest integration tests using supertest against the Express app in-process, gitleaks for secret scanning, `npm audit --audit-level=high` for dependency vulnerability scanning, and a build step that produces a versioned `dist/` artefact uploaded to the workflow run for traceability. The `release` workflow runs only when a semver tag matching `v*.*.*` is pushed; it re-runs the tests, rebuilds, zips the artefact under the tag name, and publishes a GitHub Release with auto-generated notes and the zip attached.

## What blocks promotion or release

A pull request cannot be merged to `main` if any of the following fail: lint, unit tests, integration tests, gitleaks, `npm audit` at high severity, or the build. Branch protection on `main` enforces this; the workflow fails fast on any non-zero exit. Promotion to a release requires an explicit human action — pushing a signed semver tag — which makes the release gate deliberately manual. The release workflow also re-runs the full test suite before publishing, so a passing tag still cannot ship if `main` regressed between merge and tag.

## Automated vs risk-based

Automated and blocking: lint, unit tests, integration tests, gitleaks, npm audit at high+, build. These are deterministic and cheap, so failure is treated as a hard stop. Automated and advisory: `npm audit` below high severity (warnings only) and ESLint warnings (logged, not failed). Risk-based and human: the release tag itself is a manual decision — only a maintainer pushes `vX.Y.Z`. The release notes are auto-generated from PR titles, but the maintainer reviews them. Secret scanning history depth is set to full (`fetch-depth: 0`) to surface accidental commits in earlier history rather than only the diff — a deliberate choice favouring thoroughness over speed.

## Justified deviations from the starter template

Three changes from the provided template: (1) the `npm audit` step was on a malformed line in the template — separated to its own step; (2) added `fetch-depth: 0` for gitleaks; (3) added a separate `release` workflow because the template covered only CI, not the tag-based release simulation required by B2.
