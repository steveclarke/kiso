# Finalize Checklist

Run `/finalize` or ask "are we ready to merge?" to trigger this. These are
Kiso-specific checks on top of the universal finalize skill.

## Per component

- [ ] Theme module in `lib/kiso/themes/` + required in `lib/kiso.rb`
- [ ] ERB partial with `data-slot`, `css_classes:`, strict locals
- [ ] Default icons use `kiso_component_icon(:name)` — no raw SVGs anywhere
- [ ] Icon names registered in `lib/kiso/configuration.rb`
- [ ] `type: "button"` on all `<button>` elements
- [ ] Self-rendering partials accept `ui: {}` and apply to inner themed elements
- [ ] Stimulus data attributes via `tag.*` helpers with `data:` hash — no raw HTML
- [ ] Lookbook preview with `@logical_path` grouping (Form, Color Mode, Dashboard, etc.)
- [ ] Docs page at `docs/src/components/{name}.md` (no `# Title` — frontmatter handles it)
- [ ] Entry in `docs/src/_data/navigation.yml` (alphabetical)
- [ ] Entry in `skills/kiso/references/components.md`
- [ ] JSDoc on all JS controllers (`@example`, `@property`, `@fires`, `@param`)
- [ ] Theme module has YARD comment (description, `@example`, variants, `shadcn base:`)
- [ ] ERB partials have component comment after `locals:` (non-trivial components)
- [ ] CSS files have header comment explaining why CSS is needed
- [ ] `frozen_string_literal` consistency with existing files
- [ ] All user-visible text and ARIA labels use `t("kiso.component_name.key")` with entries in `config/locales/en.yml`
- [ ] Preset entries in `lib/kiso/presets/rounded.rb` and `sharp.rb` (if component has border-radius)
- [ ] Entry in `test/e2e/dark-mode.spec.js` `COMPONENTS` array (dark mode a11y)

## Per PR

- [ ] `bundle exec standardrb --fix` — clean
- [ ] `npm run lint && npm run fmt:check` — clean
- [ ] `bundle exec rake test` — all pass
- [ ] Visual check in Lookbook and/or dummy app
- [ ] Dark mode verified (if applicable)
- [ ] PR description reflects actual scope
- [ ] `Closes #N` in PR body
- [ ] Parent epic updated with current status
- [ ] Follow-on issues created for deferred work
- [ ] Issues on project board with correct status
- [ ] `MEMORY.md` updated with learnings
- [ ] `/update-docs` audit — design system, skills, and docs site reflect current state
