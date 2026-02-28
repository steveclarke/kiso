# Plan: Wire up Stimulus controllers in Kiso engine (#55)

## Context

Toggle and ToggleGroup are Kiso's first Stimulus-powered components. The
controllers exist at `app/javascript/controllers/kiso/` and the ERB partials
already set `data-controller`/`data-action` attributes, but nothing loads
the JS. The Lookbook preview layout has no `<script>` tag — controllers are
inert. This issue sets up the JS infrastructure so every future interactive
component just drops a controller file and it works.

**Dual delivery, single source:**

- Controllers live in one place: `app/javascript/controllers/kiso/`
- The Ruby gem ships them via `app/**/*` in the gemspec (already included)
- The npm package (`kiso-ui`) points directly at those same files — no
  copy, no build step, no `dist/` directory
- Importmap apps get zero-config auto-registration via the engine
- Bundler apps install `kiso-ui` from npm and call one function

---

## Step 1: Add importmap-rails + stimulus-rails to Gemfile (dev only)

**File:** `Gemfile`

Add to the root Gemfile (needed for the Lookbook dev app):

```ruby
gem "importmap-rails"
gem "stimulus-rails"
```

These are NOT gemspec dependencies — they're dev dependencies for running
Lookbook. Host apps are expected to already have them (Rails 8 default stack).

Run `bundle install`.

---

## Step 2: Engine importmap initializer

**File:** `lib/kiso/engine.rb`

Add two initializers to the engine:

```ruby
# Auto-register Kiso's importmap pins (importmap-rails host apps only)
initializer "kiso.importmap", before: "importmap" do |app|
  if app.config.respond_to?(:importmap)
    app.config.importmap.paths << root.join("config/importmap.rb")
    app.config.importmap.cache_sweepers << root.join("app/javascript")
  end
end

# Make JS files available to the asset pipeline (Propshaft/Sprockets)
initializer "kiso.assets" do |app|
  if app.config.respond_to?(:assets)
    app.config.assets.paths << root.join("app/javascript")
  end
end
```

The `respond_to?(:importmap)` guard means this is silently skipped for
bundler apps — no errors, no side effects.

---

## Step 3: Create engine importmap config

**New file:** `config/importmap.rb`

```ruby
pin_all_from Kiso::Engine.root.join("app/javascript/controllers"),
             under: "controllers"
```

This pins `app/javascript/controllers/kiso/toggle_controller.js` as
`controllers/kiso/toggle_controller` in the importmap. The host app's
`eagerLoadControllersFrom("controllers", application)` auto-discovers it
and registers as `kiso--toggle`. Same for `kiso--toggle-group`.

---

## Step 4: Set up Stimulus in the Lookbook app

The Lookbook app shares the root Gemfile, so it gets importmap-rails and
stimulus-rails from Step 1.

### 4a: Lookbook importmap config

**New file:** `lookbook/config/importmap.rb`

```ruby
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
```

### 4b: Lookbook JS entry point

**New file:** `lookbook/app/javascript/application.js`

```js
import "@hotwired/stimulus"
import "controllers"
```

### 4c: Lookbook controllers bootstrap

**New file:** `lookbook/app/javascript/controllers/index.js`

```js
import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)
```

**New file:** `lookbook/app/javascript/controllers/application.js`

```js
import { Application } from "@hotwired/stimulus"
const application = Application.start()
application.debug = false
window.Stimulus = application
export { application }
```

### 4d: Update preview layout

**File:** `lookbook/app/views/layouts/preview.html.erb`

Add before `</head>`:

```erb
<%= javascript_importmap_tags %>
```

### 4e: Lookbook application config

**File:** `lookbook/config/application.rb`

May need to ensure importmap-rails is loaded. The engine's initializer
(Step 2) will auto-register Kiso's controller pins into the Lookbook app's
importmap.

---

## Step 5: Create npm package for bundler apps

No build step. No `dist/` directory. The `package.json` points directly
at the source files in `app/javascript/controllers/kiso/`. When you run
`npm publish`, npm reads the `files` array and packs those JS files from
their current location into the tarball. One copy of the controllers
serves both the gem and the npm package.

**New file:** `package.json` (in kiso root)

```json
{
  "name": "kiso-ui",
  "version": "0.1.0",
  "description": "Stimulus controllers for Kiso UI components",
  "type": "module",
  "main": "app/javascript/controllers/kiso/index.js",
  "types": "app/javascript/controllers/kiso/index.d.ts",
  "exports": {
    ".": "./app/javascript/controllers/kiso/index.js",
    "./controllers/*": "./app/javascript/controllers/kiso/*"
  },
  "files": [
    "app/javascript/controllers/kiso",
    "README.md",
    "LICENSE"
  ],
  "keywords": ["stimulus", "rails", "ui", "components"],
  "author": "Steve Clarke",
  "license": "MIT",
  "peerDependencies": {
    "@hotwired/stimulus": ">=3.0.0"
  },
  "devDependencies": {
    "np": "^10.2.0"
  },
  "scripts": {
    "release": "np"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/steveclarke/kiso.git"
  }
}
```

### 5a: Controller index with `registerKisoControllers()` helper

**New file:** `app/javascript/controllers/kiso/index.js`

Default export is `KisoUi` with a `.start()` method. Individual controllers
are also available as named exports for cherry-picking or extending:

```js
import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"

const KisoUi = {
  start(application) {
    application.register("kiso--toggle", KisoToggleController)
    application.register("kiso--toggle-group", KisoToggleGroupController)
  }
}

export default KisoUi
export { KisoToggleController, KisoToggleGroupController }
```

Bundler users get the cleanest possible DX:

```js
// app/javascript/controllers/index.js
import KisoUi from "kiso-ui"
KisoUi.start(application)
```

As Kiso adds controllers (Dialog, Popover, Select...), the user's code
never changes. Individual exports are still available for users who want
to cherry-pick or extend a controller.

### 5b: TypeScript declarations

**New file:** `app/javascript/controllers/kiso/index.d.ts`

```ts
import { type Application, Controller } from "@hotwired/stimulus"

declare const KisoUi: {
  start(application: Application): void
}

export default KisoUi
export const KisoToggleController: typeof Controller
export const KisoToggleGroupController: typeof Controller
```

Tiny file, prevents `any` warnings for TS users. Updated when new
controllers are added (same time as updating `index.js`).

---

## Step 6: Update bin/release for npm publishing

**File:** `bin/release`

The release script supports three modes via `--npm [VERSION]`:

```bash
bin/release 0.2.0                # gem only (backward compatible)
bin/release --npm 0.1.1          # npm only
bin/release 0.2.0 --npm 0.1.1   # both gem + npm
```

Gem and npm version independently. npm releases use `npm-v*` tags.
A GitHub Action (`.github/workflows/push_npm.yml`) publishes to npm
when an `npm-v*` tag is pushed.

---

## Step 7: Document for host app developers

**File:** docs site or README

### Importmap apps (Rails default — zero config)

```ruby
# Nothing to do! Controllers auto-register when you add the gem.
gem "kiso"
```

### Bundler apps (esbuild, Vite, Bun)

```bash
npm install kiso-ui
```

```js
// app/javascript/controllers/index.js
import { registerKisoControllers } from "kiso-ui"
registerKisoControllers(application)
```

---

## How adding a new controller works (future)

When building a new interactive component (e.g., Dialog):

1. Create `app/javascript/controllers/kiso/dialog_controller.js`
2. Add import, register call, and export to `index.js`
3. Add type declaration to `index.d.ts`
4. Set `data-controller="kiso--dialog"` in the ERB partial

That's it. Importmap apps auto-discover via `pin_all_from`. Bundler apps
get it on the next `npm update kiso-ui` — their code doesn't change
because `registerKisoControllers()` handles the growing list internally.

---

## Files changed/created summary

| Action | File |
|--------|------|
| Edit | `Gemfile` — add importmap-rails, stimulus-rails |
| Edit | `lib/kiso/engine.rb` — add importmap + assets initializers |
| Create | `config/importmap.rb` — engine importmap pins |
| Create | `lookbook/config/importmap.rb` — Lookbook importmap |
| Create | `lookbook/app/javascript/application.js` — JS entry point |
| Create | `lookbook/app/javascript/controllers/index.js` — Stimulus bootstrap |
| Create | `lookbook/app/javascript/controllers/application.js` — Stimulus app |
| Edit | `lookbook/app/views/layouts/preview.html.erb` — add importmap tags |
| Edit | `lookbook/config/application.rb` — if needed for importmap loading |
| Create | `package.json` — npm package definition (points at source files) |
| Create | `app/javascript/controllers/kiso/index.js` — exports + registerKisoControllers() |
| Create | `app/javascript/controllers/kiso/index.d.ts` — TypeScript declarations |
| Edit | `bin/release` — add version sync + npm publish step |

---

## Verification

1. `bundle install` succeeds
2. `bin/dev` starts Lookbook without errors
3. Visit Toggle preview in Lookbook — clicking toggles the pressed state
4. Visit ToggleGroup preview — single/multiple selection works, arrow keys navigate
5. `bundle exec rake test` passes
6. `bundle exec standardrb` passes
7. `npm pack --dry-run` shows the correct files (controllers + index.js + index.d.ts)

---

## Research references

- **maquina-components** — engine importmap pattern (`config.importmap.paths`)
- **importmap-rails** — canonical engine integration docs
- **turbo-rails / stimulus-rails** — vendored JS + install generators
- **railsui-stimulus** — npm package with build step (CJS/ESM/importmap)
- **shadcn-rails** — copy-into-app generator (importmap only)
- **Rails UI** — dual-mode generator (importmap + jsbundling)
- **stimulus-loading.js** — auto-discovery: `controllers/kiso/toggle_controller`
  → Stimulus identifier `kiso--toggle` (strips prefix, `/` → `--`, `_` → `-`)
