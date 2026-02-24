module Kiso
  class Engine < ::Rails::Engine
    isolate_namespace Kiso
    engine_name "kiso_engine"

    initializer "kiso.class_variants" do
      ClassVariants.configure do |config|
        merger = TailwindMerge::Merger.new
        config.process_classes_with { |classes| merger.merge(classes) }
      end
    end

    initializer "kiso.helpers" do
      ActiveSupport.on_load(:action_view) do
        include Kiso::ComponentHelper
      end
    end

    initializer "kiso.lookbook", after: :load_config_initializers do
      if defined?(Lookbook)
        Lookbook.config.preview_paths << root.join("test/components/previews").to_s
      end
    end
  end
end
