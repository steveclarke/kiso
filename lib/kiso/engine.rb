module Kiso
  class Engine < ::Rails::Engine
    isolate_namespace Kiso

    initializer "kiso.class_variants" do
      ClassVariants.configure do |config|
        merger = TailwindMerge::Merger.new
        config.process_classes_with { |classes| merger.merge(classes) }
      end
    end

    initializer "kiso.helpers" do
      ActiveSupport.on_load(:action_view) do
        include Kiso::ComponentHelper
        include Kiso::IconHelper
      end
    end

    initializer "kiso.importmap", before: "importmap" do |app|
      if app.config.respond_to?(:importmap)
        app.config.importmap.paths << root.join("config/importmap.rb")
        app.config.importmap.cache_sweepers << root.join("app/javascript")
      end
    end

    initializer "kiso.assets" do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.paths << root.join("app/javascript")
      end
    end

    initializer "kiso.lookbook", after: :load_config_initializers do
      if defined?(Lookbook)
        Lookbook.config.preview_paths << root.join("test/components/previews").to_s
      end
    end
  end
end
