# Components

Rails ERB components powered by Tailwind CSS and class_variants. Each component is a partial rendered via the `kui()` helper. Theme definitions live in `lib/kiso/themes/`.

All colored components use **identical compound variant formulas** — see `project/DESIGN_SYSTEM.md`.

**Each component has its own reference file in `components/`.** Load only the ones you need.

## Layout

| Component | Key locals | Reference |
|---|---|---|
| `card` | `variant` (outline/soft/subtle) | [card.md](components/card.md) |
| `empty` | Media sub-part has `variant` (default/icon) | [empty.md](components/empty.md) |
| `stats_card` | `variant` (outline/soft/subtle) | [stats_card.md](components/stats_card.md) |
| `separator` | `orientation` (horizontal/vertical), `decorative` | [separator.md](components/separator.md) |
| `table` | 7 sub-parts: header, body, footer, row, head, cell, caption | [table.md](components/table.md) |

## Forms

| Component | Key locals | Reference |
|---|---|---|
| `field` | `orientation` (vertical/horizontal/responsive), `invalid`, `disabled` | [field.md](components/field.md) |
| `field_group` | Container for stacking fields with gap-7 spacing | [field.md](components/field.md) |
| `field_set` | Semantic `<fieldset>` for checkbox/radio groups | [field.md](components/field.md) |
| `label` | Styled `<label>` element | [label.md](components/label.md) |
| `input` | `variant` (outline/soft/ghost), `size` (sm/md/lg) | [input.md](components/input.md) |
| `textarea` | `variant` (outline/soft/ghost), `size` (sm/md/lg) | [textarea.md](components/textarea.md) |
| `input_group` | Wraps input + addons with shared ring | [input_group.md](components/input_group.md) |
| `checkbox` | `color` (7 colors), `checked` | [checkbox.md](components/checkbox.md) |
| `radio_group` | `color` (7 colors). Sub-part: item | [radio_group.md](components/radio_group.md) |
| `switch` | `color` (7 colors), `size` (sm/md), `checked` | [switch.md](components/switch.md) |

## Navigation

| Component | Key locals | Reference |
|---|---|---|
| `breadcrumb` | 7 sub-parts: list, item, link, page, separator, ellipsis | [breadcrumb.md](components/breadcrumb.md) |

## Element

| Component | Key locals | Reference |
|---|---|---|
| `badge` | `color`, `variant` (solid/outline/soft/subtle), `size` (xs-xl) | [badge.md](components/badge.md) |
| `alert` | `color`, `variant` (solid/outline/soft/subtle) | [alert.md](components/alert.md) |
| `button` | `color`, `variant` (solid/outline/soft/subtle/ghost/link), `size` (xs-xl) | [button.md](components/button.md) |

## Compound Variant Reference

All colored components share these exact formulas (see `project/DESIGN_SYSTEM.md`):

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

`ring ring-inset` is on the variant axis (outline, subtle), not in compound variants.
