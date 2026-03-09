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
    # @param ui [Hash{Symbol => String}, nil] per-slot class overrides keyed by sub-part name.
    #   For parent components, the hash is pushed onto a context stack so sub-parts
    #   inherit overrides automatically. For self-rendering components, the hash is
    #   also passed as a local so the partial can apply overrides to internally
    #   rendered elements.
    # @param scope [Hash, nil] domain locals shared from parent to sub-parts via context stack.
    #   Sub-parts receive scope values as kwargs automatically. Explicit kwargs on sub-part
    #   calls override scope values. One level deep only — no ancestor resolution.
    # @param kwargs [Hash] locals passed to the partial (e.g. +color:+, +variant:+, +css_classes:+)
    # @yield optional block for component content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    #
    # @example Render a badge
    #   kui(:badge, color: :success, variant: :soft) { "Active" }
    #
    # @example Render a card with per-slot overrides
    #   kui(:card, ui: { header: "p-8", title: "text-xl" }) do
    #     kui(:card, :header) do
    #       kui(:card, :title) { "Dashboard" }
    #     end
    #   end
    #
    # @example Render an alert with inner element overrides
    #   kui(:alert, icon: "info", ui: { close: "opacity-50" })
    #
    # @example Share domain locals with sub-parts
    #   kui(:card, scope: { project: @project }) do
    #     kui(:card, :header) # sub-part receives project: automatically
    #   end
    #
    # @example Render a collection
    #   kui(:badge, collection: @tags)
    def kui(component, part = nil, collection: nil, ui: nil, scope: nil, **kwargs, &block)
      kiso_render_component(
        component, part,
        path_prefix: "kiso/components",
        collection: collection, ui: ui, scope: scope, merge_global_ui: true,
        **kwargs, &block
      )
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

    # Renders a themed HTML element with Kiso conventions.
    #
    # Collapses the common +content_tag+ + +kiso_prepare_options+ + theme
    # rendering boilerplate into a single call. Use in component partials
    # instead of manually wiring +content_tag+.
    #
    # @param tag [Symbol] HTML element name (e.g. +:div+, +:span+, +:button+)
    # @param theme [ClassVariants::Instance] the theme module to render classes from
    # @param slot [String] the +data-slot+ value (kebab-case)
    # @param css_classes [String] caller's class overrides, merged via +tailwind_merge+
    # @param variants [Hash] variant values forwarded to +theme.render+
    #   (e.g. +{ size: :md, color: :primary }+)
    # @param component_options [Hash] HTML attributes forwarded to +content_tag+
    #   (e.g. +id:+, +aria:+). A +data:+ key is extracted and merged with slot.
    # @yield optional block for element content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    #
    # @example In a component partial
    #   kui_tag :div, theme: Kiso::Themes::Badge, slot: "badge",
    #       css_classes: css_classes, variants: { color: color, variant: variant },
    #       **component_options do
    #     yield
    #   end
    def kui_tag(tag, theme:, slot:, css_classes: "", variants: {}, **component_options, &block)
      content_tag(tag,
        class: theme.render(**variants, class: css_classes),
        data: kiso_prepare_options(component_options, slot: slot),
        **component_options, &block)
    end

    private

    # Shared rendering pipeline for both kui() and appui().
    #
    # @param component [Symbol] the component name
    # @param part [Symbol, nil] optional sub-part name
    # @param path_prefix [String] partial path prefix (e.g. "kiso/components" or "components")
    # @param collection [Array, nil] renders the partial once per item when present
    # @param ui [Hash, nil] per-slot class overrides
    # @param scope [Hash, nil] domain locals shared from parent to sub-parts
    # @param merge_global_ui [Boolean] whether to merge global config ui layer
    # @param kwargs [Hash] locals passed to the partial
    # @param block [Proc] optional block for component content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    def kiso_render_component(component, part, path_prefix:, collection:, ui:, scope:, merge_global_ui: true, **kwargs, &block)
      path = if part
        "#{path_prefix}/#{component}/#{part}"
      else
        "#{path_prefix}/#{component}"
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

      if part
        # Sub-part: merge scope from parent context (scope values first, explicit kwargs win)
        parent_scope = kiso_current_scope(component)
        kwargs = parent_scope.merge(kwargs) if parent_scope.present?

        # Sub-part: merge slot override from parent's ui context
        parent_ui = kiso_current_ui(component)
        if (slot_classes = parent_ui[part].presence)
          existing = kwargs[:css_classes] || ""
          kwargs[:css_classes] = existing.blank? ? slot_classes : "#{existing} #{slot_classes}"
        end

        # Forward ui: to sub-part partial when explicitly provided
        kwargs[:ui] = ui if ui

        if collection
          render partial: path, collection: collection, locals: kwargs, &block
        else
          render path, **kwargs, &block
        end
      else
        # Parent component: merge global ui config with instance ui (or use instance ui directly)
        merged_ui = if merge_global_ui
          kiso_merge_ui_layers(component, ui)
        else
          ui || {}
        end
        has_ui = merged_ui.present?
        has_scope = scope.present?

        # Push context for composed sub-parts to read (skip when empty)
        kiso_push_ui_context(component, merged_ui) if has_ui
        kiso_push_scope(component, scope) if has_scope

        # Merge scope into parent kwargs so the parent partial receives
        # scope values as strict locals (scope as defaults, explicit kwargs win)
        kwargs = scope.merge(kwargs) if has_scope
        begin
          locals = has_ui ? kwargs.merge(ui: merged_ui) : kwargs

          if collection
            render partial: path, collection: collection, locals: locals, &block
          else
            render path, **locals, &block
          end
        ensure
          kiso_pop_ui_context(component) if has_ui
          kiso_pop_scope(component) if has_scope
        end
      end
    end

    # Merge global config ui overrides with instance ui overrides.
    # Global config is Layer 2, instance +ui:+ is Layer 3.
    #
    # @param component [Symbol] the component name
    # @param instance_ui [Hash, nil] per-instance ui overrides
    # @return [Hash{Symbol => String}] merged ui hash
    def kiso_merge_ui_layers(component, instance_ui)
      global_ui = Kiso.config.theme.dig(component, :ui)
      return instance_ui || {} if global_ui.nil? || global_ui.empty?
      return global_ui if instance_ui.nil? || instance_ui.empty?

      # Instance wins. For slots in both, concatenate — tailwind_merge
      # resolves conflicts when .render(class:) is called.
      global_ui.merge(instance_ui) do |_slot, global_classes, instance_classes|
        "#{global_classes} #{instance_classes}"
      end
    end
  end
end
