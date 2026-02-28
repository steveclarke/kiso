# Kiso: A Rails Component Library

**Kiso** (Japanese: foundation) is a full-featured UI component library for
Rails, distributed as a gem. It follows the design language and component
catalog of shadcn/ui, adapted for the Rails + Hotwire stack.

## Vision

One gem, installed in any Rails 8 project, that gives you a complete set of
accessible, themeable UI components. No React, no build step beyond Tailwind.
ERB partials with strict locals, CSS powered by data-attribute selectors, and
Stimulus controllers only where native HTML falls short.

The goal is **shadcn-level polish and coverage** with **Rails-native
simplicity**. Every component works with Turbo out of the box.

## Design Principles

1. **Native first.** Use `<dialog>`, `[popover]`, `<details>`, `<progress>`
   before reaching for JavaScript.
2. **Composition over configuration.** Card = Header + Title + Content + Footer.
   Small pieces, flexibly combined.
3. **ERB is enough.** Partials with strict locals, `yield` for slots,
   `content_tag` for attribute merging.
4. **Tailwind classes in ERB.** CSS files only hold transitions and
   pseudo-states.
5. **Theme via semantic tokens.** Semantic palettes flip automatically in dark
   mode — components never use `dark:`.
6. **Turbo-compatible by default.** Components work inside Turbo Frames and
   respond to Turbo Streams.
7. **Stimulus as enhancement.** Controllers add keyboard nav, focus management,
   and animation. Remove the controller and the component still renders.

## References

- [PLAN.md](PLAN.md) — current status, roadmap, what to build next
- [project/component-strategy.md](project/component-strategy.md) — architecture
  and theming patterns
- [project/design-system.md](project/design-system.md) — compound variant
  formulas, spatial system, token table
