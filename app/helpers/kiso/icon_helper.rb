# frozen_string_literal: true

module Kiso
  module IconHelper
    # Renders an inline SVG icon from Iconify icon sets.
    #
    #   icon("lucide:check")
    #   icon("check")                          # uses default set (lucide)
    #   icon("check", size: :md)               # size preset (standalone use)
    #   icon("check", class: "text-success")   # extra classes
    #   icon("check", aria: { label: "Done" }) # accessible icon
    #
    # Size defaults to nil so parent components (Button, Alert, Badge) can
    # control icon sizing via CSS selectors like [&_svg]:size-4.
    # Pass an explicit size: for standalone icons outside components.
    #
    def icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""

      icon_data = Kiso::Icons.resolve(name.to_s)

      unless icon_data
        if defined?(Rails) && Rails.env.development?
          return "<!-- Kiso::Icons: '#{ERB::Util.html_escape(name)}' not found -->".html_safe
        end
        return "".html_safe
      end

      Kiso::Icons::Renderer.render(
        icon_data,
        size: size,
        css_classes: css_classes,
        **options
      )
    end
  end
end
