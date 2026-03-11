# ADR 005: Engine CSS File Watcher for Development

**Status**: Implemented
**Date**: 2026-03-10
**Issue**: [#204](https://github.com/steveclarke/kiso/issues/204)

---

## The Problem

When editing component CSS files in `app/assets/tailwind/kiso/` (e.g.,
`tooltip.css`, `dialog.css`), the Tailwind watcher running via `bin/dev`
does not detect the change and recompile. A manual `bin/rails
tailwindcss:build` is required to see updates.

The import chain is:

```
lookbook/app/assets/tailwind/application.css          ← Tailwind input file
  → lookbook/app/assets/builds/tailwind/kiso.css      ← auto-generated stub
    → app/assets/tailwind/kiso/engine.css              ← engine entry point
      → app/assets/tailwind/kiso/tooltip.css           ← changes here NOT detected
```

---

## Root Cause: Tailwind CLI Watcher Architecture

The Tailwind CLI v4 watcher (`@tailwindcss/cli`) uses two independent
mechanisms that are not fully wired together:

### 1. Dependency tracking (`fullRebuildPaths`)

During compilation, the `compile()` function calls an `onDependency(path)`
callback for every CSS file in the `@import` chain. These paths are added
to a `fullRebuildPaths` array. When a file in this array changes, the
watcher triggers a full rebuild (re-reads and re-compiles everything).

This correctly registers `engine.css`, `tooltip.css`, `dialog.css`, etc.

### 2. Directory watching (`@parcel/watcher`)

The watcher subscribes to directories using `@parcel/watcher`. But the
directories it watches come exclusively from `@source` directives — via
`scanner.normalizedSources`:

```typescript
// @tailwindcss/cli build/index.ts
function watchDirectories(scanner: Scanner) {
  return [...new Set(scanner.normalizedSources.flatMap((globEntry) => globEntry.base))]
}
```

### The gap

Our `@source` directives cover:
- `app/views/`
- `app/helpers/`
- `lib/kiso/themes/`
- `lib/kiso/presets/`

But `app/assets/tailwind/kiso/` — where the component CSS files live — is
**not** an `@source` directory (it contains CSS, not template/class files).

So the dependency files are registered as rebuild triggers, but the
`@parcel/watcher` never subscribes to their parent directory. Changes are
invisible.

### Why manual builds work

`tailwindcss:build` runs the full compiler, which resolves all `@import`
chains during CSS parsing. The watcher limitation only affects the
file-change detection layer, not the compiler itself.

---

## Scope: Development-Only Issue

This only affects **Kiso engine developers** — not Kiso users.

In a host app using the Kiso gem, the engine CSS files are frozen inside
the installed gem. Users never edit them. They only edit their own
`application.css`, views, and helpers — all of which are in watched
directories.

The problem exists because we're developing the engine itself, editing CSS
files inside `app/assets/tailwind/kiso/` while the Lookbook/dummy watcher
runs from a subdirectory.

---

## Solution: `entr` File Watcher Process

We add a `css-engine` process to both `Procfile.dev` and
`test/dummy/Procfile.dev` that uses [`entr(1)`](https://eradman.com/entrproject/)
to monitor engine CSS files and trigger the existing Tailwind watcher:

```
css-engine: while true; do \
  find app/assets/tailwind/kiso -name "*.css" | \
  entr -d -p touch lookbook/app/assets/tailwind/application.css; \
done
```

### How it works

1. `find` lists all `.css` files in the engine CSS directory
2. `entr -d -p` watches those files, postponing until a change occurs
3. On change, `touch` updates the mtime of the Lookbook input file
4. The Tailwind watcher (Parcel) detects the input file change
5. Since the input file is in `fullRebuildPaths`, a full rebuild triggers
6. The rebuild resolves all `@import` chains and picks up the CSS change

### Flags

- **`-p`** (postpone): Don't run the command on startup — wait for an
  actual file change
- **`-d`** (directory): Exit when a new file is added to a watched
  directory, so the `while true` loop restarts `entr` and picks it up

### Prerequisite

`entr` must be installed: `brew install entr`

---

## Alternatives Considered

### Add `@source` for the CSS directory

Adding `@source "../../../assets/tailwind/kiso"` would make the Tailwind
watcher subscribe to that directory. Functionally this works — Tailwind
would scan CSS files for class names (harmless, no matches) and the
directory would be watched. But it's semantically wrong — `@source` is
for class scanning, not CSS dependency tracking. Future Tailwind versions
could optimize away directories with no class matches.

### File upstream bug with Tailwind

The `onDependency` callback already provides the information needed. The
fix would be to also watch the parent directories of dependency files.
However, this is a niche scenario (developing a Rails engine with
tailwindcss-rails) and unlikely to be prioritized. The `entr` workaround
is simple and self-contained.

### Restructure CSS into a watched directory

Moving component CSS into a directory covered by `@source` would require
mixing CSS files with Ruby/ERB source files, breaking the clean
separation of concerns in the file structure.

---

## Files Changed

| File | Change |
|------|--------|
| `Procfile.dev` | Added `css-engine` process with detailed comments |
| `test/dummy/Procfile.dev` | Added `css-engine` process |
| `.overmind.env` | Added `css-engine` to `OVERMIND_CAN_DIE` |

---

## Related

- [ADR 003: Propshaft Tailwind Stub Filter](005-engine-css-watcher.md) —
  another tailwindcss-rails engine integration issue
- `@tailwindcss/cli` source: `packages/@tailwindcss-cli/src/commands/build/index.ts`
  (watcher implementation)
