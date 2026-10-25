# s1: ci and playwright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every sigil PR runs typecheck, unit tests, the size budget and Playwright tests of the playground in CI, and merges only when green.

**Architecture:** One GitHub Actions workflow with two jobs (`check`, `e2e`). Playwright drives the playground through Vite's dev server in two viewports (1280 desktop, 375 phone). Accessibility via axe.

**Tech Stack:** GitHub Actions, pnpm, @playwright/test (chromium), @axe-core/playwright.

**Spec:** `~/Code/fold/docs/superpowers/specs/2026-10-25-fold-design.md` §9 (delivery) and `docs/superpowers/specs/2026-10-24-sigil-design.md` §9 (accessibility).

## Global Constraints

- Commits and PR as `0x0nb` (repo config + active `gh` account), conventional commits, no AI trailers.
- One PR: branch `ci/playwright`, title `ci: checks and playwright`, squash-merged by `0x0nb` when green.
- Node 24, pnpm 10 (`packageManager` field pins it).
- Readable text keeps ≥ 4.5:1; `#4a4a4a` only on decoration (spec §9). Fix violations in components, never by disabling axe rules globally.

## Review Focus

- Dev server not ready in CI → flaky first test: `webServer` waits on the url with a 120 s timeout.
- `Confirm` focuses `n` on mount and scrolls the page: tests scroll their target into view before asserting.
- Reduced motion must be emulated before navigation, or the spinner has already started.
- axe flags decorative content: decoration is `aria-hidden` or css `content: … / ''`; any real violation is fixed in the component.
- Phone layout: `Ls` stacks below 640px; long values must not widen the page at 375px.

---

### Task 1: Playwright on the playground

**Files:**
- Create: `playwright.config.js`, `e2e/playground.spec.js`
- Modify: `package.json` (devDeps `@playwright/test`, `@axe-core/playwright`; script `test:e2e`: `playwright test`; field `"packageManager": "pnpm@10.33.2"`), `.gitignore` (`playwright-report`, `test-results`)

- [ ] **Step 1: Configure Playwright**

`playwright.config.js`: `testDir: 'e2e'`; `webServer: { command: 'pnpm dev --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI, timeout: 120_000 }`; `use.baseURL` the same url; projects `desktop` (chromium, viewport 1280×800) and `phone` (chromium, viewport 375×812, `isMobile: true`, `hasTouch: true`).

- [ ] **Step 2: Write the e2e tests**

```js
// e2e/playground.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('every section renders', async ({ page }) => {
  await page.goto('/');
  for (const h of ['tokens', 'terminal rules', 'copy rules', 'components', 'pages', 'assets'])
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
});

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(sw).toBeLessThanOrEqual(w);
});

test('prompt takes input and confirm answers by key', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('destination url');
  await input.scrollIntoViewIfNeeded();
  await input.fill('fld.0nb.dev');
  await expect(input).toHaveValue('fld.0nb.dev');
  const no = page.getByRole('button', { name: 'n', exact: true });
  await no.focus();
  await page.keyboard.press('y');
  await expect(page.getByText('answered y.')).toBeVisible();
});

test('spinner is static under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('status').filter({ hasText: 'loading' })).toContainText('…');
});

test('no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
```

- [ ] **Step 3: Run and watch what fails**

Run: `pnpm add -D @playwright/test @axe-core/playwright && pnpm exec playwright install chromium && pnpm test:e2e`
Expected: the first four pass on both projects. The axe test may fail; each violation is a real finding.

- [ ] **Step 4: Fix every axe violation in its component (TDD)**

For each violation: add a unit or ssr test in `test/` that reproduces it (e.g. missing accessible name), watch it fail, fix the component, watch it pass. No `disableRules`.

- [ ] **Step 5: Run everything**

Run: `pnpm check && pnpm test && pnpm test:e2e`
Expected: 0 type errors; all unit tests pass; 10 e2e tests pass (5 × 2 projects).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "test: playwright on the playground"
```

---

### Task 2: CI workflow and the PR

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

Triggers: `pull_request`, `push` to `main`. Two jobs on `ubuntu-latest`, each: `actions/checkout@v5`, `pnpm/action-setup@v4`, `actions/setup-node@v5` (`node-version: 24`, `cache: pnpm`), `pnpm install --frozen-lockfile`.
- `check`: `pnpm check`, `pnpm test`.
- `e2e`: `pnpm exec playwright install --with-deps chromium`, `pnpm test:e2e`; upload `playwright-report` as an artifact when it fails.

- [ ] **Step 2: Open the PR**

```bash
git switch -c ci/playwright   # before task 1's commit if not already on it
git push -u origin ci/playwright
gh pr create --title "ci: checks and playwright" --body "ci on every pr: typecheck, unit, budget, playwright (desktop + phone, axe)."
```

Expected: `gh pr checks` shows `check` and `e2e` pending, then both pass.

- [ ] **Step 3: Branch protection (you)**

Ask the user to run, as the org owner:

```
! gh auth switch -u m4tt72 && gh api -X PUT repos/0nb/sigil/branches/main/protection --input - <<'EOF'
{"required_status_checks":{"strict":true,"contexts":["check","e2e"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null}
EOF
gh auth switch -u 0x0nb
```

Expected: `gh api repos/0nb/sigil/branches/main/protection --jq '.required_status_checks.contexts'` prints `["check","e2e"]`.

- [ ] **Step 4: Merge**

Run: `gh pr merge --squash --delete-branch` once checks are green.
Expected: `main` has one new commit by `0x0nb`, verified; release-please runs (a `ci`/`test` commit opens no release).
