# frozen_string_literal: true

module Kiso
  # View helpers for rendering Kiso UI components in ERB templates.
  #
  # This module is the primary public API for the Kiso component library.
  # It provides {#kui} for rendering engine-shipped components,
  # {#kiso_prepare_options} for building +data-slot+ attributes in partials,
  # and {#kui_tag} for collapsing the common +content_tag+ boilerplate.
  #
  # Included in all views automatically by {Kiso::Engine}.
  #
  # == Override layers
  #
  # Kiso resolves Tailwind classes through four layers (lowest to highest
  # priority):
  #
  # 1. **Theme default** -- the +ClassVariants+ definition in
  #    +lib/kiso/themes/+.
  # 2. **Global config** -- +Kiso.configure { |c| c.theme[:button] = ... }+,
  #    applied once at boot via +ClassVariants::Instance#merge+.
  # 3. **Instance +ui:+** -- per-render slot overrides passed to +kui()+.
  # 4. **Instance +css_classes:+** -- per-render root-element overrides,
  #    merged via +tailwind_merge+ at render time.
  #
  # @see AppComponentHelper#appui  the equivalent helper for host app components
  # @see UiContextHelper  the request-scoped context stack that powers +ui:+
  # @see Kiso::Configuration  global theme and icon configuration
  module ComponentHelper
    # Renders a Kiso component partial.
    #
    # This is the main entry point for rendering any Kiso UI component.
    # Components live in +app/views/kiso/components/+. Sub-parts are nested
    # in a directory matching the parent component name (e.g.
    # +card/_header.html.erb+).
    #
    # Internally wraps Rails +render+ with Kiso-specific behavior:
    # - Injects an empty +proc+ when no block is given, preventing +yield+
    #   from bubbling up the ERB rendering chain (see implementation notes)
    # - Pushes +ui:+ and +scope:+ onto request-scoped context stacks so
    #   sub-parts inherit them automatically
    # - Merges global config +ui:+ overrides (Layer 2) with instance +ui:+
    #   (Layer 3)
    #
    # @param component [Symbol] the component name (e.g. +:badge+, +:card+,
    #   +:button+). Must match a partial at
    #   +app/views/kiso/components/_<name>.html.erb+.
    # @param part [Symbol, nil] optional sub-part name (e.g. +:header+,
    #   +:footer+, +:title+). Resolves to
    #   +app/views/kiso/components/<component>/_<part>.html.erb+.
    # @param collection [Array, nil] when present, renders the partial once
    #   per item using Rails collection rendering.
    # @param ui [Hash{Symbol => String}, nil] per-slot class overrides keyed
    #   by sub-part name. For parent components, the hash is pushed onto a
    #   context stack so composed sub-parts inherit overrides automatically.
    #   For self-rendering components (Alert, Dialog, Switch, etc.), the
    #   hash is also passed as a +ui:+ local so the partial can apply
    #   overrides to internally rendered elements via
    #   +Kiso::Themes::SubPart.render(class: ui[:slot_name])+.
    # @param scope [Hash, nil] domain locals shared from parent to sub-parts
    #   via context stack. Sub-parts receive scope values as kwargs
    #   automatically. Explicit kwargs on sub-part calls override scope
    #   values. One level deep only -- no ancestor resolution.
    # @param kwargs [Hash] locals forwarded to the partial (e.g. +color:+,
    #   +variant:+, +size:+, +css_classes:+, +icon:+). These must match the
    #   partial's +strict locals+ declaration.
    # @yield optional block for component content. When omitted, an empty
    #   proc is injected so partials can safely use
    #   +capture { yield }.presence+ for optional block overrides.
    # @return [ActiveSupport::SafeBuffer] rendered HTML string
    #
    # @example Render a simple badge
    #   <%= kui(:badge, color: :success, variant: :soft) { "Active" } %>
    #
    # @example Render a card with composed sub-parts
    #   <%= kui(:card) do %>
    #     <%= kui(:card, :header) do %>
    #       <%= kui(:card, :title) { "Dashboard" } %>
    #       <%= kui(:card, :description) { "Overview of your projects" } %>
    #     <% end %>
    #     <%= kui(:card, :content) do %>
    #       <p>Card body content here.</p>
    #     <% end %>
    #   <% end %>
    #
    # @example Render a card with per-slot overrides
    #   <%= kui(:card, ui: { header: "p-8", title: "text-xl" }) do %>
    #     <%= kui(:card, :header) do %>
    #       <%= kui(:card, :title) { "Dashboard" } %>
    #     <% end %>
    #   <% end %>
    #
    # @example Render an alert with inner element overrides
    #   <%= kui(:alert, icon: "info", ui: { close: "opacity-50" }) %>
    #
    # @example Override root element classes
    #   <%= kui(:badge, css_classes: "uppercase tracking-wide") { "New" } %>
    #
    # @example Pass HTML attributes through to the root element
    #   <%= kui(:button, id: "submit-btn", data: { turbo: false }) { "Submit" } %>
    #
    # @example Share domain locals with sub-parts via scope
    #   <%= kui(:card, scope: { project: @project }) do %>
    #     <%= kui(:card, :header) %>  <%# receives project: automatically %>
    #   <% end %>
    #
    # @example Render a collection
    #   <%= kui(:badge, collection: @tags) %>
    def kui(component, part = nil, collection: nil, ui: nil, scope: nil, **kwargs, &block)
      kiso_render_component(
        component, part,
        path_prefix: "kiso/components",
        collection: collection, ui: ui, scope: scope, merge_global_ui: true,
        **kwargs, &block
      )
    end

    # Prepares +component_options+ for use with +content_tag+ in component
    # partials.
    #
    # Extracts the caller's +data:+ hash from +component_options+, merges it
    # with the mandatory +data-slot+ attribute (shadcn v4 convention) and any
    # additional data attributes (typically Stimulus bindings). Returns the
    # merged data hash ready for +content_tag+.
    #
    # This method mutates +component_options+ by deleting the +data:+ key so
    # it is not double-passed when the partial splats +**component_options+
    # onto +content_tag+.
    #
    # @param component_options [Hash] the +**component_options+ splat from
    #   the partial's strict locals. Callers pass arbitrary HTML attributes
    #   here (e.g. +id:+, +aria:+, +data:+). The +data:+ key is extracted
    #   and merged; all other keys pass through to +content_tag+.
    # @param slot [String] the +data-slot+ value in kebab-case
    #   (e.g. +"badge"+, +"card-header"+, +"alert-title"+). Every component
    #   and sub-part must have a unique slot name.
    # @param data_attrs [Hash] additional data attributes merged into the
    #   result (e.g. +controller: "kiso--toggle"+, +action: "click->..."+).
    # @return [Hash] merged data attributes hash suitable for the +data:+
    #   kwarg of +content_tag+.
    # @raise [ArgumentError] if +component_options+ contains a +class:+ key.
    #   Kiso uses +css_classes:+ to avoid conflicts with Ruby's +class+
    #   method and to make the override intent explicit.
    #
    # @example Basic usage in a component partial
    #   <%# _badge.html.erb %>
    #   <%= content_tag :span,
    #       class: Kiso::Themes::Badge.render(color: color, class: css_classes),
    #       data: kiso_prepare_options(component_options, slot: "badge"),
    #       **component_options do %>
    #     <%= yield %>
    #   <% end %>
    #
    # @example With a Stimulus controller
    #   data: kiso_prepare_options(component_options, slot: "toggle",
    #       controller: "kiso--toggle")
    #
    # @example Caller passes data attributes through
    #   <%# In the view: %>
    #   <%= kui(:badge, data: { turbo_frame: "results" }) { "Active" } %>
    #   <%# Inside the partial, kiso_prepare_options merges caller's data
    #       with { slot: "badge" }, producing:
    #       { slot: "badge", turbo_frame: "results" } %>
    def kiso_prepare_options(component_options, slot:, **data_attrs)
      if component_options.key?(:class)
        raise ArgumentError, "Use css_classes: instead of class: for Kiso components"
      end

      (component_options.delete(:data) || {}).merge(slot: slot, **data_attrs)
    end

    # Renders a themed HTML element with Kiso conventions.
    #
    # A convenience method that collapses the common three-step boilerplate
    # in component partials:
    #
    # 1. +theme.render(**variants, class: css_classes)+ -- compute classes
    # 2. +kiso_prepare_options(component_options, slot: ...)+ -- build data attrs
    # 3. +content_tag(tag, class: ..., data: ..., **component_options)+ -- render
    #
    # Into a single call. Prefer this over manual +content_tag+ wiring in
    # component partials for consistency.
    #
    # @param tag [Symbol] HTML element name (e.g. +:div+, +:span+, +:button+)
    # @param theme [ClassVariants::Instance] the theme module to render
    #   classes from (e.g. +Kiso::Themes::Badge+, +Kiso::Themes::Card+).
    #   Must respond to +#render(**variants, class:)+.
    # @param slot [String] the +data-slot+ value in kebab-case
    #   (e.g. +"badge"+, +"card-header"+).
    # @param css_classes [String] caller's class overrides, merged via
    #   +tailwind_merge+ inside the theme's +#render+ method. Defaults to
    #   an empty string.
    # @param variants [Hash] variant key-value pairs forwarded to
    #   +theme.render+ (e.g. +{ size: :md, color: :primary, variant: :soft }+).
    # @param component_options [Hash] HTML attributes forwarded to
    #   +content_tag+ (e.g. +id:+, +aria:+, +type:+). A +data:+ key is
    #   extracted and merged with the slot and any Stimulus bindings.
    # @yield optional block for element content
    # @return [ActiveSupport::SafeBuffer] rendered HTML
    #
    # @example In a component partial
    #   <%# _badge.html.erb %>
    #   <%= kui_tag :span, theme: Kiso::Themes::Badge, slot: "badge",
    #       css_classes: css_classes,
    #       variants: { color: color, variant: variant, size: size },
    #       **component_options do %>
    #     <%= yield %>
    #   <% end %>
    #
    # @example Button with type attribute
    #   <%= kui_tag :button, theme: Kiso::Themes::Button, slot: "button",
    #       css_classes: css_classes,
    #       variants: { color: color, variant: variant, size: size },
    #       type: "button", **component_options do %>
    #     <%= yield %>
    #   <% end %>
    def kui_tag(tag, theme:, slot:, css_classes: "", variants: {}, **component_options, &block)
      html_options = {
        class: theme.render(**variants, class: css_classes),
        data: kiso_prepare_options(component_options, slot: slot),
        **component_options
      }

      if block
        content_tag(tag, html_options, &block)
      else
        content_tag(tag, nil, html_options)
      end
    end

    private

    # Shared rendering pipeline for both {#kui} and {AppComponentHelper#appui}.
    #
    # Handles two distinct code paths:
    #
    # - **Parent components** (+part+ is +nil+): merges global and instance
    #   +ui:+ layers, pushes +ui:+ and +scope:+ onto their respective
    #   context stacks, renders the partial, then pops the stacks in an
    #   +ensure+ block.
    # - **Sub-parts** (+part+ is present): reads the parent's context stacks
    #   to inherit +ui:+ slot overrides and +scope:+ domain locals, then
    #   renders the partial with the merged kwargs.
    #
    # The empty +proc {}+ guard is critical: without it, partials that call
    # +capture { yield }.presence+ for optional block overrides would have
    # their +yield+ bubble through nested +content_tag+ blocks all the way
    # to the layout's +<%= yield %>+, capturing the entire page template.
    #
    # @param component [Symbol] the component name
    # @param part [Symbol, nil] optional sub-part name
    # @param path_prefix [String] partial path prefix
    #   (+"kiso/components"+ for engine, +"components"+ for host app)
    # @param collection [Array, nil] renders the partial once per item
    # @param ui [Hash{Symbol => String}, nil] per-slot class overrides
    # @param scope [Hash, nil] domain locals shared from parent to sub-parts
    # @param merge_global_ui [Boolean] whether to merge global config ui
    #   layer. +true+ for {#kui} (engine components have global config),
    #   +false+ for {AppComponentHelper#appui} (host apps own the source).
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

    # Merges global config +ui:+ overrides (Layer 2) with per-instance
    # +ui:+ overrides (Layer 3).
    #
    # When both layers define the same slot, their class strings are
    # concatenated (space-separated). Conflicts are resolved later by
    # +tailwind_merge+ when the sub-part calls +theme.render(class:)+.
    #
    # @param component [Symbol] the component name (e.g. +:card+)
    # @param instance_ui [Hash{Symbol => String}, nil] per-instance ui
    #   overrides passed to +kui(:card, ui: { ... })+
    # @return [Hash{Symbol => String}] merged ui hash with all slot
    #   overrides from both layers
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
