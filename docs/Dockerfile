# syntax=docker/dockerfile:1

# Kiso Docs — static Bridgetown site served by nginx

# --- Build stage ---
FROM ruby:3.4.8-slim AS builder

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      git \
      nodejs \
      npm \
      libyaml-dev \
      pkg-config && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Ruby dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install Node dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy site source
COPY . .

# Build static site
ENV BRIDGETOWN_ENV=production
RUN bundle exec rake deploy

# --- Serve stage ---
FROM nginx:alpine

COPY --from=builder /app/output /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
