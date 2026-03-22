# Devstack — Kiso

## Prerequisites

- Ruby (via mise)
- Node.js (via mise)
- entr (`brew install entr`) — engine CSS change detection
- outport CLI (`brew install steveclarke/tap/outport`)
- process-compose (`brew install f1bonacc1/tap/process-compose`)

No Docker services — Kiso is a pure Ruby/Node gem.

## Setup (first time)

```bash
bin/setup    # Install Ruby + JS deps, docs site deps
```

## Start

```bash
bin/dev      # TUI — interactive dashboard (for humans)
bin/dev -D   # Headless daemon (for agents)
```

**Services managed by process-compose:**

| Service | Description |
|---------|-------------|
| lookbook | Lookbook Rails server (port `$LOOKBOOK_PORT`) |
| css | Tailwind CSS watcher for Lookbook |
| css-engine | Engine CSS change detector (entr) |
| docs | Bridgetown docs site (port `$DOCS_PORT`) |
| urls | Dev URL display (via outport) |

**Dummy integration app** (disabled by default):

| Service | Description |
|---------|-------------|
| dummy | Dummy Rails server (port `$DUMMY_PORT`) |
| dummy-css | Tailwind CSS watcher for dummy |
| dummy-css-engine | Engine CSS change detector for dummy |

Start the dummy app separately with `bin/dummy`.

## Stop

```bash
bin/dev stop       # Stop main dev stack
bin/dummy stop     # Stop dummy app (if running)
```

## Health Check

```bash
bin/dev status          # Friendly table output
bin/dev status --json   # JSON (for agents/scripting)
```

The `lookbook` process has a readiness probe (`/up` endpoint). It should show
`is_ready: "Ready"` when healthy. Other processes (css, css-engine, docs) run
continuously without probes — check their status shows "Running".

## Logs

```bash
bin/dev logs <service>    # e.g., bin/dev logs lookbook
```

## Restart

```bash
bin/dev restart <service>    # e.g., bin/dev restart lookbook
```

- **Theme files** (lib/kiso/themes/) — hot-reloaded automatically, no restart needed
- **Ruby code** (helpers, engine config) — `bin/dev restart lookbook`
- **JS/Stimulus** — rebuilds automatically via css/js watchers
- **Engine CSS** — detected by css-engine, triggers Tailwind rebuild automatically

## Worktrees

```bash
bin/worktree create <name>       # Create from branch name
bin/worktree create 169          # Create from GitHub issue number
bin/worktree create --pr 42      # Create from GitHub PR
bin/worktree list                # List active worktrees
bin/worktree remove <name>       # Remove a worktree
cd $(bin/worktree go 169)        # Navigate to a worktree
```

Worktrees are stored in `~/src/kiso-worktrees/`. Each gets its own ports via
outport and its own process-compose UDS socket — zero conflicts between
instances.

After creating a worktree, open a new terminal tab:

```bash
cd <worktree-path>
bin/setup
bin/dev
```

## Notes

- No Docker Compose file — this is a gem project with no database services
- process-compose uses login shell (`bash -lc`) for PATH resolution
- Processes using mise-managed tools include `eval "$(mise activate bash)"`
- Lookbook health check uses exec probe with curl (not http_get, which breaks
  with outport's HTTPS redirect)
- process-compose uses UDS (unix domain socket) for client communication —
  no TCP port needed, worktree-safe by design (socket path derived from
  directory basename)
- `bin/dev` and `bin/dummy` use separate UDS sockets and can run simultaneously
- `.env` is auto-loaded by process-compose for outport port variables
- Tailwind CSS watchers use `[always]` flag to stay alive without stdin
  (process-compose doesn't provide stdin to processes)
- The css-engine process uses `entr(1)` to detect engine CSS changes that
  Tailwind's file watcher misses (see project/decisions/005-engine-css-watcher.md)
