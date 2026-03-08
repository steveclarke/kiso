# frozen_string_literal: true

module Kiso
  module Generators
    # Scaffolds a component with a ClassVariants theme module and ERB partial.
    #
    # Theme files are placed in +app/themes/<active_theme>/+ (default:
    # +app/themes/default/+). The active theme is configured via
    # +Kiso.config.app_theme+. Components are rendered using the +appui()+
    # helper.
    #
    # @example Basic usage
    #   bin/rails generate kiso:component pricing_card
    #
    # @example With sub-parts
    #   bin/rails generate kiso:component pricing_card --sub-parts header footer
    #
    # @example With a custom theme
    #   bin/rails generate kiso:component pricing_card --theme modern
    class ComponentGenerator < Rails::Generators::NamedBase
      source_root File.expand_path("templates", __dir__)

      class_option :sub_parts,
        type: :array,
        default: [],
        desc: "Sub-part names to generate (e.g. --sub-parts header footer)"

      class_option :theme,
        type: :string,
        default: nil,
        desc: "Theme directory name (defaults to Kiso.config.app_theme, usually :default)"

      def create_theme_file
        template "theme.rb.tt", File.join(theme_dir, component_path_dir, "#{file_name}.rb")
      end

      def create_partial_file
        template "partial.html.erb.tt",
          File.join("app/views/components", component_path_dir, "_#{file_name}.html.erb")
      end

      def create_sub_part_files
        options[:sub_parts].each do |part|
          @current_part = part
          template "sub_part_theme.rb.tt",
            File.join(theme_dir, component_path_dir, "#{file_name}_#{part}.rb")
          template "sub_part_partial.html.erb.tt",
            File.join("app/views/components", component_path_dir, file_name, "_#{part}.html.erb")
        end
      end

      private

      # @return [String] the current sub-part name being generated
      attr_reader :current_part

      # @return [String] the theme directory path (e.g. "app/themes/default")
      def theme_dir
        name = (options[:theme] || Kiso.config.app_theme).to_s
        File.join("app/themes", name)
      end

      # @return [String] the component name in PascalCase (e.g. "PricingCard")
      def class_name_without_namespace
        file_name.camelize
      end

      # @return [String] the kebab-case data-slot value (e.g. "pricing-card")
      def slot_name
        file_name.dasherize
      end

      # @return [String] the kebab-case data-slot value for a sub-part (e.g. "pricing-card-header")
      def sub_part_slot_name
        "#{slot_name}-#{current_part.dasherize}"
      end

      # @return [String] the PascalCase theme constant name for a sub-part (e.g. "PricingCardHeader")
      def sub_part_class_name
        "#{class_name_without_namespace}#{current_part.camelize}"
      end

      # @return [Array<String>] namespace segments from the name argument
      def component_class_path
        regular_class_path
      end

      # @return [String] namespace directory path (empty string for simple names)
      def component_path_dir
        component_class_path.join("/")
      end

      # @return [String] full module nesting prefix (e.g. "Admin::" for admin/pricing_card)
      def module_prefix
        component_class_path.map(&:camelize).join("::")
      end

      # @return [Boolean] whether the component has a namespace prefix (e.g. admin/pricing_card)
      def has_namespace?
        component_class_path.any?
      end
    end
  end
end
