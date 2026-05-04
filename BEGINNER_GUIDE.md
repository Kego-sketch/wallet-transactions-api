# Beginner's guide — zero programming experience required

You will not write any code. You will:
1. Install one free app (GitHub Desktop) and create one free account (GitHub).
2. Drag your project folder into GitHub Desktop and click "publish".
3. Watch GitHub run the automated checks for you.
4. Take screenshots and submit.

Estimated time end-to-end: **2 to 3 hours** if you've never done this. Take it slow.

---

## What is GitHub, in one paragraph

GitHub is a website where code lives. When you upload (push) code there, GitHub can automatically run a list of checks on it — things like "does the code follow the style rules?", "do the tests pass?", "are there any leaked passwords or known security holes in the libraries?". This automatic checking is called **CI** (Continuous Integration). Your assignment is graded on whether you set up that automatic checking correctly. The code itself doesn't matter much — and I've already written the code and the checks for you. You just need to put it on GitHub.

---

## Phase 1 — Create your GitHub account (5 minutes)

1. Open your browser, go to **https://github.com**.
2. Click **Sign up**.
3. Use your email (`nathi_m@icloud.com`) and pick a username and password. Write the password down somewhere safe.
4. Verify your email when GitHub sends you a confirmation link.
5. When asked about plan, choose the **Free** plan.

You're done with Phase 1.

---

## Phase 2 — Install GitHub Desktop (10 minutes)

GitHub Desktop is a free app that lets you upload code to GitHub by dragging and clicking — no terminal, no commands.

1. Go to **https://desktop.github.com**.
2. Click **Download for macOS**.
3. Open the downloaded `.zip` file. It will produce **GitHub Desktop.app**.
4. Drag **GitHub Desktop.app** into your **Applications** folder.
5. Open it from Applications.
6. The app will ask you to sign in. Click **Sign in to GitHub.com** and use the account you just made. Allow the browser to pass authentication back to the app.
7. When asked for a name and email for commits, use your real name and `nathi_m@icloud.com`. Click Finish.

You're done with Phase 2.

---

## Phase 3 — Put the project on GitHub (15 minutes)

The folder `wallet-transactions-api` should be in your Cowork outputs folder. If you don't know where that is, ask Claude to "open the wallet-transactions-api folder in Finder" or move it to your Desktop manually.

1. Open **GitHub Desktop**.
2. Click **File → Add Local Repository** (top menu bar).
3. Click **Choose…** and select the `wallet-transactions-api` folder. Click Add.
4. GitHub Desktop will say "This directory does not appear to be a Git repository. Would you like to create a repository here instead?" — click **create a repository**.
5. In the dialog: leave Name as `wallet-transactions-api`, leave description blank, leave the rest as default. Click **Create repository**.
6. You should now see a list of files on the left side. Across the bottom-left there's a Summary box — type `Initial commit` in it. Click the blue **Commit to main** button.
7. Now click the big **Publish repository** button at the top.
8. **Important:** uncheck the box that says "Keep this code private". The repository must be **public** so the security scanner (gitleaks) works without a paid license. Then click **Publish repository**.

Your code is now on GitHub. To see it: in GitHub Desktop, click the **Repository** menu → **View on GitHub**. Your browser will open the page.

---

## Phase 4 — Watch CI run for the first time (5 minutes)

1. On your repo's GitHub page, click the **Actions** tab at the top.
2. You should see a workflow run in progress with a yellow dot, or already done with a green check or red X. It's named "Initial commit" or similar.
3. Click on it. You'll see a job called `test-build-scan`. Click it. You'll see all the steps running (Checkout, Setup Node.js, Install dependencies, Lint, Unit tests, Integration tests, Secret scanning, Dependency audit, Build, Upload artefact).
4. **Wait until it finishes.** It takes about 2–3 minutes.
5. **If it's all green:** brilliant. Take a screenshot of this page (Cmd+Shift+4 on Mac, drag to capture). Save it as `screenshot-ci-passed.png` somewhere you can find it. Also copy the URL of this page from your browser's address bar — you'll need to submit it.
6. **If something is red:** scroll to the failing step, click it open, copy the error. Most likely cause: gitleaks complaining. If that happens, see the troubleshooting section at the bottom of this guide.

---

## Phase 5 — Turn on branch protection (3 minutes)

This is what makes CI a "blocking gate" rather than just advisory. Without this, the assignment marker may dock you points.

1. On your GitHub repo page, click the **Settings** tab (top right).
2. In the left sidebar, click **Branches**.
3. Under "Branch protection rules", click **Add branch protection rule** (or "Add rule").
4. Branch name pattern: type `main`.
5. Tick **Require a pull request before merging**.
6. Tick **Require status checks to pass before merging**. A search box appears — type `test-build-scan` and select it from the dropdown.
7. Scroll to the bottom and click **Create** (or **Save changes**).

Done.

---

## Phase 6 — Demonstrate the gate works (15 minutes) — RECOMMENDED FOR FULL MARKS

This is the bit that separates a pass from a strong pass. You'll deliberately break the code, see CI fail, then fix it and see CI pass. Screenshot both.

1. On the GitHub repo page, click the **Code** tab.
2. Open the file `src/app.js` — click on the file name.
3. Click the small pencil icon (Edit this file) in the top right of the file view.
4. Find this line near the top:
   ```
   const express = require('express');
   ```
   Delete the semicolon at the end so it becomes:
   ```
   const express = require('express')
   ```
   (This is a deliberate style violation — it will fail the lint check.)
5. Scroll down. Under "Commit changes" choose **Create a new branch for this commit and start a pull request**. Type a branch name like `demo/lint-failure`. Click **Propose changes**.
6. On the next screen, click **Create pull request**.
7. The PR page now shows checks running. Wait 2–3 minutes for them to fail. The PR will show a red X next to "Some checks were not successful". The Lint step will be the failing one.
8. **Screenshot this PR page** showing the red failure. Save as `screenshot-ci-failed.png`.
9. Now fix it: click the **Files changed** tab on the PR. Find the line you edited. Click the three dots (or the pencil) and edit the file again. Put the semicolon back. Commit directly to the `demo/lint-failure` branch.
10. Wait for CI to re-run. It will go green.
11. **Screenshot the green PR** showing all checks passed. Save as `screenshot-ci-recovered.png`.
12. Click the green **Merge pull request** button. Then **Confirm merge**. Then **Delete branch**.

You've now proven the gate blocks bad code and lets good code through. That's the whole point of CI.

---

## Phase 7 — Create the v1.0.0 Release (5 minutes)

1. On the repo page, click the **Releases** link in the right sidebar (under "About"). If you don't see it, it might be at the bottom of the page or under the **Code** tab.
2. Click **Draft a new release** (or **Create a new release**).
3. Click **Choose a tag**. Type `v1.0.0` and click **Create new tag: v1.0.0 on publish**.
4. Title: `v1.0.0`.
5. Click **Publish release**.

Wait — you don't manually attach the artefact. The `release` workflow will do that for you automatically. After about 2 minutes, refresh the release page. You should see a file called `wallet-transactions-v1.0.0.zip` listed under "Assets".

If it doesn't appear after 3 minutes, go to the **Actions** tab, find the `release` workflow run, and check it for errors.

**Screenshot the release page** showing the zip file attached. Save as `screenshot-release.png`.

---

## Phase 8 — Submit the assignment

You should now have:

1. **Repository URL** — copy from your browser's address bar on the repo page. Looks like `https://github.com/<your-username>/wallet-transactions-api`.
2. **Workflow file paths** — already in the repo at `.github/workflows/ci.yml` and `.github/workflows/release.yml`.
3. **Successful run URL** — the link to a passing CI run from the Actions tab. Click any green run and copy its URL.
4. **Screenshots** — the four PNG files from Phases 4, 6, and 7.
5. **Rationale** — the file `RATIONALE.md` already in the repo. Either link to it on GitHub or copy-paste its contents into your submission.

Submit those. You're done.

---

## Troubleshooting

**"npm install" fails on the GitHub Actions Install dependencies step.**
This shouldn't happen because the project is self-contained. If it does, click the failed step, copy the error, and ask Claude.

**gitleaks fails with a "license required" error.**
This only happens on private repos or organization accounts. Make sure your repo is **public** (Phase 3, step 8). To change later: Settings → General → scroll to "Danger Zone" → Change visibility → Make public.

**npm audit fails with a vulnerability.**
This means a security advisory was published for one of the libraries after I built this. Open `package.json`, find the dependency, and update its version number. Or ask Claude to "update package.json to fix the npm audit failure". Commit, push.

**"Push" or "Publish" in GitHub Desktop asks for credentials.**
You're not signed in. GitHub Desktop → menu bar → GitHub Desktop → Settings → Accounts → Sign in.

**The release workflow doesn't run when I tag v1.0.0.**
Releases must be created from a tag on the `main` branch. If you created the release from a branch, delete it and recreate from main. Also confirm `.github/workflows/release.yml` exists in the repo.

**I want to start over.**
Delete the repo: Settings → General → Danger Zone → Delete this repository. Then redo Phase 3.

---

## What you actually built (so you can speak about it)

If asked in a viva or interview, here's what you can honestly say:

> "I set up a GitHub Actions pipeline for a small Node.js wallet-transactions API. On every pull request, CI runs ESLint for code style, Jest for unit and integration tests, gitleaks to catch leaked secrets in commit history, and npm audit to flag vulnerable dependencies. Branch protection on main requires all those checks to pass before merge. A separate release workflow triggers on a semver tag and publishes a zipped artefact with auto-generated release notes. The release tag itself is a manual gate — that's the human checkpoint before anything ships."

That's the whole assignment in three sentences.
