# frozen_string_literal: true

module Kiso
  # View helpers for rendering host app components.
  #
  # Mirrors {ComponentHelper#kui} but resolves partials from
  # +app/views/components/+ and themes from the +AppThemes::+ namespace
  # (loaded from +app/themes/<theme_name>/+).
  #
  # == Key difference from +kui()+
  #
  # +appui()+ does *not* merge global config overrides (Layer 2). Host apps
  # own their component source directly, so there is no need for a
  # boot-time override layer. The three layers for +appui()+ are:
  #
  # 1. **Theme default** -- the +ClassVariants+ definition in
  #    +app/themes/<theme_name>/+.
  # 2. **Instance +ui:+** -- per-render slot overrides.
  # 3. **Instance +css_classes:+** -- per-render root-element overrides.
  #
  # == Generating host app components
  #
  # Use the generator to scaffold theme and partial files:
  #
  #   bin/rails generate kiso:component pricing_card --sub-parts header body footer
  #
  # This creates files in +app/themes/default/+ and +app/views/components/+.
  #
  # Included in all views automatically by {Kiso::Engine}.
  #
  # @see ComponentHelper#kui  the equivalent helper for engine-shipped components
  # @see ComponentHelper#kui_tag  the themed +content_tag+ shorthand (aliased as {#appui_tag})
  module AppComponentHelper
    # Renders a host app component partial.
    #
    # Components live in +app/views/components/+. Sub-parts are nested
    # in a directory matching the parent component name (e.g.
    # +components/pricing_card/_header.html.erb+).
    #
    # Behaves identically to {ComponentHelper#kui} except:
    # - Partials resolve from +app/views/components/+ instead of
    #   +app/views/kiso/components/+.
    # - Global config +ui:+ overrides are *not* merged (host apps own the
    #   source and can edit themes directly).
    #
    # @param component [Symbol] the component name (e.g. +:pricing_card+).
    #   Must match a partial at +app/views/components/_<name>.html.erb+.
    # @param part [Symbol, nil] optional sub-part name (e.g. +:header+,
    #   +:footer+). Resolves to
    #   +app/views/components/<component>/_<part>.html.erb+.
    # @param collection [Array, nil] when present, renders the partial once
    #   per item using Rails collection rendering.
    # @param ui [Hash{Symbol => String}, nil] per-slot class overrides keyed
    #   by sub-part name. Pushed onto the context stack for composed
    #   sub-parts, and also passed as a +ui:+ local to self-rendering
    #   partials.
    # @param scope [Hash, nil] domain locals shared from parent to sub-parts
    #   via context stack. Sub-parts receive scope values as kwargs
    #   automatically. Explicit kwargs on sub-part calls override scope
    #   values. One level deep only -- no ancestor resolution.
    # @param kwargs [Hash] locals forwarded to the partial (e.g.
    #   +css_classes:+, +plan:+, +featured:+). Must match the partial's
    #   strict locals declaration.
    # @yield optional block for component content
    # @return [ActiveSupport::SafeBuffer] rendered HTML string
    #
    # @example Render a pricing card
    #   <%= appui(:pricing_card, plan: @plan) { "Content" } %>
    #
    # @example Render a pricing card with composed sub-parts
    #   <%= appui(:pricing_card) do %>
    #     <%= appui(:pricing_card, :header) { "Pro Plan" } %>
    #     <%= appui(:pricing_card, :body) do %>
    #       <p>Everything you need to get started.</p>
    #     <% end %>
    #     <%= appui(:pricing_card, :footer) { "Sign up" } %>
    #   <% end %>
    #
    # @example Render with per-slot overrides
    #   <%= appui(:pricing_card, ui: { header: "p-8 bg-muted" }) do %>
    #     <%= appui(:pricing_card, :header) { "Enterprise" } %>
    #   <% end %>
    #
    # @example Share domain locals with sub-parts via scope
    #   <%= appui(:room_card, scope: { room: room }) do %>
    #     <%= appui(:room_card, :status) %>
    #     <%= appui(:room_card, :meta) %>
    #   <% end %>
    #
    # @example Render a collection
    #   <%= appui(:pricing_card, collection: @plans) %>
    def appui(component, part = nil, collection: nil, ui: nil, scope: nil, **kwargs, &block)
      kiso_render_component(
        component, part,
        path_prefix: "components",
        collection: collection, ui: ui, scope: scope, merge_global_ui: false,
        **kwargs, &block
      )
    end

    # Renders a themed HTML element for host app components.
    #
    # This is an alias for {ComponentHelper#kui_tag}, provided as a naming
    # convenience so host app partials use +appui_tag+ alongside +appui()+
    # for visual consistency.
    #
    # @see ComponentHelper#kui_tag  for full parameter documentation
    #
    # @example In a host app component partial
    #   <%# app/views/components/_pricing_card.html.erb %>
    #   <%= appui_tag :div, theme: AppThemes::Default::PricingCard,
    #       slot: "pricing-card", css_classes: css_classes,
    #       variants: { featured: featured },
    #       **component_options do %>
    #     <%= yield %>
    #   <% end %>
    def appui_tag(...)
      kui_tag(...)
    end
  end
end
