---
name: contributing
description: Guide for contributing to Kiso. Provides component structure patterns, class_variants theming, Lookbook preview conventions, and the component creation workflow. Use when creating new components, modifying existing components, writing tests, or reviewing PRs in this codebase.
---

# Kiso Development

Guidelines for contributing to the Kiso component library.

## Project Structure

```
lib/kiso/
├── themes/              # ClassVariants theme modules (badge.rb, button.rb)
├── engine.rb            # Rails engine config
└── version.rb
app/
├── views/kiso/components/  # ERB partials (_badge.html.erb)
├── assets/
│   ├── stylesheets/kiso/   # Component CSS (transitions/pseudo-states only)
│   └── tailwind/kiso/      # Engine CSS bridge (engine.css)
├── helpers/kiso/           # component_tag, kiso() helpers
└── javascript/controllers/kiso/  # Stimulus controllers (namespaced)
test/
├── components/previews/kiso/  # Lookbook previews + templates
└── dummy/                     # Development Rails app
skills/kiso/                   # AI skill (update when adding components)
docs/                          # COMPONENT_STRATEGY.md
```

## Component Creation Workflow

Copy this checklist when creating a new component:

```
Component: [name]
Progress:
- [ ] 1. Create theme module in lib/kiso/themes/
- [ ] 2. Require theme in lib/kiso.rb
- [ ] 3. Create ERB partial in app/views/kiso/components/
- [ ] 4. Create Lookbook preview + templates in test/components/previews/kiso/
- [ ] 5. Add CSS file if needed (transitions/animations only)
- [ ] 6. Update skills/kiso/references/components.md
- [ ] 7. Rebuild Tailwind: cd test/dummy && bin/rails tailwindcss:build
- [ ] 8. Verify in Lookbook: http://localhost:4000/lookbook
```

## Available Guidance

| File | Topics |
|------|--------|
| **[references/theme-structure.md](references/theme-structure.md)** | ClassVariants patterns, compound variants, semantic colors |
| **[references/component-structure.md](references/component-structure.md)** | ERB partial patterns, strict locals, data attributes |

**Load reference files based on your task. DO NOT load all files at once.**

Also read before building any component:
- `docs/COMPONENT_STRATEGY.md` — full theming architecture, recipes, prior art

## Code Conventions

| Convention | Description |
|------------|-------------|
| Strict locals | Every partial: `<%# locals: (color: :primary, ...) %>` |
| Semantic colors | `bg-primary`, `text-foreground`, `bg-muted` — never raw palette shades |
| No `dark:` prefixes | Semantic tokens flip automatically via CSS variables |
| Foreground pairing | Every color has `-foreground`: `bg-primary text-primary-foreground` |
| Data attributes | `data-component="badge"` for identity — NOT for CSS selectors |
| Two-axis variants | `color:` + `variant:` with compound_variants for colored components |
| `css_classes:` override | Single override point, merged via tailwind_merge |
| Theme in Ruby | Styles live in `lib/kiso/themes/`, not CSS files |
| Lookbook previews | Playground (interactive params) first, then galleries |
| Update the skill | Add component to `skills/kiso/references/components.md` |

## Commands

```bash
cd test/dummy && bin/dev   # Dev server + Tailwind watcher (port 4000)
bundle exec rake test      # Run tests
```
