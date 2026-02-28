# frozen_string_literal: true

require "tailwind_merge"

module Kiso
  # View helpers for rendering inline SVG icons.
  #
  # Included in all views automatically by {Engine}.
  # Delegates to +kiso_icon_tag+ (provided by the kiso-icons gem) for
  # actual SVG rendering.
  module IconHelper
    # @return [Hash{Symbol => String}] maps size presets to Tailwind size utilities
    SIZE_PRESETS = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }.freeze

    # @return [String] base Tailwind classes applied to every icon
    BASE_CLASSES = "shrink-0"

    # Renders a configurable component icon.
    #
    # Components call this instead of {#kiso_icon} when the icon name should
    # be overridable by host apps via {Configuration#icons Kiso.config.icons}.
    #
    # @param semantic_name [Symbol] a key from {Configuration#icons}
    #   (e.g. +:chevron_right+, +:check+, +:x+)
    # @param options [Hash] forwarded to {#kiso_icon}
    # @return [ActiveSupport::SafeBuffer] rendered SVG
    # @raise [KeyError] if +semantic_name+ is not registered
    #
    # @example
    #   kiso_component_icon(:chevron_right, class: "size-3.5")
    #   kiso_component_icon(:ellipsis, size: :sm)
    def kiso_component_icon(semantic_name, **)
      icon_name = Kiso.config.icons.fetch(semantic_name) {
        raise KeyError, "Unknown Kiso icon: #{semantic_name.inspect}. " \
          "Known icons: #{Kiso.config.icons.keys.join(", ")}"
      }
      kiso_icon(icon_name, **)
    end

    # Renders an inline SVG icon with Tailwind classes.
    #
    # Size defaults to +nil+ so parent components (Button, Alert, Badge) can
    # control icon sizing via CSS selectors like +[&_svg]:size-4+.
    # Pass an explicit +size:+ for standalone icons outside components.
    #
    # @param name [String] icon identifier, optionally prefixed with set
    #   (e.g. +"check"+, +"lucide:check"+)
    # @param size [Symbol, nil] size preset from {SIZE_PRESETS}
    #   (+:xs+, +:sm+, +:md+, +:lg+, +:xl+)
    # @param options [Hash] forwarded to +kiso_icon_tag+
    #   (e.g. +class:+, +aria:+, +data:+)
    # @return [ActiveSupport::SafeBuffer] rendered SVG
    #
    # @example Basic usage
    #   kiso_icon("check")
    # @example With size preset
    #   kiso_icon("check", size: :md)
    # @example With extra classes
    #   kiso_icon("check", class: "text-success")
    # @example Accessible icon
    #   kiso_icon("check", aria: { label: "Done" })
    def kiso_icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""
      size_class = size ? SIZE_PRESETS.fetch(size) : nil
      merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

      kiso_icon_tag(name, class: merged, **options)
    end

    private

    # Merges icon class parts via TailwindMerge, filtering out blanks.
    #
    # @param parts [Array<String, nil>] class strings to merge
    # @return [String] deduplicated class string
    def merge_icon_classes(*parts)
      combined = parts.reject { |p| p.nil? || p.to_s.empty? }.join(" ")
      icon_class_merger.merge(combined)
    end

    # @return [TailwindMerge::Merger] memoized merger instance
    def icon_class_merger
      @icon_class_merger ||= TailwindMerge::Merger.new
    end
  end
end
