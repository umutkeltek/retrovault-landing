# RetroVault Landing Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and publish a standalone, polished RetroVault landing website that can live at `retrovault.keltek.ai`.

**Architecture:** Keep the website independent from the iOS app repo by making `landing/` its own git repository. Use a static, dependency-light site with an immersive canvas hero, responsive sections, local legal/support links, pricing, FAQ, and submission-safe product copy. Validate key content with a Node script and smoke-test rendering in a browser.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node-based content checks, GitHub CLI.

---

### Task 1: Static Site Skeleton and Content Test

**Files:**
- Create: `package.json`
- Create: `tests/content-check.mjs`
- Create after red: `index.html`
- Create after red: `styles.css`
- Create after red: `script.js`

**Step 1: Write the failing test**

Add `tests/content-check.mjs` to assert the landing page contains the launch pricing, legal/support links, no trademarked console-brand marketing claims, no bundled-ROM promises, and the App Store/source-offer essentials.

**Step 2: Run test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because the site files do not exist yet.

**Step 3: Build the page**

Create `index.html`, `styles.css`, and `script.js` with:
- full-bleed canvas hero for a premium retro handheld archive mood,
- direct value proposition,
- App Store coming-soon CTA,
- import/no-ROM compliance copy,
- features, pricing, privacy/legal, source-offer, FAQ, and footer,
- responsive layout with no horizontal overflow.

**Step 4: Run test to verify it passes**

Run:

```bash
npm test
```

Expected: PASS.

### Task 2: Browser Smoke and Repo Publish

**Files:**
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Smoke locally**

Start a static server:

```bash
python3 -m http.server 4173
```

Open the site at `http://127.0.0.1:4173`, check desktop and mobile widths, and verify the canvas is not blank.

**Step 2: Commit**

Run:

```bash
git init
git add .
git commit -m "feat: launch retrovault landing site"
```

**Step 3: Publish separate GitHub repo**

Run:

```bash
gh repo create umutkeltek/retrovault-landing --public --source=. --remote=origin --push
```

Expected: public website repo exists separately from the app repo.
