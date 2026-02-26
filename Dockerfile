# syntax=docker/dockerfile:1
# check=error=true

# Kiso Lookbook Preview Server
# Build context: repo root (lookbook/config/boot.rb references ../../Gemfile)

ARG RUBY_VERSION=3.4.8
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

ENV RAILS_ENV="production" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test"

# --- Build stage ---
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      git \
      libyaml-dev \
      pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install gems (Gemfile.lock is gitignored in gem projects, so bundle lock first)
COPY Gemfile kiso.gemspec ./
COPY lib/kiso/version.rb lib/kiso/version.rb
RUN bundle lock && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy application code (vendor submodules excluded via .dockerignore)
COPY . .

# Precompile assets (tailwindcss:build runs automatically via assets:precompile)
RUN cd lookbook && SECRET_KEY_BASE_DUMMY=1 bin/rails assets:precompile

# --- Final stage ---
FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      curl \
      libyaml-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ARG UID=1000
ARG GID=1000

RUN groupadd --system --gid ${GID} rails && \
    useradd rails --uid ${UID} --gid ${GID} --create-home --shell /bin/bash

# Copy built artifacts
COPY --chown=${GID}:${UID} --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --chown=${GID}:${UID} --from=build /rails /rails

RUN mkdir -p /rails/lookbook/tmp && \
    chown -R ${UID}:${GID} /rails/lookbook/tmp

USER ${UID}:${GID}

ENV RUBY_YJIT_ENABLE="1"

ENTRYPOINT ["/rails/lookbook/bin/docker-entrypoint"]

EXPOSE 3000

CMD ["./lookbook/bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
