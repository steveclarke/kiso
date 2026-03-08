# frozen_string_literal: true

module Kiso
  module Generators
    # Scaffolds a host app component with a theme module and ERB partial.
    #
    # @example Basic usage
    #   bin/rails generate kiso:app_component pricing_card
    #
    # @example With sub-parts
    #   bin/rails generate kiso:app_component pricing_card --sub-parts header footer
    class AppComponentGenerator < Rails::Generators::NamedBase
      source_root File.expand_path("templates", __dir__)

      class_option :sub_parts,
        type: :array,
        default: [],
        desc: "Sub-part names to generate (e.g. --sub-parts header footer)"

      def create_theme_file
        template "theme.rb.tt", File.join("app/themes", component_path_dir, "#{file_name}.rb")
      end

      def create_partial_file
        template "partial.html.erb.tt",
          File.join("app/views/components", component_path_dir, "_#{file_name}.html.erb")
      end

      def create_sub_part_files
        options[:sub_parts].each do |part|
          @current_part = part
          template "sub_part_theme.rb.tt",
            File.join("app/themes", component_path_dir, "#{file_name}_#{part}.rb")
          template "sub_part_partial.html.erb.tt",
            File.join("app/views/components", component_path_dir, file_name, "_#{part}.html.erb")
        end
      end

      private

      # @return [String] the current sub-part name being generated
      attr_reader :current_part

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
