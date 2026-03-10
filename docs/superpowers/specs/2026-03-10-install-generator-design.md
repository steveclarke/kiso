# Install Generator Design

> **Issue:** #191 — Add design system generator for host apps

## Goal

Provide a `rails generate kiso:install` command that scaffolds a Kiso
initializer and (optionally) a design system document into the host app.
Solves the cold start problem — one command to go from "I installed the gem"
to "my app has configured Kiso and documented UI conventions."

## Architecture

Standard Rails generator. No required arguments. Interactive prompts for
optional outputs. Follows the pattern of the existing `kiso:component`
generator.

**File structure:**

```
lib/generators/kiso/install/
  install_generator.rb
  templates/
    initializer.rb.tt
    design_system.md.tt
  USAGE
```

## Outputs

### 1. `config/initializers/kiso.rb` (always created)

Well-commented starter file with everything commented out except the bare
`Kiso.configure` block. Sections:

- **Preset selection** — `config.apply_preset(:rounded)` / `:sharp` with
  one-line explanations of each
- **Global theme overrides** — examples for button, card, badge showing
  `base:`, `defaults:`, `ui:` keys
- **Icon customization** — example of `config.icons[:chevron_right]`
- **App theme** — `config.app_theme = :default`

If the file already exists, skip and print a message.

### 2. `DESIGN_SYSTEM.md` (opt-in, prompted)

Only generated if the user answers "yes" to the interactive prompt. If they
say yes, a follow-up prompt asks for the app name (defaults to "My App").

Personalized with the app name. Sections:

- **Intro** — "[AppName]'s design system, built on Kiso UI. Reference this
  before building any UI."
- **Color Palette** — Kiso's default semantic colors with a "customize these"
  callout pointing to the CSS Variables Reference page
- **Typography Hierarchy** — the 6 roles (page title, section title, card
  title, body, caption, label) with Tailwind sizes, weights, and when to use
- **Spacing Scale** — the standard scale with semantic names and usage
- **Component Conventions** — which Kiso components to use for common
  patterns (page headers, forms, empty states, cards, etc.)
- **Anti-patterns** — raw HTML instead of components, non-standard spacing,
  hardcoded colors

Written for both human developers and AI agents — structured with tables and
code examples, with rationale explaining "why."

### 3. Post-install message (always printed)

```
Kiso installed!

  Initializer: config/initializers/kiso.rb
  Design System: DESIGN_SYSTEM.md (if opted in)

Next steps:
  1. Add Kiso's CSS to your Tailwind stylesheet:
       @import "../builds/tailwind/kiso";
  2. Add the theme script to your layout <head>:
       <%= kiso_theme_script %>
  3. Customize your brand colors in your Tailwind @theme block.
     See: https://kisoui.com/guide/css-variables
```

## Interactive flow

```
$ rails generate kiso:install

    create  config/initializers/kiso.rb

Would you like to generate a Design System document?
This creates DESIGN_SYSTEM.md with your app's spacing, typography, color,
and component conventions — useful for team alignment and AI coding agents.

Generate DESIGN_SYSTEM.md? (y/n) y

What's your app called? This is just a friendly name for the document
header (e.g. "Outport", "My App"). [Default: My App]
> Outport

    create  DESIGN_SYSTEM.md
```

No required arguments. Initializer always created. Design system prompted,
app name only asked if they say yes.

## What this does NOT do

- **No CSS file generation** — host apps already have a Tailwind CSS file.
  Generating a separate one would need `@import` wiring (fragile with
  regex-based file insertion). The post-install message tells them what to add
  manually.
- **No file modification** — the generator only creates new files, never
  appends to or modifies existing files. If the initializer exists, it skips.
- **No interactive color/preset selection** — defaults are good enough. The
  initializer has commented-out examples for customization. Can add
  interactivity later if needed.

## Testing

- Test that the initializer is created with expected content
- Test that the initializer is skipped when it already exists
- Test that the design system doc is created when opted in
- Test that the design system doc uses the provided app name
- Test that the design system doc uses "My App" when no name given
- Test that the design system doc is not created when opted out
