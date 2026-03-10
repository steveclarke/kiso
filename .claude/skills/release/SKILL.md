---
name: release
description: Guide through releasing a new version of kiso. Use when cutting a release, publishing a new version, or running bin/release.
---

# Release kiso

The `bin/release` script handles all the mechanical steps. Your job is the advisory layer before it runs: reviewing what changed, confirming the version, and verifying preflight checks pass.

The script supports three modes:

```bash
bin/release 0.2.0                # gem only
bin/release --npm 0.1.1          # npm only (kiso-ui package)
bin/release 0.2.0 --npm 0.1.1   # both gem + npm
```

Gem and npm package version independently. The gem uses `v*` tags, the npm package uses `npm-v*` tags. GitHub Actions publish both automatically on tag push.

---

## Gem release workflow

### Step 1 — Review unreleased changes

Read `lib/kiso/version.rb` for the current version, then review what changed since the last release:

```bash
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```

Summarise the changes for the user and recommend a semver bump type with reasoning:

| Bump | When |
|------|------|
| **major** | Breaking changes to the public API |
| **minor** | New features, backward compatible |
| **patch** | Bug fixes, docs, internal changes only |
| **x.y.z.pre** | Pre-stable release (current convention while < 1.0) |

### Step 2 — Confirm version

Propose a concrete version string based on the bump reasoning. Wait for the user to confirm or provide an alternative.

The current convention while the gem is pre-stable: use `x.y.z.pre` (e.g. `0.2.0.pre`). Switch to `x.y.z` when declaring stable.

### Step 3 — Run the full test suite

**Before the dry run, run ALL tests yourself.** `bin/release` only runs
Ruby tests and StandardRB — it does NOT run E2E tests. You must run them:

```bash
bundle exec rake test        # Ruby unit tests
npm run test:e2e              # Playwright E2E tests
```

Both must pass with zero failures before proceeding. If anything fails,
fix it first. Do not skip this step — a release with broken tests is a
broken release.

### Step 4 — Dry run

Run the release script in dry-run mode with the confirmed version:

```bash
bin/release --dry-run <version>
```

Show the full output. If any check fails (dirty tree, not on master, tests fail, etc.), stop and help resolve the issue before proceeding.

### Step 5 — Execute release

On user confirmation, run:

```bash
bin/release <version>
```

The script will:
1. Re-run preflight checks and full test suite
2. Bump version in `lib/kiso/version.rb`
3. Verify the gem builds
4. Commit, create annotated tag (`v*`), push to origin
5. Create a GitHub Release (auto-marked as prerelease for `pre`/`alpha`/`beta`/`rc` versions)
6. GitHub Actions pushes the gem to RubyGems

### Step 6 — Write release notes

**This is not optional.** The auto-generated GitHub Release notes are just a
diff link — useless for downstream consumers. Host app developers (Outport,
etc.) depend on these notes to know what changed and what to adopt.

Immediately after `bin/release` completes, update the GitHub Release with
hand-written notes using `gh release edit`:

```bash
gh release edit v<version> --notes "$(cat <<'EOF'
<release notes here>
EOF
)"
```

**Release notes format:**

```markdown
## New Components

### ComponentName
One-sentence description of what it does.

\```erb
<%= kui(:component) %>
\```

## New Features

### Feature Name
What it does and why it matters. Include a code example.

## Enhancements

- **Component/area** — what changed and why

## Bug Fixes

- **Description of the bug** — what was wrong and how it was fixed

## npm: kiso-ui@X.Y.Z

List new/changed controller exports if npm was also released.

**Full Changelog**: https://github.com/steveclarke/kiso/compare/vOLD...vNEW
```

**Guidelines:**
- Group by: New Components, New Features, Enhancements, Bug Fixes, Breaking Changes
- Include ERB code examples for new components and features — show how to use them
- Bug fixes should explain the symptom, not just the code change
- Omit empty sections (no "Breaking Changes" header if there are none)
- Include npm section only when npm was also released
- Keep the auto-generated "Full Changelog" compare link at the bottom

---

## npm release workflow

The npm package (`kiso-ui`) ships Stimulus controllers for bundler apps. It versions independently from the gem — JS controllers change less frequently than HTML/CSS.

### Step 1 — Review what changed

Read `package.json` for the current npm version and check what JS controller changes have been made since the last npm release.

### Step 2 — Confirm version

Propose a version bump. The npm package follows standard semver (no `.pre` suffix).

### Step 3 — Dry run

```bash
bin/release --dry-run --npm <version>
```

### Step 4 — Execute release

```bash
bin/release --npm <version>
```

The script will:
1. Preflight checks (clean tree, on master, synced)
2. Bump version in `package.json`
3. Commit, create annotated tag (`npm-v*`), push to origin
4. GitHub Actions publishes to npm

---

## Combined release

When releasing both gem and npm together:

```bash
bin/release <gem-version> --npm <npm-version>
```

Both version bumps go into a single commit with both tags.

---

## Post-release: Deploy docs and Lookbook

After every release, deploy both the docs site and Lookbook to production.
This is **not optional** — users need docs that match the released gem version.

**IMPORTANT:** Use `-y` flag — Claude Code cannot open a TTY for interactive
confirmation. Same applies to `bin/release`.

```bash
bin/deploy -y
```

This deploys both services via Kamal:
- **kisoui.com** — docs site (Bridgetown)
- **lookbook.kisoui.com** — Lookbook component previews

There are **no GitHub Actions for deployment**. Deployment is always a manual
step run via `bin/deploy` after `bin/release`. The deploy script pulls secrets
from 1Password (prompts for biometric) and pushes to the production server.

If you need to deploy only one service:

```bash
bin/deploy -y --only docs
bin/deploy -y --only lookbook
```

### Post-deploy verification

After deploy completes, verify the sites are live by checking key pages that
changed in this release. Use browser tools or `curl` to confirm.
