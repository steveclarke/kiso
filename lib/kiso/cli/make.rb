# frozen_string_literal: true

class Kiso::Cli::Make < Kiso::Cli::Base
  desc "component NAME", "Generate a new Kiso component"
  long_desc <<~DESC
    Generates all files for a new component:
      - Theme module (lib/kiso/themes/)
      - ERB partial (app/views/kiso/components/)
      - Lookbook preview + templates (test/components/previews/kiso/)
      - Updates lib/kiso.rb with require
      - Updates skills/kiso/references/components.md

    Example:
      $ bin/kiso make component alert
      $ bin/kiso make component toggle_group
  DESC
  option :colored, type: :boolean, default: true, desc: "Include color + variant axes (compound variants)"
  def component(name)
    @name = name.underscore
    @class_name = @name.camelize
    @colored = options[:colored]

    generate_theme
    generate_partial
    generate_preview
    generate_preview_templates
    update_requires
    update_skill_components

    say ""
    say "Component '#{@name}' created!", :green
    say ""
    say "Next steps:", :cyan
    say "  1. Edit lib/kiso/themes/#{@name}.rb — define variants"
    say "  2. Edit app/views/kiso/components/_#{@name}.html.erb — build the markup"
    say "  3. cd test/dummy && bin/rails tailwindcss:build"
    say "  4. Open http://localhost:4001/lookbook"
  end

  private

  def generate_theme
    if @colored
      write_file "lib/kiso/themes/#{@name}.rb", colored_theme_template
    else
      write_file "lib/kiso/themes/#{@name}.rb", simple_theme_template
    end
  end

  def generate_partial
    if @colored
      write_file "app/views/kiso/components/_#{@name}.html.erb", colored_partial_template
    else
      write_file "app/views/kiso/components/_#{@name}.html.erb", simple_partial_template
    end
  end

  def generate_preview
    if @colored
      write_file "test/components/previews/kiso/#{@name}_preview.rb", colored_preview_template
    else
      write_file "test/components/previews/kiso/#{@name}_preview.rb", simple_preview_template
    end
  end

  def generate_preview_templates
    write_file "test/components/previews/kiso/#{@name}_preview/playground.html.erb",
      playground_template

    if @colored
      write_file "test/components/previews/kiso/#{@name}_preview/colors.html.erb",
        colors_template
      write_file "test/components/previews/kiso/#{@name}_preview/variants.html.erb",
        variants_template
    end

    write_file "test/components/previews/kiso/#{@name}_preview/sizes.html.erb",
      sizes_template
  end

  def update_requires
    append_to_file "lib/kiso.rb", "require \"kiso/themes/#{@name}\""
  end

  def update_skill_components
    path = File.join(gem_root, "skills/kiso/references/components.md")
    return unless File.exist?(path)

    content = File.read(path)
    return if content.include?("### #{@class_name}")

    entry = if @colored
      <<~MD

        ### #{@class_name}

        **Locals:** `color:`, `variant:` (solid, outline, soft, subtle), `size:` (sm, md, lg), `css_classes:`, `**component_options`

        **Defaults:** `color: :primary, variant: :soft, size: :md`

        ```erb
        <%%= kiso(:#{@name}, color: :primary, variant: :soft) { "Label" } %>
        ```

        **Theme module:** `Kiso::Themes::#{@class_name}` (`lib/kiso/themes/#{@name}.rb`)
      MD
    else
      <<~MD

        ### #{@class_name}

        **Locals:** `variant:`, `size:` (sm, md, lg), `css_classes:`, `**component_options`

        **Defaults:** `variant: :default, size: :md`

        ```erb
        <%%= kiso(:#{@name}) { "Label" } %>
        ```

        **Theme module:** `Kiso::Themes::#{@class_name}` (`lib/kiso/themes/#{@name}.rb`)
      MD
    end

    File.write(path, content.rstrip + "\n" + entry)
    say "  update  skills/kiso/references/components.md", :green
  end

  # -- Theme templates --

  def colored_theme_template
    <<~RUBY
      module Kiso
        module Themes
          #{@class_name} = ClassVariants.build(
            base: "",
            variants: {
              variant: {
                solid: "",
                outline: "ring ring-inset",
                soft: "",
                subtle: "ring ring-inset"
              },
              size: {
                sm: "",
                md: "",
                lg: ""
              },
              color: COLORS.index_with { "" }
            },
            compound_variants: [
              # -- solid --
              { color: :primary, variant: :solid, class: "bg-primary text-primary-foreground" },
              { color: :secondary, variant: :solid, class: "bg-secondary text-secondary-foreground" },
              { color: :success, variant: :solid, class: "bg-success text-success-foreground" },
              { color: :info, variant: :solid, class: "bg-info text-info-foreground" },
              { color: :warning, variant: :solid, class: "bg-warning text-warning-foreground" },
              { color: :error, variant: :solid, class: "bg-error text-error-foreground" },
              { color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground" },

              # -- outline --
              { color: :primary, variant: :outline, class: "text-primary ring-primary/50" },
              { color: :secondary, variant: :outline, class: "text-secondary ring-secondary/50" },
              { color: :success, variant: :outline, class: "text-success ring-success/50" },
              { color: :info, variant: :outline, class: "text-info ring-info/50" },
              { color: :warning, variant: :outline, class: "text-warning ring-warning/50" },
              { color: :error, variant: :outline, class: "text-error ring-error/50" },
              { color: :neutral, variant: :outline, class: "ring-accented text-foreground bg-background" },

              # -- soft --
              { color: :primary, variant: :soft, class: "bg-primary/10 text-primary" },
              { color: :secondary, variant: :soft, class: "bg-secondary/10 text-secondary" },
              { color: :success, variant: :soft, class: "bg-success/10 text-success" },
              { color: :info, variant: :soft, class: "bg-info/10 text-info" },
              { color: :warning, variant: :soft, class: "bg-warning/10 text-warning" },
              { color: :error, variant: :soft, class: "bg-error/10 text-error" },
              { color: :neutral, variant: :soft, class: "text-foreground bg-elevated" },

              # -- subtle --
              { color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25" },
              { color: :secondary, variant: :subtle, class: "bg-secondary/10 text-secondary ring-secondary/25" },
              { color: :success, variant: :subtle, class: "bg-success/10 text-success ring-success/25" },
              { color: :info, variant: :subtle, class: "bg-info/10 text-info ring-info/25" },
              { color: :warning, variant: :subtle, class: "bg-warning/10 text-warning ring-warning/25" },
              { color: :error, variant: :subtle, class: "bg-error/10 text-error ring-error/25" },
              { color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented" }
            ],
            defaults: { color: :primary, variant: :soft, size: :md }
          )
        end
      end
    RUBY
  end

  def simple_theme_template
    <<~RUBY
      module Kiso
        module Themes
          #{@class_name} = ClassVariants.build(
            base: "",
            variants: {
              variant: {
                default: ""
              },
              size: {
                sm: "",
                md: "",
                lg: ""
              }
            },
            defaults: { variant: :default, size: :md }
          )
        end
      end
    RUBY
  end

  # -- Partial templates --

  def colored_partial_template
    <<~ERB
      <%# locals: (color: :primary, variant: :soft, size: :md, css_classes: "", **component_options) %>
      <%= content_tag :div,
          class: Kiso::Themes::#{@class_name}.render(color: color, variant: variant, size: size, class: css_classes),
          data: kiso_prepare_options(component_options, component: :#{@name}),
          **component_options do %>
        <%= yield %>
      <% end %>
    ERB
  end

  def simple_partial_template
    <<~ERB
      <%# locals: (variant: :default, size: :md, css_classes: "", **component_options) %>
      <%= content_tag :div,
          class: Kiso::Themes::#{@class_name}.render(variant: variant, size: size, class: css_classes),
          data: kiso_prepare_options(component_options, component: :#{@name}),
          **component_options do %>
        <%= yield %>
      <% end %>
    ERB
  end

  # -- Preview templates --

  def colored_preview_template
    <<~RUBY
      module Kiso
        # @label #{@class_name}
        class #{@class_name}Preview < Lookbook::Preview
          # @label Playground
          # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
          # @param variant select { choices: [solid, outline, soft, subtle] }
          # @param size select { choices: [sm, md, lg] }
          # @param text text "#{@class_name}"
          def playground(color: :primary, variant: :soft, size: :md, text: "#{@class_name}")
            render_with_template(locals: {
              color: color.to_sym,
              variant: variant.to_sym,
              size: size.to_sym,
              text: text
            })
          end

          # @label Colors
          def colors
            render_with_template
          end

          # @label Variants
          def variants
            render_with_template
          end

          # @label Sizes
          def sizes
            render_with_template
          end
        end
      end
    RUBY
  end

  def simple_preview_template
    <<~RUBY
      module Kiso
        # @label #{@class_name}
        class #{@class_name}Preview < Lookbook::Preview
          # @label Playground
          # @param variant select { choices: [default] }
          # @param size select { choices: [sm, md, lg] }
          # @param text text "#{@class_name}"
          def playground(variant: :default, size: :md, text: "#{@class_name}")
            render_with_template(locals: {
              variant: variant.to_sym,
              size: size.to_sym,
              text: text
            })
          end

          # @label Sizes
          def sizes
            render_with_template
          end
        end
      end
    RUBY
  end

  def playground_template
    if @colored
      <<~ERB
        <div class="flex gap-4 items-center p-8">
          <%%= kiso(:#{@name}, color: color, variant: variant, size: size) { text } %>
        </div>
      ERB
    else
      <<~ERB
        <div class="flex gap-4 items-center p-8">
          <%%= kiso(:#{@name}, variant: variant, size: size) { text } %>
        </div>
      ERB
    end
  end

  def colors_template
    colors = %w[primary secondary success info warning error neutral]
    lines = colors.map { |c| "  <%%= kiso(:#{@name}, color: :#{c}) { \"#{c.capitalize}\" } %>" }

    <<~ERB
      <div class="flex flex-wrap gap-3 items-center p-8">
      #{lines.join("\n")}
      </div>
    ERB
  end

  def variants_template
    variants = %w[solid outline soft subtle]
    colors = %w[primary secondary success info warning error neutral]

    sections = variants.map do |v|
      lines = colors.map { |c| "    <%%= kiso(:#{@name}, color: :#{c}, variant: :#{v}) { \"#{c.capitalize}\" } %>" }
      <<~SECTION
        <div>
          <p class="text-sm text-muted-foreground mb-2">#{v.capitalize}</p>
          <div class="flex flex-wrap gap-3 items-center">
        #{lines.join("\n")}
          </div>
        </div>
      SECTION
    end

    <<~ERB
      <div class="space-y-6 p-8">
      #{sections.join("\n")}
      </div>
    ERB
  end

  def sizes_template
    sizes = %w[sm md lg]
    lines = sizes.map { |s| "  <%%= kiso(:#{@name}, size: :#{s}) { \"#{s.capitalize}\" } %>" }

    <<~ERB
      <div class="flex gap-4 items-center p-8">
      #{lines.join("\n")}
      </div>
    ERB
  end
end
