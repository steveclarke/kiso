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
    #   kui(:badge, variant: :success) { "Active" }
    #   kui(:card, :header) { ... }
    #   kui(:badge, collection: @statuses)
    #
    def kui(component, part = nil, collection: nil, **kwargs, &block)
      path = if part
        "kiso/components/#{component}/#{part}"
      else
        "kiso/components/#{component}"
      end

      if collection
        render partial: path, collection: collection, locals: kwargs, &block
      else
        render path, **kwargs, &block
      end
    end

    # Prepares component_options for use with content_tag.
    # Guards against accidental class: usage and merges data attributes.
    #
    #   data: kiso_prepare_options(component_options, component: :badge)
    #   data: kiso_prepare_options(component_options, component: :card, card_part: :header)
    #
    def kiso_prepare_options(component_options, **data_attrs)
      if component_options.key?(:class)
        raise ArgumentError, "Use css_classes: instead of class: for Kiso components"
      end

      (component_options.delete(:data) || {}).merge(data_attrs)
    end
  end
end
