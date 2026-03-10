# frozen_string_literal: true

require "tailwind_merge"

module Kiso
  # View helpers for rendering inline SVG icons with Tailwind classes.
  #
  # Provides two public methods:
  #
  # - {#kiso_icon} -- renders any icon by name. Used in application code
  #   and templates when the caller knows the exact icon they want.
  # - {#kiso_component_icon} -- renders a semantic/configurable icon. Used
  #   inside Kiso component partials for default icons (close button X,
  #   separator chevrons, pagination arrows) so host apps can swap them
  #   globally via {Kiso::Configuration#icons}.
  #
  # Both methods delegate to +kiso_icon_tag+ (provided by the kiso-icons
  # gem) for actual SVG rendering. Classes are deduplicated and resolved
  # via +TailwindMerge::Merger+.
  #
  # == Icon sizing
  #
  # By default, icons render without an explicit size class. This allows
  # parent components (Button, Alert, Badge, etc.) to control icon sizing
  # via CSS selectors like +[&_svg]:size-4+. Pass an explicit +size:+
  # preset for standalone icons outside of components.
  #
  # Included in all views automatically by {Kiso::Engine}.
  #
  # @see Kiso::Configuration#icons  the global icon name registry
  module IconHelper
    # Maps size preset symbols to Tailwind size utility classes.
    # These follow Kiso's spatial scale for icon sizing.
    #
    # @return [Hash{Symbol => String}]
    SIZE_PRESETS = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }.freeze

    # Base Tailwind classes applied to every icon. +shrink-0+ prevents
    # icons from collapsing in flex containers.
    #
    # @return [String]
    BASE_CLASSES = "shrink-0"

    # Renders a configurable component icon by semantic name.
    #
    # Component partials call this instead of {#kiso_icon} when the icon
    # should be overridable by host apps. The semantic name is resolved to
    # an actual icon identifier via {Kiso::Configuration#icons}, which host
    # apps can customize in an initializer.
    #
    # @param semantic_name [Symbol] a key from the icon registry
    #   (e.g. +:chevron_right+, +:check+, +:x+, +:spinner+). See
    #   {Kiso::Configuration} for the full list of registered names.
    # @param options [Hash] forwarded to {#kiso_icon} (e.g. +size:+,
    #   +class:+, +aria:+).
    # @return [ActiveSupport::SafeBuffer] rendered inline SVG
    # @raise [KeyError] if +semantic_name+ is not registered in
    #   {Kiso::Configuration#icons}
    #
    # @example In a component partial (separator chevron)
    #   <%= kiso_component_icon(:chevron_right, class: "size-3.5") %>
    #
    # @example In a component partial (dropdown indicator)
    #   <%= kiso_component_icon(:chevron_down, size: :sm) %>
    #
    # @example Host app overrides the icon globally
    #   # config/initializers/kiso.rb
    #   Kiso.configure do |config|
    #     config.icons[:chevron_right] = "heroicons:chevron-right"
    #   end
    def kiso_component_icon(semantic_name, **)
      icon_name = Kiso.config.icons.fetch(semantic_name) {
        raise KeyError, "Unknown Kiso icon: #{semantic_name.inspect}. " \
          "Known icons: #{Kiso.config.icons.keys.join(", ")}"
      }
      kiso_icon(icon_name, **)
    end

    # Renders an inline SVG icon with Tailwind classes.
    #
    # This is the general-purpose icon helper for use in application
    # templates and views. Inside Kiso component partials, prefer
    # {#kiso_component_icon} for default icons so they remain configurable.
    #
    # The +size:+ parameter defaults to +nil+ so parent components (Button,
    # Alert, Badge) can control icon sizing via CSS selectors like
    # +[&_svg]:size-4+. Pass an explicit +size:+ only for standalone icons
    # rendered outside of a Kiso component.
    #
    # @param name [String] icon identifier, optionally prefixed with the
    #   icon set name separated by a colon (e.g. +"check"+,
    #   +"lucide:check"+, +"heroicons:arrow-right"+). Without a prefix,
    #   the default icon set is used.
    # @param size [Symbol, nil] size preset from {SIZE_PRESETS}
    #   (+:xs+ = 12px, +:sm+ = 16px, +:md+ = 20px, +:lg+ = 24px,
    #   +:xl+ = 32px). Pass +nil+ (default) to let the parent component
    #   control sizing.
    # @param options [Hash] forwarded to +kiso_icon_tag+ from the
    #   kiso-icons gem (e.g. +class:+, +aria:+, +data:+, +title:+).
    # @return [ActiveSupport::SafeBuffer] rendered inline SVG element
    #
    # @example Basic usage in a template
    #   <%= kiso_icon("check") %>
    #
    # @example With a size preset
    #   <%= kiso_icon("arrow-right", size: :md) %>
    #
    # @example With extra Tailwind classes
    #   <%= kiso_icon("check", class: "text-success") %>
    #
    # @example With accessibility label
    #   <%= kiso_icon("check", aria: { label: "Done" }) %>
    #
    # @example From a specific icon set
    #   <%= kiso_icon("heroicons:check-circle", size: :lg) %>
    def kiso_icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""
      size_class = size ? SIZE_PRESETS.fetch(size) : nil
      merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

      kiso_icon_tag(name, class: merged, **options)
    end

    private

    # Merges icon class parts via +TailwindMerge+, filtering out blanks.
    #
    # When multiple parts specify conflicting Tailwind utilities (e.g.
    # +size-4+ from a preset and +size-6+ from a caller), the last one
    # wins -- the same behavior as +tailwind_merge+ in theme rendering.
    #
    # @param parts [Array<String, nil>] class strings to merge. +nil+ and
    #   empty values are filtered out before joining.
    # @return [String] deduplicated, conflict-resolved class string
    def merge_icon_classes(*parts)
      combined = parts.reject { |p| p.nil? || p.to_s.empty? }.join(" ")
      icon_class_merger.merge(combined)
    end

    # Returns a memoized +TailwindMerge::Merger+ instance for icon class
    # deduplication. Memoized on the view context instance (per-request).
    #
    # @return [TailwindMerge::Merger]
    def icon_class_merger
      @icon_class_merger ||= TailwindMerge::Merger.new
    end
  end
end
