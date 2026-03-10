# Releasing

The `bin/release` script handles the mechanical steps (version bump, tag,
push, GitHub Release). This guide covers the full process around it.

## Modes

```bash
bin/release 0.2.0                # gem only
bin/release --npm 0.1.1          # npm only (kiso-ui package)
bin/release 0.2.0 --npm 0.1.1   # both gem + npm
```

Gem and npm version independently. The gem uses `v*` tags, the npm package
uses `npm-v*` tags. GitHub Actions publish both automatically on tag push.

---

## Gem release workflow

### 1. Review unreleased changes

Check the current version and what changed since the last release:

```bash
cat lib/kiso/version.rb
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```

Determine the semver bump:

| Bump | When |
|------|------|
| **major** | Breaking changes to the public API |
| **minor** | New features, backward compatible |
| **patch** | Bug fixes, docs, internal changes only |
| **x.y.z.pre** | Pre-stable release (current convention while < 1.0) |

### 2. Confirm version

Pick a concrete version string. The current convention while pre-stable:
use `x.y.z.pre` (e.g. `0.5.0.pre`). Switch to `x.y.z` when declaring stable.

### 3. Run the full test suite

`bin/release` only runs Ruby tests and StandardRB. **You must also run E2E
tests.** Both must pass with zero failures before proceeding.

```bash
bundle exec rake test        # Ruby unit tests
npm run test:e2e              # Playwright E2E tests
```

A release with broken tests is a broken release. Fix failures first.

### 4. Dry run

```bash
bin/release --dry-run <version>
```

If any check fails (dirty tree, not on master, tests fail), resolve before
proceeding.

### 5. Execute release

```bash
bin/release -y <version>
```

The script will:
1. Re-run preflight checks and Ruby test suite
2. Bump version in `lib/kiso/version.rb`
3. Verify the gem builds
4. Commit, create annotated tag (`v*`), push to origin
5. Create a GitHub Release (auto-marked as prerelease for `pre`/`alpha`/`beta`/`rc`)
6. GitHub Actions pushes the gem to RubyGems

### 6. Write release notes

The auto-generated GitHub Release notes are just a diff link. Host app
developers (Outport, etc.) depend on proper release notes to know what
changed and what to adopt. **This is not optional.**

Update the release with hand-written notes:

```bash
gh release edit v<version> --notes "$(cat <<'EOF'
<release notes here>
EOF
)"
```

**Format:**

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
- Include ERB code examples for new components and features
- Bug fixes should explain the symptom, not just the code change
- Omit empty sections
- Include npm section only when npm was also released
- Keep the "Full Changelog" compare link at the bottom

---

## npm release workflow

The npm package (`kiso-ui`) ships Stimulus controllers for bundler apps.
It versions independently from the gem.

### 1. Review what changed

Check `package.json` for the current npm version and review JS controller
changes since the last npm release:

```bash
cat package.json | grep '"version"'
git log --oneline $(git describe --tags --abbrev=0 --match 'npm-v*')..HEAD -- app/javascript/ package.json
```

### 2. Confirm version

Standard semver (no `.pre` suffix for npm).

### 3. Dry run

```bash
bin/release --dry-run --npm <version>
```

### 4. Execute

```bash
bin/release -y --npm <version>
```

The script will:
1. Preflight checks (clean tree, on master, synced)
2. Bump version in `package.json`
3. Commit, create annotated tag (`npm-v*`), push to origin
4. GitHub Actions publishes to npm

---

## Combined release

Release both gem and npm in a single commit with both tags:

```bash
bin/release -y <gem-version> --npm <npm-version>
```

---

## Post-release: Deploy

After every release, deploy docs and Lookbook to production. Users need
docs that match the released gem version.

```bash
bin/deploy -y
```

This deploys both services via Kamal:
- **kisoui.com** — docs site (Bridgetown)
- **lookbook.kisoui.com** — Lookbook component previews

There are no GitHub Actions for deployment — it's always a manual step
after `bin/release`. See `project/deploying.md` for details.

Deploy only one service:

```bash
bin/deploy -y --only docs
bin/deploy -y --only lookbook
```

### Post-deploy verification

After deploy, verify the sites are live by checking key pages that changed
in this release.
