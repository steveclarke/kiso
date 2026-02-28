# Kiso Docs

The Kiso documentation site — a [Bridgetown](https://www.bridgetownrb.com) static site published at [kisoui.com](https://kisoui.com).

## Development

The docs site runs as part of the main `bin/dev` stack (port 4000). From the repo root:

```bash
bin/dev          # starts Lookbook (:4001) + docs (:4000)
bin/dev restart docs  # restart just the docs server
```

To work on the docs site in isolation:

```bash
cd docs
bundle install && npm install
bin/bridgetown start
```

## Structure

```
docs/
  src/
    _layouts/      Page layouts
    _partials/     Shared partials (nav, footer)
    components/    Component documentation pages
    index.md       Home page
  Gemfile          Bridgetown + plugins
  package.json     Tailwind CSS
  Dockerfile       Production Docker image (nginx)
  nginx.conf       nginx config (clean URLs, asset caching)
```

## Deployment

The docs site deploys via Kamal as a Docker container (nginx serving the static build) to [kisoui.com](https://kisoui.com). It is always deployed alongside Lookbook because it embeds live component previews from [lookbook.kisoui.com](https://lookbook.kisoui.com).

```bash
bin/deploy               # deploy both docs + Lookbook
bin/deploy --only docs   # deploy docs only
```

See [project/deploying.md](../project/deploying.md) for the full ops runbook.

## Building

```bash
cd docs
bundle exec rake deploy   # production build → output/
bin/bridgetown build      # development build
```
