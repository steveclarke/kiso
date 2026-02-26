---
name: release
description: Guide through releasing a new version of kiso. Use when cutting a release, publishing a new version, or running bin/release.
---

# Release kiso

The `bin/release` script handles all the mechanical steps. Your job is the advisory layer before it runs: reviewing what changed, confirming the CHANGELOG is good, and picking the right version.

## Step 1 — Review unreleased changes

Read both files:
- `CHANGELOG.md` — the `[Unreleased]` section
- `lib/kiso/version.rb` — the current version

Summarise the unreleased changes for the user and recommend a semver bump type with reasoning:

| Bump | When |
|------|------|
| **major** | Breaking changes to the public API |
| **minor** | New features, backward compatible |
| **patch** | Bug fixes, docs, internal changes only |
| **x.y.z.pre** | Pre-stable release (current convention while < 1.0) |

## Step 2 — Confirm CHANGELOG quality (manual step)

Show the `[Unreleased]` entries and ask the user to confirm they are complete and accurate before proceeding. Entries should be:

- Written as user-facing prose, not as commit messages
- Grouped under `### Added`, `### Changed`, `### Fixed`, `### Removed` as appropriate
- Covering everything significant in this release cycle

If entries are missing or need improvement, help the user edit `CHANGELOG.md` now — **before** running the release script. The script uses the CHANGELOG entries verbatim as the GitHub Release body.

## Step 3 — Confirm version

Propose a concrete version string based on the bump reasoning. Wait for the user to confirm or provide an alternative.

The current convention while the gem is pre-stable: use `x.y.z.pre` (e.g. `0.2.0.pre`). Switch to `x.y.z` when declaring stable.

## Step 4 — Dry run

Run the release script in dry-run mode with the confirmed version:

```bash
bin/release --dry-run <version>
```

Show the full output. If any check fails (dirty tree, not on master, tests fail, no CHANGELOG entries, etc.), stop and help resolve the issue before proceeding.

## Step 5 — Execute release

On user confirmation, run:

```bash
bin/release <version>
```

The script will:
1. Re-run preflight checks and full test suite
2. Bump version in `lib/kiso/version.rb`
3. Move `[Unreleased]` → `[VERSION] - DATE` in `CHANGELOG.md`
4. Verify the gem builds
5. Commit, create annotated tag, push to origin
6. Create a GitHub Release with the CHANGELOG section as release notes (auto-marked as prerelease for `pre`/`alpha`/`beta`/`rc` versions)
