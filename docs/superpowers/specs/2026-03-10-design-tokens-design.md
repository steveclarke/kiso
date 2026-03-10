# Design Tokens — Selective CSS Variables & Maintenance (#188)

## Problem

Kiso needs a solid design system foundation that AI agents can read and follow
consistently. The existing `project/design-system.md` is strong but has gaps:
no CSS variable reference, no host-app framing, and the `/update-docs` skill
isn't wired into any workflow — so doc drift goes undetected.

## Research Findings

Neither shadcn/ui nor Nuxt UI tokenize spacing or typography as CSS variables.
Both hardcode Tailwind utilities per-component. What they do tokenize:

- **Colors** — both have layered systems (primitives + semantic aliases)
- **Radius** — shadcn computes a scale from one `--radius` base value
- **Structural sizing** — Nuxt UI defines `--ui-radius`, `--ui-container`,
  `--ui-header-height`; Kiso already has `--sidebar-width`, `--topbar-height`

Agents read design system docs, not CSS variables, for spacing decisions.
CSS variables are only needed where host apps need runtime customization.

## Approach: Selective CSS Variables (Approach B)

Follow Nuxt UI's pattern — tokenize only structural values that host apps
need to override at runtime. Keep spacing/typography as Tailwind utilities
in component themes.

## Deliverables

### 1. Structural CSS variables

Add to Kiso's engine stylesheet:

| Variable | Default | Nuxt UI equivalent | Purpose |
|----------|---------|-------------------|---------|
| `--kiso-radius` | `0.375rem` | `--ui-radius` | Base border radius |
| `--kiso-container` | `80rem` | `--ui-container` | Max content width |

Existing dashboard variables (`--sidebar-width`, `--topbar-height`) stay as-is.

### 2. Design system document improvements

Enhance `project/design-system.md`:

- **CSS variable reference** — document the structural tokens with defaults
  and how host apps override them
- **Host-app framing** — distinguish "rules for building Kiso components" vs
  "values/patterns a host app should follow when building with Kiso"
- **Spatial philosophy intro** — brief intro to the spatial tables explaining
  they're extracted from shadcn, no arbitrary values allowed

### 3. Wire `/update-docs` into workflows

Three integration points:

- **CLAUDE.md finalize checklist** — add "Run `/update-docs` to audit all
  documentation" to the per-PR section
- **`project/releasing.md`** — add doc audit step between test suite (step 3)
  and dry run (step 4)
- **`update-docs` skill** — add design system drift detection: "If a component
  introduces spacing or typography values not in the documented scales, either
  use an existing value or update the scale"

### 4. Follow-up issue: radius scale computation

Create a GitHub issue for computing a radius scale from `--kiso-radius`, like
shadcn's pattern: `--radius-sm = calc(var(--radius) - 4px)`. This would let
presets override one variable instead of per-component radius classes.

### 5. Pre-implementation: documentation baseline

Run `/update-docs` before any implementation to fix existing staleness. We
don't want to encode inaccurate information.

## Execution Order

1. Run `/update-docs` — fix any staleness first
2. Add CSS variables to engine stylesheet
3. Update `project/design-system.md` with variable reference and host-app framing
4. Wire `/update-docs` into CLAUDE.md finalize and release process
5. Update `update-docs` skill with design system drift checks
6. Create radius scale follow-up issue

## Out of Scope

- Host app generator — that's #191
- Full spacing/typography CSS variables — neither reference framework does this
- Radius scale computation — tracked as follow-up issue
- Changes to existing component theme modules — they keep using Tailwind
  utilities directly
- Rewriting spatial tables — they're already well-documented, just need
  framing improvements

## References

- Nuxt UI semantic tokens: `vendor/nuxt-ui/src/runtime/index.css`
- shadcn globals: `vendor/shadcn-ui/apps/v4/styles/globals.css`
- Kiso design system: `project/design-system.md`
- Issue #188: Define semantic design tokens
- Issue #191: Design system generator (depends on this work)
