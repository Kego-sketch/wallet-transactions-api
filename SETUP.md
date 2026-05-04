# Setup checklist — push this repo and submit the assignment

Follow these steps in order. Total time: ~30 minutes.

## 1. Create the GitHub repo

```bash
cd wallet-transactions-api
git init
git add .
git commit -m "feat: initial wallet-transactions API with CI/CD pipeline"
```

Create a new **public** repo on github.com (public keeps gitleaks free).
Then:

```bash
git remote add origin https://github.com/<your-username>/wallet-transactions-api.git
git branch -M main
git push -u origin main
```

## 2. Generate package-lock.json (required for `npm ci`)

```bash
npm install
git add package-lock.json
git commit -m "chore: add lockfile"
git push
```

This first push triggers CI on `main`. Confirm it passes.

## 3. Enable branch protection (proof of traceability)

GitHub repo → Settings → Branches → Add rule for `main`:
- Require a pull request before merging
- Require status checks to pass: select `test-build-scan`
- Require branches to be up to date

This converts CI from advisory to blocking.

## 4. Demonstrate the gate (recommended for full marks)

```bash
git checkout -b demo/lint-failure
# Edit src/app.js — remove a semicolon to break ESLint
git commit -am "demo: intentional lint break"
git push -u origin demo/lint-failure
```

Open a PR. Screenshot the **failing** CI run. Then fix the semicolon, push, screenshot the **passing** run. Merge.

## 5. Tag a release

```bash
git checkout main && git pull
git tag v1.0.0
git push --tags
```

The `release` workflow runs. Once green, go to repo → Releases. Screenshot the v1.0.0 release with `wallet-transactions-v1.0.0.zip` attached.

## 6. Submit

Hand in:
- Repo URL
- `.github/workflows/ci.yml` and `.github/workflows/release.yml` (already in repo)
- Screenshot of the green CI run + the run URL
- Screenshot of the failed-then-fixed PR (recommended — shows the gate works)
- Screenshot of the v1.0.0 Release with the zip attached
- `RATIONALE.md` (already in repo)

Done.
