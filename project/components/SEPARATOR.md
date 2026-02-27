# Separator

Visual divider between content sections or inline items.

## Current API

```erb
<%# Horizontal (default) %>
<%= kui(:separator) %>

<%# With spacing %>
<%= kui(:separator, css_classes: "my-4") %>

<%# Vertical %>
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <%= kui(:separator, orientation: :vertical) %>
  <div>Docs</div>
</div>

<%# Semantic (non-decorative) %>
<%= kui(:separator, decorative: false) %>
```

## Locals

| Local | Default | Notes |
|-------|---------|-------|
| `orientation:` | `:horizontal` | `:horizontal` or `:vertical` |
| `decorative:` | `true` | `false` adds `role="separator"` + `aria-orientation` |
| `css_classes:` | `""` | Override via tailwind_merge |
| `**component_options` | `{}` | HTML attributes passthrough |

## Implementation

Matches shadcn's separator div-for-div:
- `bg-border shrink-0` base
- Horizontal: `h-px w-full`
- Vertical: `h-full w-px`

## Future Enhancements

From Nuxt UI (add when needed):
- `label:` — text in the middle (line / label / line)
- `icon:` — icon in the middle
- `type:` — solid, dashed, dotted
- `size:` — border thickness (xs–xl)
- `color:` — colored separator lines

## Dependencies

None. Pure CSS component, no Stimulus.
