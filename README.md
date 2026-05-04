# wallet-transactions API

Minimal Express REST API used to demonstrate a CI/CD pipeline: linting, unit + integration tests, secret scanning, dependency auditing, versioned build artefact, and tag-driven GitHub Release.

## Endpoints

| Method | Path                       | Purpose                                      |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | /health                    | Liveness probe                               |
| POST   | /wallets                   | Create a wallet `{ owner }`                  |
| GET    | /wallets/:id               | Fetch a wallet                               |
| POST   | /transactions              | Credit or debit `{ walletId, type, amount }` |
| GET    | /transactions/:walletId    | List transactions for a wallet               |

## Run locally

```bash
npm install        # generates package-lock.json on first run; commit it
npm run lint
npm test
npm run test:integration
npm start
```

Smoke test:

```bash
curl -X POST localhost:3000/wallets -H 'content-type: application/json' -d '{"owner":"nathi"}'
curl -X POST localhost:3000/transactions -H 'content-type: application/json' \
  -d '{"walletId":"1","type":"credit","amount":500}'
curl localhost:3000/wallets/1
```

## Pipeline

### CI — `.github/workflows/ci.yml`
Runs on every pull request and on pushes to `main`. Every step below blocks merge if it fails:

1. Checkout (full history — required for gitleaks)
2. Node 20 setup with npm cache
3. `npm ci`
4. ESLint
5. Jest unit tests
6. Jest integration tests (supertest, in-process app)
7. gitleaks secret scan
8. `npm audit --audit-level=high`
9. Build artefact (`dist/`)
10. Upload artefact to the workflow run

### Release — `.github/workflows/release.yml`
Triggered by pushing a tag matching `v*.*.*`. Re-runs tests, rebuilds, zips `dist/` as `wallet-transactions-vX.Y.Z.zip`, and creates a GitHub Release with auto-generated release notes and the zip attached.

## Producing the assignment evidence

1. Push the repo to GitHub (public — keeps gitleaks free).
2. Open a branch with one trivial change. Open a PR. Screenshot the green CI run and copy the run URL.
3. Optional but recommended: introduce a deliberate lint error on a separate branch, open a PR, screenshot the red run, then push the fix and screenshot the green re-run. Demonstrates the gate works.
4. Merge to `main`. Tag and push:
   ```bash
   git tag v1.0.0 && git push --tags
   ```
5. Screenshot the Release page showing the zip attached.
6. Submit `RATIONALE.md` plus screenshots and the repo link.
