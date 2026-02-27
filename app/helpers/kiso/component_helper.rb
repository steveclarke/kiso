module Kiso
  module ComponentHelper
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
    # Sets data-slot for component identity (shadcn v4 convention)
    # and guards against accidental class: usage.
    #
    #   data: kiso_prepare_options(component_options, slot: "badge")
    #   data: kiso_prepare_options(component_options, slot: "card-header")
    #   data: kiso_prepare_options(component_options, slot: "toggle", controller: "kiso--toggle")
    #
    def kiso_prepare_options(component_options, slot:, **data_attrs)
      if component_options.key?(:class)
        raise ArgumentError, "Use css_classes: instead of class: for Kiso components"
      end

      (component_options.delete(:data) || {}).merge(slot: slot, **data_attrs)
    end
  end
end
