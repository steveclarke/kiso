# Collapsible

Interactive panel that expands/collapses content. Managed by a Stimulus
controller with CSS animations for smooth expand/collapse transitions.

**Locals:** `open:` (boolean), `css_classes:`, `**component_options`

**Sub-parts:** `:trigger` (button), `:content` (expandable area)

**Defaults:** `open: false`

```erb
<%# Basic usage with trigger sub-part %>
<%= kui(:collapsible) do %>
  <%= kui(:collapsible, :trigger) do %>
    Toggle content
  <% end %>
  <%= kui(:collapsible, :content) do %>
    <p>Expandable content here.</p>
  <% end %>
<% end %>

<%# Initially open %>
<%= kui(:collapsible, open: true) do %>
  <%= kui(:collapsible, :trigger) do %>
    Hide details
  <% end %>
  <%= kui(:collapsible, :content) do %>
    <p>Visible on page load.</p>
  <% end %>
<% end %>

<%# With styled button trigger (no trigger sub-part) %>
<%= kui(:collapsible) do %>
  <%= kui(:button, variant: :ghost,
        data: { action: "kiso--collapsible#toggle",
                kiso__collapsible_target: "trigger" }) do %>
    Toggle
    <%= kiso_icon("chevrons-up-down") %>
  <% end %>
  <%= kui(:collapsible, :content) do %>
    <p>Content here.</p>
  <% end %>
<% end %>

<%# Nested collapsibles (file tree pattern) %>
<%= kui(:collapsible) do %>
  <%= kui(:button, variant: :ghost, size: :sm,
        css_classes: "group w-full justify-start",
        data: { action: "kiso--collapsible#toggle",
                kiso__collapsible_target: "trigger" }) do %>
    <%= kiso_icon("chevron-right",
          class: "transition-transform group-data-[state=open]:rotate-90") %>
    <%= kiso_icon("folder") %>
    src
  <% end %>
  <%= kui(:collapsible, :content, css_classes: "ml-5") do %>
    <%# Nested collapsible... %>
  <% end %>
<% end %>
```

**Stimulus:** `kiso--collapsible` controller on the root `<div>`. Values: `open` (Boolean). Targets: `content`, `trigger`. Actions: `toggle`, `open`, `close`. Events: `kiso--collapsible:open`, `kiso--collapsible:close`.

**CSS:** `data-state="open"` / `data-state="closed"` on root, trigger, and content elements. Animations in `collapsible.css`. Respects `prefers-reduced-motion`.

**Theme module:** `Kiso::Themes::Collapsible` + `CollapsibleTrigger` + `CollapsibleContent` (`lib/kiso/themes/collapsible.rb`). Intentionally unstyled -- layout via `css_classes:`.
