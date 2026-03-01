# Fizzy Flash / Toast Notification — Deep Dive Analysis

A detailed breakdown of how Fizzy implements its toast-style flash notification system: where every file lives, how the pieces connect, and the clever CSS-driven auto-dismiss mechanism that requires almost no JavaScript.

---

## Overview

Fizzy's flash system is a fixed-position pill-shaped toast that appears at the top-center of the screen, stays visible for ~3 seconds, then fades out and removes itself from the DOM. The entire lifecycle — appear, linger, fade, remove — is driven by a single CSS animation. JavaScript is limited to one trivial method: `element.remove()`.

---

## File Map

| File | Role |
|---|---|
| `app/views/layouts/shared/_flash.html.erb` | The partial that renders the toast |
| `app/views/layouts/application.html.erb` | Includes the partial in every page |
| `app/views/layouts/public.html.erb` | Also includes the partial (login/signup pages) |
| `app/assets/stylesheets/flash.css` | Toast layout and visual styles |
| `app/assets/stylesheets/animation.css` | `@keyframes appear-then-fade` definition |
| `app/assets/stylesheets/_global.css` | `--z-flash: 30` z-index token |
| `app/javascript/controllers/element_removal_controller.js` | Removes element from DOM on `animationend` |

---

## 1. The Partial

**`app/views/layouts/shared/_flash.html.erb`**

```erb
<%= turbo_frame_tag :flash do %>
  <% if notice = flash[:notice] || flash[:alert] %>
    <div class="flash" data-controller="element-removal" data-action="animationend->element-removal#remove">
      <div class="flash__inner shadow">
        <%= notice %>
      </div>
    </div>
  <% end %>
<% end %>
```

Three things happening here:

**1. `turbo_frame_tag :flash`**
Wraps everything in `<turbo-frame id="flash">`. This is critical for Turbo Drive navigation — when a redirect response includes a flash message, Turbo can update just this frame without a full page morph. It also means the flash can be updated independently via any Turbo response that targets the `flash` frame.

**2. `flash[:notice] || flash[:alert]`**
Both `:notice` and `:alert` render identically — same markup, same styling. There's no visual distinction between a success notice and an error alert (no green/red). If you want different colors you'd need to add it yourself.

**3. `data-controller="element-removal"` + `data-action="animationend->element-removal#remove"`**
This is the entire dismiss mechanism. When the CSS animation completes, the browser fires an `animationend` DOM event on `.flash`. Stimulus catches it and calls `remove()`, pulling the element out of the DOM. No timers, no `setTimeout`, no polling.

---

## 2. Where It's Rendered

**`app/views/layouts/application.html.erb`** (authenticated app):

```erb
<div id="global-container" ...>
  <header ...>...</header>

  <%= render "layouts/shared/flash" %>   ← line 16

  <main id="main">
    <%= yield %>
  </main>
</div>
```

The flash renders **between the header and the main content area** in the DOM. However, because it uses `position: fixed`, it floats above everything visually and isn't affected by its DOM position.

**`app/views/layouts/public.html.erb`** (login, signup, magic link pages):
Same pattern — `render "layouts/shared/flash"` is present, so toasts work on unauthenticated pages too (e.g. "Invalid magic link", "Try again later" rate limit messages).

---

## 3. The CSS

**`app/assets/stylesheets/flash.css`**

```css
@layer components {
  .flash {
    display: flex;
    inset-block-start: calc(var(--block-space) + var(--custom-safe-inset-top));
    inset-inline-start: 50%;
    justify-content: center;
    position: fixed;
    transform: translate(-50%);
    z-index: var(--z-flash);
  }

  .flash__inner {
    animation: appear-then-fade 3s 300ms both;
    background-color: var(--flash-background, var(--color-ink));
    border-radius: 4em;
    color: var(--flash-color, var(--color-ink-inverted));
    display: inline-flex;
    font-size: var(--font-size-medium);
    margin: 0 auto;
    padding: 0.7em 1.4em;
  }
}
```

**Breaking down `.flash` (the outer wrapper):**

- `position: fixed` — floats above the page, doesn't push layout
- `inset-block-start: calc(var(--block-space) + var(--custom-safe-inset-top))` — positions it near the top. `--custom-safe-inset-top` accounts for mobile notch/dynamic island safe areas. On a standard desktop browser this is effectively just `--block-space` from the top.
- `inset-inline-start: 50%` + `transform: translate(-50%)` — the classic horizontal centering trick for fixed elements. `inset-inline-start` is the logical property equivalent of `left` (works in both LTR and RTL layouts).
- `z-index: var(--z-flash)` — uses a design token, defined as `30` in `_global.css`

**The full z-index stack for context:**
```css
--z-events-day-header: 3;
--z-popup: 10;
--z-nav: 20;
--z-flash: 30;    ← flash sits above nav
--z-tooltip: 40;
--z-bar: 50;
--z-tray: 51;
```

Flash is above navigation and popups but below tooltips, the action bar, and trays. This makes sense — a toast should overlay most content but not block tooltips triggered by interacting with the bar.

**Breaking down `.flash__inner` (the pill):**

- `animation: appear-then-fade 3s 300ms both` — the entire lifecycle in one declaration:
  - `appear-then-fade` — the keyframe name
  - `3s` — total duration
  - `300ms` — delay before starting (slight pause after page load)
  - `both` — `fill-mode: both`, meaning the element holds the animation's start state before it begins AND holds the end state (opacity: 0) after it finishes. This prevents a flash (pun intended) of the fully-visible element before the 300ms delay.
- `background-color: var(--flash-background, var(--color-ink))` — uses `--color-ink` (dark/black) as the default, but allows override via `--flash-background`. This is a CSS custom property fallback chain — you could scope a different background to a parent element if you wanted context-specific toast colors.
- `color: var(--flash-color, var(--color-ink-inverted))` — same pattern: defaults to inverted ink (white on dark), overridable.
- `border-radius: 4em` — very large relative radius produces the pill shape regardless of content length.
- `padding: 0.7em 1.4em` — comfortable horizontal padding, tighter vertical.

---

## 4. The Animation

**`app/assets/stylesheets/animation.css`**

```css
@keyframes appear-then-fade {
  0%,100% { opacity: 0; }
  5%,60%  { opacity: 1; }
}
```

This is elegantly simple. Over the 3-second total duration:

| Time | Opacity | What's happening |
|---|---|---|
| 0ms (0%) | 0 | Invisible |
| 150ms (5%) | 1 | Fully visible — snaps in |
| 1800ms (60%) | 1 | Still fully visible |
| 3000ms (100%) | 0 | Fully faded out |

The toast snaps in quickly (0% → 5% of 3s = 150ms), stays fully visible for 1.65 seconds (5% to 60%), then fades out over the remaining 1.2 seconds (60% to 100%).

Combined with the `300ms` delay, the real-world timeline is:

```
0ms         300ms       450ms                  2100ms      3300ms
|           |           |                      |           |
[delay]     [snap in]   [hold visible]         [fade out]  [animationend fires]
```

After `animationend` fires, the `element-removal` Stimulus controller removes the element from the DOM (even though it's already invisible at opacity 0, this frees memory and keeps the DOM clean).

---

## 5. The Stimulus Controller

**`app/javascript/controllers/element_removal_controller.js`**

```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  remove() {
    this.element.remove()
  }
}
```

That's the entire controller. One method, one line. It's a general-purpose "remove this element" controller wired up via `data-action="animationend->element-removal#remove"`.

The Stimulus action descriptor `animationend->element-removal#remove` means:
- Listen for the native `animationend` DOM event
- On `.flash` (the element with `data-controller`)
- Call the `remove()` method on the `element-removal` controller

The controller is general-purpose — it's not flash-specific. It's presumably used in other places in the app wherever an element needs to remove itself in response to some event.

---

## 6. How Flash Is Triggered (Rails Side)

Standard Rails `redirect_to` with `notice:` or `alert:` keyword:

```ruby
# Notice examples (controllers throughout the app)
redirect_to @card.board, notice: "Card deleted"
redirect_to edit_board_path(@board), notice: "Saved"
redirect_to account_settings_path, notice: "Account updated"
redirect_to account_settings_path, notice: "Export started. You'll receive an email when it's ready."

# Alert examples
redirect_to new_session_path, alert: "Invalid unsubscribe link"
redirect_to new_session_path, alert: "Something went wrong"
redirect_to new_signup_path, alert: "Try again later."
```

Rails stores these in the session between the redirect response and the next request. On the next page render, the layout partial reads `flash[:notice] || flash[:alert]` and renders the toast if either is set.

---

## 7. How Turbo Interacts With It

Because the partial is wrapped in `<turbo-frame id="flash">`, Turbo handles updates cleanly in two scenarios:

**Scenario A — Full page navigation (Turbo Drive):**
Turbo intercepts the redirect, fetches the next page, and morphs the DOM. The `flash` turbo-frame gets replaced with whatever the new page's flash frame contains. If there's a new notice, the toast appears. If not, the frame is empty and nothing shows.

**Scenario B — Turbo Stream response:**
A controller action can explicitly update the flash frame via a Turbo Stream:
```ruby
render turbo_stream: turbo_stream.replace(:flash, partial: "layouts/shared/flash")
```
This replaces just the flash frame without touching the rest of the page — useful for AJAX actions that need to show a confirmation without navigating.

---

## 8. Key Design Decisions

**No JavaScript timer.** Most toast implementations use `setTimeout` to schedule removal. Fizzy uses `animationend` instead. This is more robust — it's tied to the actual animation completing, not a timer that might drift or fire at the wrong time. It also means the toast duration is controlled entirely in CSS.

**CSS custom property overrides.** The `var(--flash-background, var(--color-ink))` fallback pattern means you can change the toast color contextually by setting `--flash-background` on any ancestor element. This is the CSS equivalent of a prop — no additional markup or modifier classes needed.

**`fill-mode: both`.** The `both` keyword in the animation shorthand is easy to miss but critical. Without it, the element would be fully visible during the 300ms delay before the animation starts (since opacity: 0 at 0% hasn't taken effect yet). `fill-mode: backwards` would handle the pre-animation state; `fill-mode: forwards` holds the end state. `both` does both.

**One partial, two layouts.** The same `_flash` partial is included in both `application.html.erb` and `public.html.erb`. No duplication, works on every page.

**No separate notice vs alert styling.** Both `:notice` and `:alert` render identically. This keeps the implementation simple and consistent. If you wanted to differentiate them (e.g. red background for alerts), you'd need to pass the flash type through as a CSS class or custom property.

---

## 9. Replicating This Pattern

To implement the same system in your own Rails app:

### The partial
```erb
<%# app/views/layouts/shared/_flash.html.erb %>
<%= turbo_frame_tag :flash do %>
  <% if notice = flash[:notice] || flash[:alert] %>
    <div class="flash" data-controller="element-removal"
         data-action="animationend->element-removal#remove">
      <div class="flash__inner">
        <%= notice %>
      </div>
    </div>
  <% end %>
<% end %>
```

### In your layout
```erb
<%# Between header and main %>
<%= render "layouts/shared/flash" %>
```

### The Stimulus controller
```javascript
// app/javascript/controllers/element_removal_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  remove() {
    this.element.remove()
  }
}
```

### The CSS
```css
.flash {
  position: fixed;
  top: 1rem;                  /* adjust to taste */
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  justify-content: center;
}

.flash__inner {
  animation: appear-then-fade 3s 300ms both;
  background: #1a1a1a;        /* or your design token */
  color: #ffffff;
  border-radius: 4em;
  padding: 0.7em 1.4em;
  font-size: 0.9rem;
}

@keyframes appear-then-fade {
  0%,100% { opacity: 0; }
  5%,60%  { opacity: 1; }
}
```

That's the complete implementation. No third-party libraries, no complex JavaScript, no timers. Roughly 30 lines of CSS, 4 lines of JS, 9 lines of ERB.
