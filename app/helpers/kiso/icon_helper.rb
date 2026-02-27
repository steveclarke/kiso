# frozen_string_literal: true

require "tailwind_merge"

module Kiso
  module IconHelper
    SIZE_PRESETS = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }.freeze

    BASE_CLASSES = "shrink-0"

    # Renders an inline SVG icon with Tailwind classes.
    #
    #   kiso_icon("lucide:check")
    #   kiso_icon("check")                          # uses default set (lucide)
    #   kiso_icon("check", size: :md)               # size preset (standalone use)
    #   kiso_icon("check", class: "text-success")   # extra classes
    #   kiso_icon("check", aria: { label: "Done" }) # accessible icon
    #
    # Size defaults to nil so parent components (Button, Alert, Badge) can
    # control icon sizing via CSS selectors like [&_svg]:size-4.
    # Pass an explicit size: for standalone icons outside components.
    #
    # Renders a configurable component icon. Components call this instead
    # of kiso_icon() when the icon name should be overridable by host apps
    # via Kiso.config.icons.
    #
    #   kiso_component_icon(:chevron_right, class: "size-3.5")
    #   kiso_component_icon(:ellipsis, size: :sm)
    #
    def kiso_component_icon(semantic_name, **)
      icon_name = Kiso.config.icons.fetch(semantic_name) {
        raise KeyError, "Unknown Kiso icon: #{semantic_name.inspect}. " \
          "Known icons: #{Kiso.config.icons.keys.join(", ")}"
      }
      kiso_icon(icon_name, **)
    end

    def kiso_icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""
      size_class = size ? SIZE_PRESETS.fetch(size) : nil
      merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

      kiso_icon_tag(name, class: merged, **options)
    end

    private

    def merge_icon_classes(*parts)
      combined = parts.reject { |p| p.nil? || p.to_s.empty? }.join(" ")
      icon_class_merger.merge(combined)
    end

    def icon_class_merger
      @icon_class_merger ||= TailwindMerge::Merger.new
    end
  end
end
