# frozen_string_literal: true

module Kiso
  # View helpers for rendering host app components.
  #
  # Mirrors {ComponentHelper#kui} but resolves partials from
  # +app/views/components/+ and themes from +AppThemes::+.
  # No global config layer — host apps own the source directly.
  #
  # Included in all views automatically by {Engine}.
  module AppComponentHelper
    # Renders a host app component partial.
    #
    # Components live in +app/views/components/+. Sub-parts are nested
    # in a directory matching the parent component name.
    #
    # @param component [Symbol] the component name (e.g. +:pricing_card+)
    # @param part [Symbol, nil] optional sub-part name (e.g. +:header+, +:footer+)
    # @param collection [Array, nil] renders the partial once per item when present
    # @param ui [Hash{Symbol => String}, nil] per-slot class overrides keyed by sub-part name.
    #   For parent components, the hash is pushed onto a context stack so sub-parts
    #   inherit overrides automatically. For self-rendering components, the hash is
    #   also passed as a local so the partial can apply overrides to internally
    #   rendered elements.
    # @param kwargs [Hash] locals passed to the partial (e.g. +css_classes:+)
    # @yield optional block for component content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    #
    # @example Render a pricing card
    #   appui(:pricing_card) { "Content" }
    #
    # @example Render a pricing card with sub-parts
    #   appui(:pricing_card) do
    #     appui(:pricing_card, :header) { "Header" }
    #   end
    #
    # @example Render with per-slot overrides
    #   appui(:pricing_card, ui: { header: "p-8" }) do
    #     appui(:pricing_card, :header) { "Header" }
    #   end
    #
    # @example Render a collection
    #   appui(:pricing_card, collection: @plans)
    def appui(component, part = nil, collection: nil, ui: nil, **kwargs, &block)
      kiso_render_component(
        component, part,
        path_prefix: "components",
        collection: collection, ui: ui, merge_global_ui: false,
        **kwargs, &block
      )
    end
  end
end
