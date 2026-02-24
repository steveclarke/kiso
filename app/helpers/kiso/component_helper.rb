module Kiso
  module ComponentHelper
    # Renders a component element with data-attribute API.
    #
    #   component_tag(:span, :badge, variant: :primary, size: :md) { "Active" }
    #   # => <span data-component="badge" data-variant="primary" data-size="md">Active</span>
    #
    #   component_tag(:div, :card, part: :header) { ... }
    #   # => <div data-card-part="header">...</div>
    #
    def component_tag(element, component, variant: nil, size: nil, part: nil, **options, &block)
      data = options.delete(:data) || {}

      if part
        data[:"#{component}-part"] = part
      else
        data[:component] = component
        data[:variant] = variant if variant
        data[:size] = size if size
      end

      options[:data] = data

      content_tag(element, **options, &block)
    end

    # Renders a Kiso component partial.
    #
    #   kiso(:badge, variant: :success) { "Active" }
    #   kiso(:card, :header) { ... }
    #   kiso(:badge, collection: @statuses)
    #
    def kiso(component, part = nil, collection: nil, **kwargs, &block)
      path = if part
        "kiso/components/#{component}/#{part}"
      else
        "kiso/components/#{component}"
      end

      if collection
        render partial: path, collection: collection, **kwargs, &block
      else
        render path, **kwargs, &block
      end
    end
  end
end
