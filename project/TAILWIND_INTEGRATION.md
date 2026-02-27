# Tailwind Integration

How Kiso's CSS, tokens, and source scanning reach host applications. This is
the most integration-sensitive part of the gem — if it breaks, components
render without styles. **Read this before changing anything in
`app/assets/tailwind/kiso_engine/`.**

---

## The problem

Kiso is a Rails engine. Its Tailwind classes live in Ruby theme modules
(`lib/kiso/themes/`), ERB partials (`app/views/`), and helpers
(`app/helpers/`). Tailwind's scanner needs to find these files to include the
right utility classes in the host app's CSS build.

Tailwind v4 scans files referenced by `@source` directives. But it only
processes `@source` in the **top-level entry point** CSS file — not in files
pulled in via `@import`. An engine can't just ship an `engine.css` with
`@source` lines and expect them to work when imported.

Additionally, the engine ships semantic color tokens (`@theme` blocks), font
declarations, and dark mode overrides that the host app needs.

## The solution: tailwindcss-rails engine bundling

`tailwindcss-rails` v4 provides a built-in mechanism for exactly this.

### How it works

1. The `tailwindcss:engines` Rake task scans all loaded Rails engines for a
   file at `app/assets/tailwind/{engine_name}/engine.css`.

2. For each engine found, it generates a file in the **host app** at
   `app/assets/builds/tailwind/{engine_name}.css` containing a single
   `@import` with the absolute path to the engine's CSS.

3. `tailwindcss:engines` runs automatically as a prerequisite of both
   `tailwindcss:build` and `tailwindcss:watch`. No custom Rake tasks needed.

4. The host app imports the generated file in its `application.css`:
   ```css
   @import "tailwindcss";
   @import "../builds/tailwind/kiso_engine.css";
   ```

### Why it works

The generated file is a top-level `@import`, not nested. Tailwind processes
the `@import` chain and resolves `engine.css` as if it were inlined. This
means `@theme`, `@font-face`, `.dark {}`, and `@source` directives inside
`engine.css` all take effect.

### Critical constraint: directory name must match engine name

Kiso's engine is registered as `kiso_engine` (in `lib/kiso/engine.rb`) to
avoid namespace collisions with the `Kiso` module. The CSS directory **must**
be `app/assets/tailwind/kiso_engine/` — not `kiso/`.

If they don't match, `tailwindcss:engines` silently skips the engine. No
error, no warning. The generated file won't exist, and `@import` in the host
app's CSS will fail at Tailwind compile time.

```ruby
# lib/kiso/engine.rb
engine_name "kiso_engine"  # <- this name must match the directory
```

```
app/assets/tailwind/
  kiso_engine/        # <- must match engine_name
    engine.css        # <- required filename
    checkbox.css      # <- component CSS, imported by engine.css
    radio-group.css
```

## What engine.css contains

`app/assets/tailwind/kiso_engine/engine.css` is the single entry point that
ships with the gem. Everything the host app needs flows through this file.

### 1. Component CSS imports

```css
@import "./checkbox.css";
@import "./radio-group.css";
```

Only transitions, animations, and pseudo-states that ERB can't express. Most
component styling lives in Ruby theme modules as computed Tailwind classes.

### 2. Source scanning directives

```css
@source "../../views";
@source "../../helpers";
@source "../../../../lib/kiso/themes";
```

These tell Tailwind to scan Kiso's partials, helpers, and Ruby theme files for
class names. Without them, utility classes referenced in Ruby code (like
`inline-flex items-center rounded-md`) would be tree-shaken out of the build.

Paths are relative to `engine.css`'s location in the gem.

### 3. Geist font declarations

Self-hosted variable WOFF2 fonts with `@font-face` declarations and `@theme`
defaults for `--font-sans` and `--font-mono`. Host apps can override by
redefining these variables.

### 4. Semantic color tokens

`@theme` block defining purpose-named colors: `primary`, `secondary`,
`success`, `info`, `warning`, `error`, plus surface tokens (`background`,
`foreground`, `muted`, `accent`, `inverted`, `elevated`, `border`, `ring`).

Every color has a `-foreground` companion for accessible text pairing.

### 5. Dark mode overrides

`.dark {}` block redefining all tokens for dark mode. Components never use
Tailwind `dark:` prefixes — they use semantic tokens that flip automatically.

## Host app setup

A host app needs exactly two things:

```ruby
# Gemfile
gem "kiso"
```

```css
/* app/assets/tailwind/application.css */
@import "tailwindcss";
@import "../builds/tailwind/kiso_engine.css";
```

The generated file at `app/assets/builds/tailwind/kiso_engine.css` is
transient (gitignored) and recreated on every build.

To retheme:
```css
@theme { --color-primary: var(--color-violet-600); }
```

## Lookbook (dev environment)

The Lookbook app at `lookbook/` is a real Rails app that loads Kiso as a
dependency. Its `application.css` imports the same generated file plus
Lookbook-specific source paths:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso_engine.css";

/* Lookbook-specific sources */
@source "../../views";
@source "../../../../test/components/previews";
```

The generated file at `lookbook/app/assets/builds/tailwind/kiso_engine.css`
is gitignored. It is created automatically when `tailwindcss:watch` or
`tailwindcss:build` runs (via Overmind's `css` process or `bin/dev`).

## Failure modes

These are the ways this integration can break. Check these first when
debugging CSS issues.

### Missing styles (classes tree-shaken)

**Symptom**: Components render but look unstyled — missing padding, colors,
rounded corners.

**Cause**: `@source` directives not reaching Tailwind's scanner. Either
`engine.css` isn't being imported, or the relative paths inside it are wrong.

**Check**: Run `bin/rails tailwindcss:build` and inspect the output CSS for
expected utility classes (e.g., `inline-flex`, `rounded-md`).

### bin/dev crashes on startup

**Symptom**: Overmind starts then immediately stops all processes. The `css`
process exits first.

**Cause**: The generated file doesn't exist yet (clean checkout) and
`tailwindcss:engines` didn't create it. Usually means the directory name
doesn't match the engine name.

**Check**: `bin/rails runner "puts Kiso::Engine.engine_name"` should output
`kiso_engine`. The directory should be `app/assets/tailwind/kiso_engine/`.

### Tokens not applied (no semantic colors)

**Symptom**: Components render with Tailwind defaults instead of Kiso's
color scheme.

**Cause**: `engine.css` not imported, or `@theme` block not processed.

**Check**: Inspect the compiled CSS for `--color-primary`. If missing, the
import chain is broken.

### Dark mode doesn't work

**Symptom**: Adding `.dark` to `<html>` doesn't change component colors.

**Cause**: The `.dark {}` block in `engine.css` isn't being included.

**Check**: Search the compiled CSS for `.dark`. If absent, `engine.css` isn't
being processed.

### Font not loading

**Symptom**: Text renders in system fonts instead of Geist.

**Cause**: WOFF2 files not served. The `@font-face` declarations reference
`/kiso/GeistVF.woff2` — this path is served by the engine's asset pipeline.

**Check**: Visit `/kiso/GeistVF.woff2` in the browser. If 404, the engine's
asset paths aren't mounted.

## Testing in a real host app

Before release, test the full integration in a fresh Rails app:

```bash
rails new testapp
cd testapp
# Add gem "kiso" to Gemfile
bundle install
# Add @import to application.css
bin/rails tailwindcss:build
# Inspect app/assets/builds/tailwind/kiso_engine.css — should exist
# Inspect app/assets/builds/tailwind.css — should contain Kiso classes
```

Verify:
- [ ] `kiso_engine.css` generated automatically
- [ ] Semantic tokens present in compiled CSS (`--color-primary`)
- [ ] Utility classes from theme modules present (`inline-flex`, `rounded-md`)
- [ ] Dark mode tokens present (`.dark { --color-primary: ... }`)
- [ ] Geist font declarations present
- [ ] Components render correctly (`<%= kiso(:badge) { "Test" } %>`)
- [ ] Dark mode works (add `class="dark"` to `<html>`)
- [ ] Host app can override tokens (`@theme { --color-primary: ... }`)
