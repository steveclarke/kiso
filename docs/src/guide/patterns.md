---
title: Common Patterns
layout: docs
description: Rendering lists, conditionals, and other patterns you'd reach for in Vue/React — translated to ERB.
---

## Conditional rendering

Vue uses `v-if`. React uses ternaries or early returns. In ERB, it's just
Ruby:

<div class="grid gap-6 sm:grid-cols-2 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Vue / React</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Badge v-if="user.admin" color="warning"&gt;
  Admin
&lt;/Badge&gt;

{user.admin && &lt;Badge color="warning"&gt;Admin&lt;/Badge&gt;}</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Kiso</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;%% if user.admin? %&gt;
  &lt;%%= kui(:badge, color: :warning) { "Admin" } %&gt;
&lt;%% end %&gt;</code></pre>
  </div>
</div>

## Rendering lists

Vue uses `v-for`. React uses `.map()`. In ERB, use `.each`:

```erb
<%% @users.each do |user| %>
  <%%= kui(:badge, color: user.role_color) { user.name } %>
<%% end %>
```

For components that support it, Kiso also has a `collection:` shorthand:

```erb
<%%= kui(:badge, collection: @tags) %>
```

## Dynamic props

Compute locals from your data just like you would with dynamic props:

```erb
<%%= kui(:alert,
    color: flash_type == "notice" ? :success : :error,
    variant: :soft) do %>
  <%%= kui(:alert, :title) { flash_type.capitalize } %>
  <%%= kui(:alert, :description) { flash_message } %>
<%% end %>
```

## Composing components together

Build complex UI by nesting components. This Card with a list of Badges is the
same pattern as nesting React or Vue components:

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Team Members" } %>
    <%%= kui(:card, :description) { "People with access to this project." } %>
  <%% end %>
  <%%= kui(:card, :content) do %>
    <%%= kui(:table) do %>
      <%%= kui(:table, :header) do %>
        <%%= kui(:table, :row) do %>
          <%%= kui(:table, :head) { "Name" } %>
          <%%= kui(:table, :head) { "Role" } %>
        <%% end %>
      <%% end %>
      <%%= kui(:table, :body) do %>
        <%% @members.each do |member| %>
          <%%= kui(:table, :row) do %>
            <%%= kui(:table, :cell) { member.name } %>
            <%%= kui(:table, :cell) do %>
              <%%= kui(:badge, color: member.role_color, size: :sm) { member.role } %>
            <%% end %>
          <%% end %>
        <%% end %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

## Stimulus for interactivity

Where Vue/React use state and event handlers, Kiso uses
[Stimulus](https://stimulus.hotwired.dev) controllers:

```erb
<%%= kui(:button,
    data: { controller: "clipboard", action: "click->clipboard#copy",
            clipboard_content_value: invite_url }) do %>
  Copy invite link
<%% end %>
```

The component handles the HTML and styling. The Stimulus controller handles
behavior. They're separate concerns — you can swap the component's appearance
without touching the JS, or reuse the controller on a completely different
element.
