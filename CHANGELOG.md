# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Propshaft `stylesheet_link_tag :app` compatibility — the Rails 8.1 default `:app` symbol caused Propshaft to serve `tailwindcss-rails` engine CSS stubs directly to the browser, resulting in 404 errors for absolute filesystem paths. Kiso now filters these build-time intermediates from Propshaft's stylesheet resolution automatically. Host apps using either `:app` or explicit `"tailwind"` work correctly.

## [0.2.0.pre] - 2026-03-03

### Added

- InputOTP component — one-time password input with individual character slots, auto-advance, paste support, and mobile SMS autofill via `autocomplete="one-time-code"`. Stimulus controller distributes a single transparent input to visual slot divs. Sub-parts: group, slot, separator. Dispatches `change` and `complete` events for auto-submit workflows.
- SelectNative component — styled native `<select>` with chevron icon overlay. Variant × size axes matching Input (outline/soft/ghost, sm/md/lg). No JavaScript required.
- Sidebar state variants — `kui-sidebar-open:` and `kui-sidebar-closed:` custom Tailwind variants for showing/hiding any element based on sidebar open/closed state. Composable with breakpoints (e.g., `kui-sidebar-open:lg:hidden`).
- Custom toggle icon override — sidebar toggle and collapse buttons accept a block to replace the default icon.
- Auto body base styles — engine CSS now applies `bg-background text-foreground antialiased` on `<body>` via `@layer base`, so host apps no longer need to add these classes manually.

## [0.1.1.pre] - 2026-03-03

### Added

- Dashboard layout system — sidebar, navbar, panel, toolbar, and nav components with cookie-persisted sidebar state
- Avatar component with image, fallback, badge, and group support
- Form components — Field, Label, Input, Textarea, InputGroup, Checkbox, RadioGroup, Switch, Select, Combobox
- Overlay components — Popover, DropdownMenu, Command palette
- Navigation components — Breadcrumb, Pagination
- Element components — Kbd, Toggle, ToggleGroup
- Dark mode system — `kiso_theme_script` helper, ColorModeButton, ColorModeSelect
- Floating UI positioning for popovers and dropdowns
- Global theme overrides via `Kiso.configure`
- Configurable default icons via `kiso_component_icon`
- Getting Started guide

### Changed

- Renamed `kiso()` helper to `kui()` to avoid Rails route proxy collision
- Renamed `empty_state` to `empty` to match shadcn naming
- Adopted `data-slot` convention from shadcn v4

## [0.1.0.pre] - 2026-02-25

### Added

- Core engine with `kui()` component helper and `kiso_prepare_options` builder
- `class_variants` + `tailwind_merge` integration for variant definitions
- Theme CSS with 7 palettes, surface tokens, and dark mode
- Badge component (color × variant × size, pill shape, SVG handling)
- Alert component (color × variant, CSS Grid layout, title/description sub-parts)
- Button component (6 variants, smart tag, 5 sizes, icon support)
- Card component (3 variants, 6 sub-parts, shadcn gap-6/py-6 spacing)
- Separator component (horizontal/vertical, decorative prop)
- Empty State component (5 sub-parts, media variant)
- Lookbook component previews
- Bridgetown documentation site

[Unreleased]: https://github.com/steveclarke/kiso/compare/v0.2.0.pre...HEAD
[0.2.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.2.0.pre
[0.1.1.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.1.1.pre
[0.1.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.1.0.pre
