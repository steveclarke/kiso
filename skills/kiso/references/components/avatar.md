# Avatar

An image element with a fallback for representing the user. Pure CSS, no JavaScript.

**Locals:** `src:` (String), `alt:` (String), `text:` (String), `size:` (sm/md/lg), `css_classes:`, `**component_options`

**Sub-parts:** `kui(:avatar, :image)`, `kui(:avatar, :fallback)`, `kui(:avatar, :badge)`, `kui(:avatar, :group)`, `kui(:avatar, :group_count)`

**Defaults:** `size: :md`

```erb
<%# Props-based (common case) %>
<%= kui(:avatar, src: "/photo.jpg", alt: "Steve Clarke", text: "SC") %>
<%= kui(:avatar, text: "SC", size: :lg) %>

<%# Composition-based (full control) %>
<%= kui(:avatar) do %>
  <%= kui(:avatar, :image, src: "/photo.jpg", alt: "Steve Clarke") %>
  <%= kui(:avatar, :fallback) { "SC" } %>
  <%= kui(:avatar, :badge, css_classes: "bg-success") %>
<% end %>
```

**Group** for stacked avatars:

```erb
<%= kui(:avatar, :group) do %>
  <%= kui(:avatar, src: "/a.jpg", alt: "Alice", text: "A") %>
  <%= kui(:avatar, src: "/b.jpg", alt: "Bob", text: "B") %>
  <%= kui(:avatar, :group_count) { "+3" } %>
<% end %>
```

**Size variants:** `:sm` (24px), `:md` (32px), `:lg` (40px). Badge scales automatically via `group-data-[size]` selectors.

**Image fallback:** Image is absolute-positioned over fallback. On load error, `onerror` hides the image, revealing the fallback underneath. No `overflow-hidden` on root (allows badge to render outside circle).

**Theme modules:** `Kiso::Themes::Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount` (`lib/kiso/themes/avatar.rb`)
