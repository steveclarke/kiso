# Deploying Kiso

Two services back the public Kiso presence. They are always deployed together
because the docs site embeds live component previews from Lookbook.

| Service | URL | Kamal config |
|---|---|---|
| Lookbook (component previews) | lookbook.kisoui.com | `config/deploy.yml` |
| Docs site | kisoui.com | `config/deploy.docs.yml` |

## Prerequisites

- [Kamal](https://kamal-deploy.org) — `gem install kamal`
- [1Password CLI](https://developer.1password.com/docs/cli/) — `brew install 1password-cli`
- Docker with `buildx` support
- SSH access to the deploy host as the `deploy` user

## Deploying

```bash
bin/deploy                  # deploy both services (normal workflow)
bin/deploy --only lookbook  # Lookbook only
bin/deploy --only docs      # docs only
bin/deploy --dry-run        # print commands without deploying
```

`bin/deploy` handles the full flow: loads secrets from 1Password, confirms,
builds and pushes Docker images, and starts the containers via Kamal.

## Secrets

Secrets are stored in 1Password under:

```
Employee / Kiso Lookbook
```

| Field | Used for |
|---|---|
| `RAILS_MASTER_KEY` | Lookbook Rails credentials |
| `DEPLOY_HOST` | Server IP injected into Kamal configs via ERB |

`bin/deploy` reads `DEPLOY_HOST` via `op read` and exports it before invoking
Kamal, so the ERB in `config/deploy.yml` and `config/deploy.docs.yml` resolves
correctly.

## First-time setup

If deploying to a fresh server, run Kamal setup before the first deploy:

```bash
kamal setup                              # Lookbook
kamal setup -c config/deploy.docs.yml   # docs
```

This provisions the server: installs Docker, creates the `kamal` network, and
starts `kamal-proxy`.

## Docker images

| Service | Image | Built from |
|---|---|---|
| Lookbook | `steveclarke/kiso-lookbook` | repo root `Dockerfile` |
| Docs | `steveclarke/kiso-docs` | `docs/Dockerfile` |

Images are built locally for `linux/amd64` and pushed to the local registry
on the deploy host (`localhost:5555`) via an SSH tunnel.

## Releasing the gem

See `bin/release` — tags a version, commits, and prints the push command to
trigger the RubyGems publish via GitHub Actions.

```bash
bin/release          # interactive
bin/release 0.2.0    # non-interactive
bin/release --help   # all options
```
