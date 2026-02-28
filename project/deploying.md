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

## Releasing

`bin/release` handles version bumps, tagging, and pushing. GitHub Actions
publish the gem to RubyGems (`v*` tags) and the npm package to npmjs.com
(`npm-v*` tags). Both use OIDC trusted publishing — no tokens required.

```bash
bin/release 0.2.0                # gem only
bin/release --npm 0.1.2          # npm only (kiso-ui package)
bin/release 0.2.0 --npm 0.1.2   # both gem + npm
bin/release --help               # all options
```

### GitHub Actions setup

| Workflow | Trigger | Publishes to |
|----------|---------|--------------|
| `.github/workflows/push_gem.yml` | `v*` tag | RubyGems |
| `.github/workflows/push_npm.yml` | `npm-v*` tag | npm |

Both workflows use OIDC trusted publishing (`id-token: write` permission).
No secret tokens are stored in the repo.

**npm trusted publisher** must be configured on npmjs.com:
1. Go to npmjs.com → `kiso-ui` package → Settings → Publishing access
2. Add trusted publisher: GitHub Actions
3. Repository owner: `steveclarke`, Repository name: `kiso`, Workflow: `push_npm.yml`

**RubyGems trusted publisher** is configured similarly at rubygems.org.

**Note:** The npm workflow requires `npm install -g npm@latest` because the
Node LTS bundled npm may not support OIDC trusted publishing (requires
npm 11.5.1+).
