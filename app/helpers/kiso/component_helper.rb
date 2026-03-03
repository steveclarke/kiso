module Kiso
  # View helpers for rendering Kiso components.
  #
  # Included in all views automatically by {Engine}.
  module ComponentHelper
    # Renders a Kiso component partial.
    #
    # Components live in +app/views/kiso/components/+. Sub-parts are nested
    # in a directory matching the parent component name.
    #
    # @param component [Symbol] the component name (e.g. +:badge+, +:card+)
    # @param part [Symbol, nil] optional sub-part name (e.g. +:header+, +:footer+)
    # @param collection [Array, nil] renders the partial once per item when present
    # @param kwargs [Hash] locals passed to the partial (e.g. +color:+, +variant:+, +css_classes:+)
    # @yield optional block for component content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    #
    # @example Render a badge
    #   kui(:badge, color: :success, variant: :soft) { "Active" }
    #
    # @example Render a card sub-part
    #   kui(:card, :header) { "Title" }
    #
    # @example Render a collection
    #   kui(:badge, collection: @tags)
    def kui(component, part = nil, collection: nil, **kwargs, &block)
      path = if part
        "kiso/components/#{component}/#{part}"
      else
        "kiso/components/#{component}"
      end

      # Prevent yield from bubbling up the ERB rendering chain when no block
      # is passed. Without this, partials that use `capture { yield }.presence`
      # to support optional block overrides (e.g., toggle/collapse/separator)
      # would have their `yield` bubble through nested content_tag blocks all
      # the way to the layout's `<%= yield %>`, capturing the entire page
      # template content. An explicit empty proc gives `yield` something to
      # call, returning empty string → `.presence` returns nil → default
      # content renders correctly.
      block ||= proc {}

      if collection
        render partial: path, collection: collection, locals: kwargs, &block
      else
        render path, **kwargs, &block
      end
    end

    # Prepares +component_options+ for use with +content_tag+.
    #
    # Sets +data-slot+ for component identity (shadcn v4 convention) and
    # merges any additional data attributes. Raises if +class:+ is passed
    # (use +css_classes:+ instead).
    #
    # @param component_options [Hash] the +**component_options+ splat from the partial.
    #   Any +data:+ key is extracted and merged with +slot+ and +data_attrs+.
    # @param slot [String] the +data-slot+ value (kebab-case, e.g. +"card-header"+)
    # @param data_attrs [Hash] additional data attributes (e.g. +controller: "kiso--toggle"+)
    # @return [Hash] merged data attributes hash for +content_tag+
    # @raise [ArgumentError] if +component_options+ contains a +class:+ key
    #
    # @example In a component partial
    #   data: kiso_prepare_options(component_options, slot: "badge")
    #
    # @example With a Stimulus controller
    #   data: kiso_prepare_options(component_options, slot: "toggle", controller: "kiso--toggle")
    def kiso_prepare_options(component_options, slot:, **data_attrs)
      if component_options.key?(:class)
        raise ArgumentError, "Use css_classes: instead of class: for Kiso components"
      end

      (component_options.delete(:data) || {}).merge(slot: slot, **data_attrs)
    end
  end
end
