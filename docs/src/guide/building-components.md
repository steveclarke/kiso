---
title: Building Your Own Components
layout: docs
description: Create custom components using the same patterns Kiso uses internally — themes, partials, sub-parts, and domain wrappers.
---

Kiso gives you 69 components out of the box. But every app has UI that's
specific to its domain — a `MemberBadge` that takes a user and renders their
role, a `PricingCard` with header/footer slots, a `ProjectStatus` indicator
tied to your business logic.

You have two options for building these:

1. **Wrap a Kiso component** — thin partials that bake in your defaults and
   domain logic while delegating rendering to Kiso
2. **Build a standalone component** — full theme module + partial using the
   `appui()` helper, with the same variant system Kiso uses internally

Start with wrapping. It's simpler, gets you running in minutes, and covers
most cases. Reach for standalone components when you need your own variant
axes, sub-parts, or structural control beyond what a wrapper provides.

---

## Wrapping Kiso components

The simplest way to build domain components. Create a partial in your app that
calls `kui()` with your defaults baked in.

### Basic wrapper

```erb
<%% # app/views/shared/_primary_button.html.erb %>
<%% # locals: (css_classes: "", **rest) %>
<%%= kui(:button, variant: :solid, color: :primary, css_classes: css_classes, **rest) do %>
  <%%= yield %>
<%% end %>
```

```erb
<%%= render "shared/primary_button" do %>
  Get started
<%% end %>
```

This is the same pattern as wrapping a shadcn component in a React component
to bake in project defaults.

### Domain wrapper with business logic

A wrapper can accept your domain objects and translate them into component
props:

```erb
<%% # app/views/members/_member_badge.html.erb %>
<%% # locals: (member:, size: :md, css_classes: "", **rest) %>
<%
  color = case member.role
          when "admin"  then :warning
          when "owner"  then :error
          when "member" then :primary
          else :neutral
          end
%>
<%%= kui(:badge, color: color, variant: :soft, size: size, css_classes: css_classes, **rest) do %>
  <%%= member.role.titleize %>
<%% end %>
```

```erb
<%% # Usage — your domain object goes in, styled badge comes out %>
<%%= render "members/member_badge", member: @user %>
```

The caller doesn't think about colors or variants. They pass a member, and
the right badge appears.

### Wrapper with composed sub-parts

You can compose multiple Kiso components inside a wrapper:

```erb
<%% # app/views/projects/_project_card.html.erb %>
<%% # locals: (project:, css_classes: "", **rest) %>
<%%= kui(:card, css_classes: css_classes, **rest) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { project.name } %>
    <%%= kui(:card, :description) { project.tagline } %>
  <%% end %>
  <%%= kui(:card, :content) do %>
    <div class="flex items-center gap-2">
      <%%= kui(:badge, color: project.status_color, variant: :soft, size: :sm) do %>
        <%%= project.status.titleize %>
      <%% end %>
      <span class="text-sm text-muted-foreground">
        Updated <%%= time_ago_in_words(project.updated_at) %> ago
      </span>
    </div>
  <%% end %>
  <%%= kui(:card, :footer) do %>
    <%%= kui(:button, href: project_path(project), variant: :outline, size: :sm) do %>
      View project
    <%% end %>
  <%% end %>
<%% end %>
```

```erb
<%% # Usage %>
<%% @projects.each do |project| %>
  <%%= render "projects/project_card", project: project %>
<%% end %>
```

### Forwarding `css_classes:` and `**rest`

Always accept `css_classes:` and `**rest` in your wrapper and forward them to
the underlying Kiso component. This lets callers customize your wrapper the
same way they'd customize any Kiso component:

```erb
<%% # The caller can still override styles %>
<%%= render "shared/primary_button", css_classes: "w-full" do %>
  Submit
<%% end %>
```

If your wrapper composes multiple components and you want to let callers
target inner elements, forward `ui:` too:

```erb
<%% # app/views/shared/_feature_card.html.erb %>
<%% # locals: (title:, description: nil, icon: nil, ui: {}, css_classes: "", **rest) %>
<%%= kui(:card, variant: :outline, ui: ui, css_classes: css_classes, **rest) do %>
  <%%= kui(:card, :header) do %>
    <%% if icon %>
      <%%= kiso_icon(icon, class: "size-5 text-primary") %>
    <%% end %>
    <%%= kui(:card, :title) { title } %>
    <%% if description %>
      <%%= kui(:card, :description) { description } %>
    <%% end %>
  <%% end %>
  <%%= kui(:card, :content) { yield } if block_given? %>
<%% end %>
```

```erb
<%%= render "shared/feature_card",
    title: "Analytics",
    description: "Track everything.",
    icon: "bar-chart",
    ui: { header: "pb-2", title: "text-xl" } do %>
  <p>More details here...</p>
<%% end %>
```

---

## Standalone components with `appui()`

When you need your own variant system — custom sizes, states, color axes — or
want sub-part composition, build a standalone component using the same system
Kiso uses internally.

### Generate the scaffold

```bash
bin/rails generate kiso:component status_indicator
```

This creates:

```
app/themes/default/status_indicator.rb        # Theme module
app/views/components/_status_indicator.html.erb  # Partial
```

With sub-parts:

```bash
bin/rails generate kiso:component pricing_card --sub-parts header body footer
```

```
app/themes/default/pricing_card.rb
app/themes/default/pricing_card_header.rb
app/themes/default/pricing_card_body.rb
app/themes/default/pricing_card_footer.rb
app/views/components/_pricing_card.html.erb
app/views/components/pricing_card/_header.html.erb
app/views/components/pricing_card/_body.html.erb
app/views/components/pricing_card/_footer.html.erb
```

### Define your theme

The generator creates an empty theme. Fill it in with your variant
definitions:

```ruby
# app/themes/default/status_indicator.rb
AppThemes::StatusIndicator = ClassVariants.build(
  base: "inline-flex items-center gap-2 text-sm font-medium",
  variants: {
    status: {
      active:   "text-success",
      inactive: "text-muted-foreground",
      pending:  "text-warning",
      error:    "text-error"
    },
    size: {
      sm: "text-xs gap-1.5",
      md: "text-sm gap-2",
      lg: "text-base gap-2.5"
    }
  },
  defaults: { status: :active, size: :md }
)
```

This is the same `ClassVariants.build` that every Kiso component uses. Same
API, same `tailwind_merge` deduplication, same override system.

### Build your partial

The generated partial gives you the correct skeleton:

```erb
<%% # app/views/components/_status_indicator.html.erb %>
<%% # locals: (status: :active, size: :md, css_classes: "", **component_options) %>
<%%= content_tag :span,
    class: AppThemes::StatusIndicator.render(status: status, size: size, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "status-indicator"),
    **component_options do %>
  <span class="relative flex size-2">
    <%% if status == :active %>
      <span class="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75"></span>
    <%% end %>
    <span class="relative inline-flex size-2 rounded-full bg-current"></span>
  </span>
  <%%= yield %>
<%% end %>
```

### Use it

```erb
<%%= appui(:status_indicator, status: :active) { "Online" } %>
<%%= appui(:status_indicator, status: :pending, size: :sm) { "Processing" } %>
<%%= appui(:status_indicator, status: :error) { "Connection lost" } %>
```

### Understanding the partial pattern

Every component partial — Kiso's and yours — follows the same structure:

```erb
<%% # 1. Declare accepted locals with defaults %>
<%% # locals: (variant: :default, css_classes: "", **component_options) %>

<%% # 2. Render the root element with computed classes %>
<%%= content_tag :div,
    class: AppThemes::MyComponent.render(variant: variant, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "my-component"),
    **component_options do %>

  <%% # 3. Yield for caller content %>
  <%%= yield %>
<%% end %>
```

Here's what each piece does:

| Piece | Purpose |
|-------|---------|
| `locals:` | Declares props with defaults. Rails raises on unknown props. |
| `css_classes: ""` | Single override point for the root element. Always include this. |
| `**component_options` | Catch-all for HTML attributes (`id:`, `data:`, `aria:`). |
| `AppThemes::MyComponent.render(...)` | Resolves variants to a class string. `class: css_classes` merges caller overrides via `tailwind_merge`. |
| `kiso_prepare_options(component_options, slot: "...")` | Sets `data-slot` for identity and merges `data:` attributes. |
| `**component_options` (on content_tag) | Forwards remaining HTML attributes to the element. |
| `yield` | Renders the caller's block content. |

### Sub-parts

Sub-part partials follow the same pattern, just nested under the component
directory:

```erb
<%% # app/views/components/pricing_card/_header.html.erb %>
<%% # locals: (css_classes: "", **component_options) %>
<%%= content_tag :div,
    class: AppThemes::PricingCardHeader.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "pricing-card-header"),
    **component_options do %>
  <%%= yield %>
<%% end %>
```

```erb
<%% # Usage with sub-parts %>
<%%= appui(:pricing_card) do %>
  <%%= appui(:pricing_card, :header) do %>
    <h3 class="font-semibold">Pro Plan</h3>
    <p class="text-muted-foreground">For growing teams</p>
  <%% end %>
  <%%= appui(:pricing_card, :body) do %>
    <p class="text-4xl font-bold">$49<span class="text-lg text-muted-foreground">/mo</span></p>
  <%% end %>
  <%%= appui(:pricing_card, :footer) do %>
    <%%= kui(:button, variant: :solid, css_classes: "w-full") { "Get started" } %>
  <%% end %>
<%% end %>
```

Notice how `appui()` and `kui()` mix freely. Use Kiso components inside your
app components and vice versa.

### Per-slot overrides with `ui:`

Your standalone components automatically support `ui:` overrides through the
`appui()` helper — the same system Kiso components use. Callers can target
sub-part slots by name:

```erb
<%%= appui(:pricing_card, ui: { header: "bg-muted p-6", footer: "border-t p-4" }) do %>
  <%%= appui(:pricing_card, :header) { "Custom header styling" } %>
  <%%= appui(:pricing_card, :footer) { "Custom footer styling" } %>
<%% end %>
```

---

## Mixing `kui()` and `appui()` — who does what?

| Helper | Resolves from | Theme namespace | Use for |
|--------|--------------|-----------------|---------|
| `kui()` | `app/views/kiso/components/` | `Kiso::Themes::` | Kiso's built-in components |
| `appui()` | `app/views/components/` | `AppThemes::` | Your app's custom components |

Both helpers share the same override system (`css_classes:`, `ui:`,
`**component_options`), the same `kiso_prepare_options` helper, and the same
sub-part composition pattern. The only difference is where they look for
partials and themes.

Use `kui()` for Kiso's components. Use `appui()` for yours. Nest them however
you like — a `kui(:card)` inside an `appui(:pricing_card)`, or an
`appui(:member_badge)` inside a `kui(:table, :cell)`.

---

## Choosing the right HTML element

The generated partials use `<div>` by default. Pick the right semantic
element for your component:

| Component type | Element | Why |
|---------------|---------|-----|
| Card, panel, container | `<div>` | Generic grouping |
| Status, label, badge | `<span>` | Inline content |
| Navigation wrapper | `<nav>` | Navigation landmark |
| List of items | `<ul>` / `<li>` | List semantics |
| Section with heading | `<section>` | Document outline |
| Sidebar | `<aside>` | Complementary content |
| Interactive element | `<button>` | Always use `type: "button"` |

Change the tag in your partial by replacing `:div` in `content_tag :div` with
the appropriate element.

---

## Adding Stimulus behavior

Your app components can use Stimulus controllers just like Kiso's built-in
components. Add controller and action attributes via the `data:` hash:

```erb
<%% # app/views/components/_copy_button.html.erb %>
<%% # locals: (value:, css_classes: "", **component_options) %>
<%%= content_tag :button,
    type: "button",
    class: AppThemes::CopyButton.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "copy-button",
      controller: "clipboard",
      clipboard_value_value: value,
      action: "click->clipboard#copy"),
    **component_options do %>
  <%%= yield %>
<%% end %>
```

The `kiso_prepare_options` helper merges your data attributes with the
caller's `data:` hash, so both work together.

---

## When to wrap vs. when to build standalone

**Wrap a Kiso component** when you're adding domain logic on top of an
existing component's structure and styling. The wrapper translates your
domain (a `User`, a `Project`, a `Subscription`) into Kiso's props:

```erb
<%% # This is a wrapper — it delegates all rendering to kui(:badge) %>
<%%= kui(:badge, color: member.role_color, variant: :soft) do %>
  <%%= member.role.titleize %>
<%% end %>
```

**Build standalone with `appui()`** when you need:

- Your own variant axes (`:status`, `:priority`, `:tier`)
- Custom HTML structure that doesn't map to any existing Kiso component
- Sub-part composition for complex layouts
- A component that other developers on your team will use across many views

**You can always start as a wrapper and promote later.** If a wrapper grows
complex enough to need its own variants, generate a standalone component and
move the logic there. The `appui()` call site looks almost identical to a
wrapper's render call, so the migration is straightforward.

---

## Multiple themes

If your app needs different looks for different contexts (admin vs.
marketing, or multi-tenant branding), use the `--theme` flag:

```bash
bin/rails generate kiso:component pricing_card --theme modern
```

This creates files in `app/themes/modern/` instead of `app/themes/default/`.
Switch themes in your initializer:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.app_theme = :modern  # loads from app/themes/modern/
end
```

All `appui()` calls automatically use the active theme's definitions.
