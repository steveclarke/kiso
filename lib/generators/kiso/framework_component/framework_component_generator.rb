# frozen_string_literal: true

module Kiso
  module Generators
    # Rails generator for scaffolding new Kiso engine components.
    #
    # This generator is for internal Kiso framework development only.
    # It is excluded from the gem — host app users should use
    # +kiso:component+ instead.
    #
    # Creates all files needed for a new engine component: theme module,
    # ERB partial, Lookbook preview, and docs page. Supports options for
    # colored variants, sub-parts, and Stimulus controllers.
    #
    # @example Basic component
    #   rails generate kiso:framework_component tooltip
    #
    # @example Colored component with sub-parts
    #   rails generate kiso:framework_component alert --colored --sub-parts title description close
    #
    # @example Component with Stimulus controller
    #   rails generate kiso:framework_component accordion --stimulus
    class FrameworkComponentGenerator < Rails::Generators::NamedBase
      source_root File.expand_path("templates", __dir__)

      class_option :colored, type: :boolean, default: false,
        desc: "Include two-axis color x variant compound variants"
      class_option :sub_parts, type: :array, default: [],
        desc: "Generate sub-part partials and theme entries"
      class_option :stimulus, type: :boolean, default: false,
        desc: "Generate a Stimulus controller stub"
      class_option :skip_docs, type: :boolean, default: false,
        desc: "Skip docs page generation"

      def verify_kiso_repo
        return if File.exist?(File.expand_path("kiso.gemspec", destination_root))

        say "This generator is for Kiso framework development only.", :red
        say "To scaffold a component for your app, use:", :red
        say "  bin/rails generate kiso:component #{file_name}", :yellow
        raise SystemExit
      end

      def create_theme_module
        template "theme.rb.tt", "lib/kiso/themes/#{file_name}.rb"
      end

      def create_erb_partial
        template "partial.html.erb.tt", "app/views/kiso/components/_#{file_name}.html.erb"
      end

      def create_sub_part_partials
        sub_parts.each do |part|
          @current_part = part
          template "sub_part_partial.html.erb.tt",
            "app/views/kiso/components/#{file_name}/_#{part}.html.erb"
        end
      end

      def create_lookbook_preview
        template "preview.rb.tt", "test/components/previews/kiso/#{file_name}_preview.rb"
      end

      def create_lookbook_preview_template
        template "preview_template.html.erb.tt",
          "test/components/previews/kiso/#{file_name}_preview/playground.html.erb"
      end

      def create_stimulus_controller
        return unless options[:stimulus]
        template "controller.js.tt",
          "app/javascript/controllers/kiso/#{file_name}_controller.js"
      end

      def create_docs_page
        return if options[:skip_docs]
        template "docs.md.tt", "docs/src/components/#{file_name}.md"
      end

      def print_reminders
        say ""
        say "Component '#{class_name}' scaffolded!", :green
        say ""
        say "Manual steps remaining:", :yellow
        say "  1. Add `require_relative \"themes/#{file_name}\"` to lib/kiso.rb"
        say "  2. Add entry to skills/kiso/references/components.md"
        say "  3. Add entry to docs/src/_data/navigation.yml (alphabetical)"
        say "  4. Add to COMPONENTS array in test/e2e/dark-mode.spec.js"
        say "  5. Set @logical_path in the Lookbook preview if grouping is needed (e.g., @logical_path kiso/form)"
        if options[:stimulus]
          say "  6. Register controller in app/javascript/controllers/kiso/index.js"
        end
        say ""
        say "Files created:", :cyan
        say "  Theme:   lib/kiso/themes/#{file_name}.rb"
        say "  Partial: app/views/kiso/components/_#{file_name}.html.erb"
        sub_parts.each do |part|
          say "  Sub-part: app/views/kiso/components/#{file_name}/_#{part}.html.erb"
        end
        say "  Preview: test/components/previews/kiso/#{file_name}_preview.rb"
        say "  Template: test/components/previews/kiso/#{file_name}_preview/playground.html.erb"
        if options[:stimulus]
          say "  Controller: app/javascript/controllers/kiso/#{file_name}_controller.js"
        end
        unless options[:skip_docs]
          say "  Docs:    docs/src/components/#{file_name}.md"
        end
        say ""
      end

      private

      # @return [String] the component name in PascalCase (e.g., "DropdownMenu")
      def class_name
        file_name.camelize
      end

      # @return [String] the component name in kebab-case for data-slot (e.g., "dropdown-menu")
      def slot_name
        file_name.dasherize
      end

      # @return [String] the component name as a human-readable title (e.g., "Dropdown Menu")
      def human_name
        file_name.titleize
      end

      # @return [Array<String>] the list of sub-parts to generate
      def sub_parts
        options[:sub_parts]
      end

      # @return [Boolean] whether this is a colored component
      def colored?
        options[:colored]
      end

      # @return [Boolean] whether to generate a Stimulus controller
      def stimulus?
        options[:stimulus]
      end
    end
  end
end
