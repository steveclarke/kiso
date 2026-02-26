# Contributing to Kiso

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone --recurse-submodules https://github.com/steveclarke/kiso.git
cd kiso
bundle install
bin/dev
```

This starts [Lookbook](https://lookbook.build) on port 4001 and a Tailwind CSS watcher.

If you cloned without `--recurse-submodules`, run `bin/vendor init` to fetch the reference repos.

## Running Tests

```bash
bundle exec rake test             # all tests
bundle exec standardrb            # lint
bundle exec standardrb --fix      # lint + auto-fix
```

Run a single test file or method:

```bash
bundle exec ruby -Itest test/components/badge_test.rb
bundle exec ruby -Itest test/components/badge_test.rb -n test_renders_default_badge
```

## Code Style

This project uses [StandardRB](https://github.com/standardrb/standard). Check and auto-fix:

```bash
bundle exec standardrb        # check
bundle exec standardrb --fix  # auto-fix
```

## Submitting Changes

1. Fork the repo and create a branch from `master`
2. Add tests for any new functionality
3. Make sure all tests pass and linting is clean
4. Write a clear commit message ([Conventional Commits](https://www.conventionalcommits.org/) preferred)
5. Open a pull request

## Reporting Bugs

Open a [GitHub issue](https://github.com/steveclarke/kiso/issues) with:

- Ruby and Rails versions
- What you expected vs. what happened
- Steps to reproduce
