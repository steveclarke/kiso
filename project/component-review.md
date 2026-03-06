# Component Review Checklist

How to review a Kiso UI component for quality and consistency.

## The checklist

For each check, report PASS or FAIL with specific details.

### Check 1: Names match shadcn exactly

Read the shadcn TSX file at `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/{name}.tsx`.
List every exported component name. Verify:
- The Kiso component name matches the shadcn file name
- Every sub-part name matches a shadcn export
- File names match: `lib/kiso/themes/{shadcn_name}.rb`, `_{shadcn_name}.html.erb`

**Common mistakes:** Inventing names that shadcn doesn't use. Adding suffixes
like `_state` or `_group` when shadcn doesn't. Using different casing.

### Check 2: Div-for-div structure

For each shadcn component/sub-component, verify the Kiso ERB uses the same
HTML element:
- `<div>` in shadcn → `<div>` in Kiso (via `content_tag :div`)
- `<label>` in shadcn → `<label>` in Kiso
- `<fieldset>` in shadcn → `<fieldset>` in Kiso
- `<p>` in shadcn → `<p>` in Kiso
- etc.

Also verify the same semantic attributes: `role`, `aria-*` attributes.

### Check 3: Tailwind class alignment

Compare the shadcn classes against the Kiso theme module. For each
component/sub-part:

- Layout classes (flex, grid, gap, items-center, etc.) should match exactly
- Spacing classes (px-*, py-*, p-*, m-*) should match exactly
- Typography classes (text-sm, font-medium, leading-*) should match exactly
- Only these deviations are allowed:
  - `border` → `ring ring-inset ring-border` (Kiso ring convention)
  - `bg-card`, `bg-destructive`, etc. → Kiso semantic tokens
  - `text-destructive` → `text-error`
  - `dark:` prefixes → removed (Kiso uses CSS variable swapping)
  - `data-slot` naming should match shadcn (kebab-case)

**Common mistakes:** Dropping classes, adding classes that shadcn doesn't have,
using arbitrary values, changing spacing.

### Check 4: Compound variant formulas (colored components only)

If the component has `color:` x `variant:` axes, verify the 28 compound
variants match `project/design-system.md` exactly:

| Variant | Colored | Neutral |
|---------|---------|---------|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

Verify `ring ring-inset` is on the variant axis (outline, subtle), NOT in compounds.

### Check 5: text-foreground on containers

Every component that displays text must set `text-foreground` on its root
element. This is required for dark mode (browser default is black, doesn't
flip with CSS variables).

Check the theme module's `base:` string for `text-foreground`.

**Exceptions:** Sub-parts that inherit color from parent (like AlertTitle
inside Alert). Description text inside colored components inherits parent color.

### Check 6: Data slot identity

Verify:
- Root component: `data: kiso_prepare_options(component_options, slot: "name")`
- Sub-parts: `data: kiso_prepare_options(component_options, slot: "name-part")`
- All slot values use kebab-case (e.g., `"toggle-group"`, not `"toggle_group"`)
- No raw `data: { slot: ... }` — always use `kiso_prepare_options`

### Check 7: All deliverables present

Check that ALL of these files exist:
- [ ] Theme module: `lib/kiso/themes/{name}.rb`
- [ ] Require line in `lib/kiso.rb`
- [ ] Main partial: `app/views/kiso/components/_{name}.html.erb`
- [ ] Sub-part partials (if component has sub-parts)
- [ ] Self-rendering partials accept `ui: {}` and apply `class: ui[:slot_name]` to inner themed elements
- [ ] Lookbook preview class: `test/components/previews/kiso/{name}_preview.rb`
- [ ] Lookbook preview templates matching shadcn demos (compare against
      `vendor/shadcn-ui/apps/v4/content/docs/components/radix/{name}.mdx` and
      `vendor/shadcn-ui/apps/v4/examples/radix/{name}-*.tsx` — same scenarios,
      same icons, same text labels)
- [ ] Docs page: `docs/src/components/{name}.md`
- [ ] Navigation entry in `docs/src/_data/navigation.yml`
- [ ] Skills reference: new file at `skills/kiso/references/components/{name}.md`
- [ ] Skills reference: row added to index `skills/kiso/references/components.md`

### Check 8: PR body has Closes #N

The PR body must contain `Closes #N` (where N is the issue number) so GitHub
auto-closes the issue on merge. Check with:
```bash
gh pr view {PR_NUMBER} --json body -q '.body' | grep -i 'closes #'
```

### Check 9: No arbitrary Tailwind values

Search the theme module for bracket notation:
```bash
grep -n '\[' lib/kiso/themes/{name}.rb | grep -v '#\|data-\|>\|role\|slot\|&\|sr-only'
```

Only `[&>...]` selectors and `data-[...]` attribute selectors are acceptable.
Values like `text-[8px]`, `h-[1.15rem]`, `p-[3px]` are not.

### Check 10: Lint and tests

Run:
```bash
bundle exec standardrb --check lib/kiso/themes/{name}.rb
bundle exec rake test
npm run lint && npm run fmt:check
npm run test:unit
npm run test:e2e
```

### Check 11: E2E test file exists and covers correct tier

Verify `test/e2e/components/{name}.spec.js` exists. Read
`project/testing-strategy.md` for the tier system, then verify:

- **Tier 1 (static):** renders, content, variants, composition, a11y
- **Tier 2 (native-interactive):** + state, disabled
- **Tier 3 (Stimulus):** + open/close, keyboard, focus, ARIA state, selection

The test file must cover ALL required categories for the component's tier.
Stimulus components (Tier 3) are the most critical — check that open/close,
Escape, click outside, and keyboard navigation are all tested.

**Check for silently suppressed issues.** If the test excludes axe rules or
skips tests, verify each has a comment explaining why and a link to a tracking
issue. Tests should never hide component bugs — they should document them.

### Check 12: JSDoc on Stimulus controllers

If the component includes a Stimulus controller, verify it has full JSDoc:
- Class-level: description, `@example` with HTML usage, `@property` for
  targets and values, `@fires` for dispatched events
- Public methods: `@param` and `@returns` where applicable
- Private methods: `@private` tag, plus `@param`/`@returns` if non-trivial
- Reference: `app/javascript/controllers/kiso/select_controller.js`

---

## Report format

```
## Review: {ComponentName} (PR #{N})

### Results

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Names match shadcn | PASS/FAIL | details |
| 2 | Div-for-div structure | PASS/FAIL | details |
| 3 | Tailwind class alignment | PASS/FAIL | details |
| 4 | Compound variants | PASS/FAIL/N/A | details |
| 5 | text-foreground on containers | PASS/FAIL | details |
| 6 | Data attributes | PASS/FAIL | details |
| 7 | All deliverables present | PASS/FAIL | details |
| 8 | Closes #N in PR body | PASS/FAIL | details |
| 9 | No arbitrary values | PASS/FAIL | details |
| 10 | Lint and tests | PASS/FAIL | details |
| 11 | E2E tests cover correct tier | PASS/FAIL | details |
| 12 | JSDoc on Stimulus controllers | PASS/FAIL/N/A | details |

### Verdict: PASS / NEEDS FIXES

### Issues to fix (if any):
1. [specific issue with file path and line]
2. [specific issue with file path and line]
```

---

## Common mistakes

These are the most frequent issues found in reviews, ranked by likelihood:

1. **Missing `Closes #N`** in PR body
2. **Names don't match shadcn** — especially sub-parts getting creative names
3. **Dropped Tailwind classes** — shadcn has a class, Kiso theme doesn't
4. **Wrong HTML element** — using `<div>` where shadcn uses `<label>` or `<p>`
5. **Missing navigation.yml entry** — docs page exists but isn't linked
6. **Missing text-foreground** on component root
7. **Arbitrary Tailwind values** sneaking in
8. **Description text using text-muted-foreground** inside colored components (should inherit parent color)
9. **Using `block_given?` in ERB partials** — always true due to Rails
   internals. Must use `capture { yield }.presence` instead for
   default-with-override patterns. Flag any `block_given?` in ERB as a FAIL.
10. **Hardcoded Tailwind classes in Stimulus controllers** — JS should never
    contain class strings. Use `<template>` elements in ERB and clone in JS.
11. **Inline SVG in JS** — never use `innerHTML` with SVG. Render icons
    server-side with `kiso_component_icon()` and toggle `hidden` in JS.
12. **Reimplemented positioning/highlighting/focusable queries** — use shared
    utilities from `kiso-ui/utils/positioning`, `kiso-ui/utils/highlight`, and
    `FOCUSABLE_SELECTOR` from `kiso-ui/utils/focusable` instead of writing inline.
13. **Relative imports for shared utils** — imports like `./utils/highlight`
    or `../utils/positioning` break importmaps (Propshaft fingerprints
    filenames). Must use bare specifiers: `"kiso-ui/utils/highlight"`. Flag
    any `from "./utils/` or `from "../utils/` in JS as a FAIL.
14. **Anonymous event listeners** — always bind named handlers and clean up
    in `disconnect()`. Anonymous arrow functions leak.
15. **Disabled attribute as presence** — use `dataset.disabled === "true"`,
    not `hasAttribute("data-disabled")`.
16. **Duplicated theme class strings** — check `Kiso::Themes::Shared` for
    existing constants (`SVG_BASE`, `ITEM_SEPARATOR`, `MENU_LABEL`,
    `MENU_SHORTCUT`, `CHECKABLE_ITEM`) before inlining identical class strings.
17. **Raw `data-kiso--*` attributes in HTML** — must use Rails `tag.*` helpers
    with `data:` hash (`data: { kiso__combobox_target: "input" }`). Never
    write raw `data-kiso--` attributes in ERB. Search for `data-kiso--` in
    ERB files to catch violations.
