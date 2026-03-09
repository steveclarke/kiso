# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.3.pre] - 2026-03-08

### Fixed

- `scope:` values now merge into the parent partial's kwargs — previously, scope was pushed onto the stack for sub-parts but not merged into the parent's own strict locals, causing `ActionView::StrictLocalsError`
- `kui_tag` / `appui_tag` now render correctly without a block — self-closing elements (e.g., status dots, icons) were rendering the options hash as text content instead of HTML attributes

## [0.4.2.pre] - 2026-03-08

### Added

- `scope:` prop for sharing domain locals from parent components to sub-parts — `appui(:room_card, scope: { room: room })` makes `room:` available to all sub-parts automatically without repeating it on every call. Explicit kwargs on sub-part calls override scope values. One level deep only (parent to its own sub-parts).

## [0.4.1.pre] - 2026-03-08

### Added

- `center:` variant on App layout component — `kui(:app, center: true)` applies full-viewport centering for login pages and similar single-focus layouts
- `kui_tag` / `appui_tag` helpers — collapse the common `content_tag` + `kiso_prepare_options` + theme rendering boilerplate into a single call; component generator templates now use `appui_tag` by default
- Shade scale auto-wiring — host apps defining `--color-primary-50` through `--color-primary-950` in their Tailwind `@theme` block now automatically feed into Kiso's semantic color tokens (shade 500 for light mode, 400 for dark mode, matching Nuxt UI conventions)

### Fixed

- Palette CSS files are now importable in host apps — a `kiso:palettes` rake task generates CSS stubs so `@import "../builds/tailwind/kiso/palettes/blue.css"` resolves correctly

## [0.4.0.pre] - 2026-03-08

### Added

- Layout component family: App, Container (4 size variants), Header, Footer, Main
- Page component family: Page (grid with sidebars), PageHeader, PageBody, PageSection, PageGrid, PageCard (4 variants)
- `appui()` helper for host app components with `app/themes/` and `app/views/components/`
- `kiso:framework_component` generator for scaffolding engine components
- `kiso:component` generator for scaffolding host app components
- Theme presets: `apply_preset(:rounded)` and `apply_preset(:sharp)`
- 5 OKLCH color palettes (zinc, blue, green, orange, violet)
- i18n support: all component strings use `t()` with `config/locales/en.yml`
- [Building Your Own Components](/guide/building-components) guide — how to wrap Kiso components with domain logic and build standalone components with `appui()`, themes, and sub-parts
- [Detailed release notes](/releases/batch-merge) with upgrade guide and examples for all new features

## [0.3.0.pre] - 2026-03-03

### Added

- Dialog component — modal dialog wrapping the native `<dialog>` element with `showModal()` for focus trapping and backdrop. Sub-parts: header, title, description, body, footer, close. Entry/exit CSS animations with reduced-motion support. Stimulus controller for programmatic open/close.
- Alert Dialog component — confirmation dialog that requires an explicit user action (`role="alertdialog"`). Cannot be dismissed by Escape or backdrop click. Sub-parts: header, title, description, media, footer, action, cancel. Size variants (default/sm) with responsive media grid layout. Auto-linked `aria-labelledby` and `aria-describedby`.
- AspectRatio component — lightweight wrapper that applies an aspect ratio via inline style. Accepts any `ratio:` value (defaults to 16:9).
- Slider component — range input with track, thumb, and fill styling. Supports min/max/step/value, three sizes (sm/md/lg), and disabled state. Stimulus controller for real-time value display.
- Empty component `:actions` slot for placing buttons below the description.
- Button `method:` prop — renders a Rails `button_to` form for DELETE/POST/PUT/PATCH actions while preserving all Button styling.
- Icons guide added to documentation site.

### Fixed

- InputOTP slots missing visible border when a separator is placed inside a group.
- Sidebar header and footer now use `flex-col` layout matching shadcn structure.

## [0.2.2.pre] - 2026-03-03

### Fixed

- Dashboard layout rendering — components called without a block inside a layout (e.g., sidebar toggle, collapse) would capture the entire page template via ERB yield bubbling, breaking the dashboard grid. The `kui()` helper now passes an empty proc to prevent yield from reaching the layout.
- Dashboard toggle and collapse icon sizing — SVG icons now render at the correct size via `[&>svg]:size-4`.

## [0.2.1.pre] - 2026-03-03

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

[Unreleased]: https://github.com/steveclarke/kiso/compare/v0.4.3.pre...HEAD
[0.4.3.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.4.3.pre
[0.4.2.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.4.2.pre
[0.4.1.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.4.1.pre
[0.4.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.4.0.pre
[0.3.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.3.0.pre
[0.2.2.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.2.2.pre
[0.2.1.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.2.1.pre
[0.2.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.2.0.pre
[0.1.1.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.1.1.pre
[0.1.0.pre]: https://github.com/steveclarke/kiso/releases/tag/v0.1.0.pre
