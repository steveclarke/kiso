# frozen_string_literal: true

module Kiso
  module Generators
    # Sets up Kiso in a host application.
    #
    # Creates a well-commented initializer and optionally generates a
    # design system document. No required arguments — interactive prompts
    # handle optional inputs.
    #
    # @example Interactive (default)
    #   bin/rails generate kiso:install
    #
    # @example Non-interactive
    #   bin/rails generate kiso:install --no-skip-design-system --app-name="Outport"
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      class_option :skip_design_system,
        type: :boolean,
        default: nil,
        desc: "Skip generating DESIGN_SYSTEM.md (default: ask interactively)"

      class_option :app_name,
        type: :string,
        default: nil,
        desc: "App name for the design system doc header (default: ask interactively)"

      def create_initializer
        initializer_path = "config/initializers/kiso.rb"
        if File.exist?(File.join(destination_root, initializer_path))
          say_status :skip, initializer_path, :yellow
        else
          template "initializer.rb.tt", initializer_path
          @initializer_created = true
        end
      end

      def create_design_system
        should_generate = case options[:skip_design_system]
        when true then false
        when false then true
        else
          say ""
          say "Would you like to generate a Design System document? This creates DESIGN_SYSTEM.md with your app's spacing, typography, color, and component conventions — useful for team alignment and AI coding agents."
          say ""
          yes?("Generate DESIGN_SYSTEM.md? (y/n)")
        end

        return unless should_generate

        @app_name = resolve_app_name
        template "design_system.md.tt", "DESIGN_SYSTEM.md"
        @design_system_created = true
      end

      def print_next_steps
        return unless @initializer_created || @design_system_created

        say ""
        say "Kiso installed!", :green
        say ""
        say "  Initializer: config/initializers/kiso.rb" if @initializer_created
        say "  Design System: DESIGN_SYSTEM.md" if @design_system_created
        say ""
        say "Next steps:"
        say "  1. Add Kiso's CSS to your Tailwind stylesheet:"
        say '       @import "../builds/tailwind/kiso";'
        say "  2. Add the theme script to your layout <head>:"
        say "       <%%= kiso_theme_script %>"
        say "  3. Customize your brand colors in your Tailwind @theme block."
        say "     See: https://kisoui.com/guide/css-variables"
        say ""
      end

      private

      def resolve_app_name
        return options[:app_name] if options[:app_name].present?
        return "My App" if options[:skip_design_system] == false

        say 'What\'s your app called? This is just a friendly name for the document header (e.g. "Outport", "My App").'
        response = ask("App name [My App]:")
        response.presence || "My App"
      end
    end
  end
end
