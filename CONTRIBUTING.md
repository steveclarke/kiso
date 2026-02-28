# Contributing to Kiso

Thanks for your interest in contributing! This guide gets you set up and
points you to the docs you'll need.

## Required Reading

Before building or modifying any component, read these in order:

1. **[Design System](project/design-system.md)** — compound variant formulas,
   semantic token table, spatial system (heights, padding, gaps, typography,
   radius, icon sizing). Every colored component uses identical formulas.
2. **[Component Strategy](project/component-strategy.md)** — class_variants
   patterns, theming, override system, dark mode.
3. **[Testing Strategy](project/testing-strategy.md)** — 3-tier testing model,
   what to test per tier, Playwright + Vitest setup.

## Two Sources of Truth

Every component is built from two reference implementations:

- **shadcn/ui** (`vendor/shadcn-ui/`) — structural source of truth. Match
  div-for-div, class-for-class. Copy Tailwind utilities for layout, spacing,
  typography.
- **Nuxt UI** (`vendor/nuxt-ui/`) — theming source of truth. Color x variant
  compound variants, outline/soft/subtle system, token usage.

shadcn provides the skeleton, Nuxt UI provides the paint.

## Setup

```bash
git clone --recurse-submodules https://github.com/steveclarke/kiso.git
cd kiso
bundle install
npm install
bin/dev
```

This starts [Lookbook](https://lookbook.build) on port 4001 and the
[docs site](https://kisoui.com) on port 4000, both via Overmind.

If you cloned without `--recurse-submodules`, run `bin/vendor init` to
fetch the vendor repos.

## Running Tests

```bash
# Ruby
bundle exec rake test

# All JavaScript tests (unit + E2E — needs bin/dev running)
npm run test

# JavaScript unit tests (Vitest)
npm run test:unit

# End-to-end tests (Playwright — needs bin/dev running)
npm run test:e2e

# Run a single Ruby test file
bundle exec ruby -Itest test/components/badge_test.rb
```

## Linting and Formatting

```bash
# Ruby (StandardRB)
bundle exec standardrb            # check
bundle exec standardrb --fix      # auto-fix

# JavaScript (oxlint + oxfmt)
npm run lint                      # lint
npm run lint:fix                  # lint with auto-fix
npm run fmt                       # format
npm run fmt:check                 # check formatting (CI)
```

## Project Layout

```
lib/kiso/themes/                  Theme modules (ClassVariants definitions)
app/views/kiso/components/        ERB partials (rendered via kui() helper)
app/javascript/controllers/kiso/  Stimulus controllers (shipped via npm as kiso-ui)
app/helpers/kiso/                 kui(), kiso_prepare_options() helpers
app/assets/stylesheets/kiso/      CSS (transitions and pseudo-states only)
test/components/previews/         Lookbook preview classes + templates
test/e2e/                         Playwright E2E tests
lookbook/                         Lookbook dev app
docs/                             Bridgetown docs site
project/                          Architecture docs, design system, component visions
```

## Submitting Changes

1. Fork the repo and create a branch from `master`
2. Add tests for any new functionality (see [Testing Strategy](project/testing-strategy.md))
3. Make sure all tests pass and linting is clean
4. Write a clear commit message using [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
5. Include `Closes #N` in the PR body to auto-close the linked issue
6. Open a pull request — all PRs are squash-merged

## Reporting Bugs

Open a [GitHub issue](https://github.com/steveclarke/kiso/issues) with:

- Ruby and Rails versions
- What you expected vs. what happened
- Steps to reproduce
