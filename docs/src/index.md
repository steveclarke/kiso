---
layout: docs
title: Introduction
---

Kiso (基礎 — Japanese: foundation) is a Rails engine gem providing UI components inspired
by [shadcn/ui](https://ui.shadcn.com) and [Nuxt UI](https://ui.nuxt.com).

ERB partials, Tailwind CSS, progressive Stimulus.

## Why Kiso?

Most Rails UI libraries ask you to adopt a new abstraction — ViewComponent
classes, Phlex objects, or DSL builders. Kiso stays with what Rails gives you:
ERB partials, `yield`, and strict locals. If you can call `render`, you can use
Kiso.

The `kui()` helper renders a partial with variant-aware Tailwind classes computed
by [class_variants](https://github.com/avo-hq/class_variants). Dark mode,
color theming, and class deduplication work automatically.

## Get started

See the [Getting Started](/getting-started) guide to install Kiso and render
your first component.

## Architecture

Kiso has two layers:

1. **Ruby theme modules** — variant definitions using `class_variants` + `tailwind_merge`
2. **ERB partials** — strict locals, computed class strings, composition via `yield`

Components never use `@apply` in CSS. Tailwind classes are computed in Ruby and
rendered in ERB. CSS files are only used for transitions, animations, and
pseudo-states that ERB can't express.

## Design principles

1. **Native HTML first.** Use `<dialog>`, `[popover]`, `<details>` before adding JavaScript.
2. **Build from small parts.** Card = Header + Title + Content + Footer.
3. **ERB is enough.** Use strict locals and `yield` for blocks.
4. **Tailwind classes in ERB.** CSS files only hold transitions and pseudo-states.
5. **Theme with tokens.** Names like `primary` map to real colors. They flip in dark mode.
6. **Works with Turbo.** Use them in Turbo Frames and Streams.
7. **Stimulus only when needed.** Native HTML handles the basics. Stimulus adds the rest.

## Components

Browse the available components in the sidebar, or see the
[Design System](/design-system) page for the visual reference.
