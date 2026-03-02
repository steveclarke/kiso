# ADR-001: `kui(:component, :part)` Sub-component Syntax

**Status:** Accepted
**Date:** 2026-03-02

## Context

Kiso renders components via the `kui()` helper. Components have sub-parts
(e.g., Card has Header, Title, Content, Footer). We needed a syntax for
rendering sub-parts that mirrors the `<Card><CardHeader>` pattern from
React/Vue but feels natural in Ruby/ERB.

## Decision

Use two positional symbols: `kui(:component, :part)`.

```erb
<%= kui(:card) do %>
  <%= kui(:card, :header) do %>
    <%= kui(:card, :title) { "Hello" } %>
  <% end %>
  <%= kui(:card, :content) do %>
    <p>Body text</p>
  <% end %>
<% end %>
```

## Alternatives Considered

### Yielded builder (Nice Partials style)

```erb
<%= kui(:card) do |c| %>
  <%= c.header do %>
    <%= c.title { "Hello" } %>
  <% end %>
<% end %>
```

**Rejected.** Locks sub-parts to being called inside a parent block. Kiso
sub-parts are intentionally standalone — `kui(:card, :header)` works anywhere,
not just inside a `kui(:card)` block. A page header should be usable without
wrapping it in a page component. The builder pattern would require maintaining
two APIs (yielded + standalone) or sacrificing standalone usage.

### Dot-delimited string: `kui("card.header")`

**Rejected.** Compact but creates two syntaxes: `:card` (symbol) for
standalone components, `"card.header"` (string) for sub-parts. Developers
must choose between symbol and string on every call. Looks like CSS selector
notation, which could mislead.

### Slash notation: `kui("card/header")`

**Rejected.** Maps nicely to the partial file path but has the same
two-syntax problem as dot notation. Symbol for one arg, string for two.

### Hash syntax: `kui(card: :header)`

**Rejected.** Pure symbols but awkward when there's no sub-part
(`kui(:card)` vs `kui(card: nil)`). Options passing becomes ambiguous.

### Bracket proxy: `kui[:card][:header]`

**Rejected.** Looks like namespace access but requires method_missing magic,
returns proxy objects, and is harder to debug. Too clever.

## Consequences

- **One syntax, one mental model.** Always symbols, always positional args.
  Optional second arg for sub-parts.
- **Every call is self-contained and greppable.** You can search for
  `kui(:card, :header)` without needing surrounding context to understand it.
- **Sub-parts work standalone.** No coupling to parent blocks. A sub-part
  can be rendered anywhere in any template.
- **Maps to file structure.** `kui(:card, :header)` resolves to
  `app/views/kiso/components/_card/_header.html.erb`.
