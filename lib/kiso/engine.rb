module Kiso
  # Rails engine that integrates Kiso into host applications.
  #
  # Registers initializers for:
  # - ClassVariants merger (TailwindMerge for class deduplication)
  # - Global theme overrides ({ThemeOverrides})
  # - View helpers ({ComponentHelper}, {IconHelper})
  # - Importmap and asset pipeline paths
  # - Lookbook preview path registration
  class Engine < ::Rails::Engine
    isolate_namespace Kiso

    # Configures ClassVariants to use TailwindMerge for class deduplication.
    # This ensures conflicting Tailwind utilities are resolved correctly
    # when merging base, variant, and override classes.
    initializer "kiso.class_variants" do
      ClassVariants.configure do |config|
        merger = TailwindMerge::Merger.new
        config.process_classes_with { |classes| merger.merge(classes) }
      end
    end

    # Applies global theme overrides from {Configuration#theme} to
    # theme constants. Runs after app initializers so the host app's
    # +config/initializers/kiso.rb+ has populated +config.theme+.
    initializer "kiso.theme_overrides", after: :load_config_initializers do
      Kiso::ThemeOverrides.apply!
    end

    # Makes {ComponentHelper} and {IconHelper} available in all views.
    initializer "kiso.helpers" do
      ActiveSupport.on_load(:action_view) do
        include Kiso::ComponentHelper
        include Kiso::IconHelper
      end
    end

    # Appends Kiso's importmap config and JavaScript assets for importmap-rails apps.
    initializer "kiso.importmap", before: "importmap" do |app|
      if app.config.respond_to?(:importmap)
        app.config.importmap.paths << root.join("config/importmap.rb")
        app.config.importmap.cache_sweepers << root.join("app/javascript")
      end
    end

    # Appends Kiso's JavaScript directory to the asset pipeline (Propshaft/Sprockets).
    initializer "kiso.assets" do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.paths << root.join("app/javascript")
      end
    end

    # Registers Kiso's component previews with Lookbook when available.
    initializer "kiso.lookbook", after: :load_config_initializers do
      if defined?(Lookbook)
        Lookbook.config.preview_paths << root.join("test/components/previews").to_s
      end
    end
  end
end
