# frozen_string_literal: true

require "test_helper"
require "rails/generators/test_case"
require "generators/kiso/component/component_generator"

class Kiso::Generators::ComponentGeneratorTest < Rails::Generators::TestCase
  tests Kiso::Generators::ComponentGenerator
  destination File.expand_path("../tmp", __dir__)

  setup do
    prepare_destination

    # Create minimal directory structure expected by templates
    FileUtils.mkdir_p(File.join(destination_root, "lib/kiso/themes"))
    FileUtils.mkdir_p(File.join(destination_root, "app/views/kiso/components"))
    FileUtils.mkdir_p(File.join(destination_root, "test/components/previews/kiso"))
    FileUtils.mkdir_p(File.join(destination_root, "docs/src/components"))
    FileUtils.mkdir_p(File.join(destination_root, "app/javascript/controllers/kiso"))
  end

  # -- basic component ---------------------------------------------------

  test "generates theme module" do
    run_generator ["tooltip"]
    assert_file "lib/kiso/themes/tooltip.rb" do |content|
      assert_match(/module Kiso/, content)
      assert_match(/module Themes/, content)
      assert_match(/Tooltip = ClassVariants\.build/, content)
      assert_match(/base: "text-foreground"/, content)
      assert_no_match(/compound_variants/, content)
      assert_no_match(/COLORS/, content)
    end
  end

  test "generates ERB partial" do
    run_generator ["tooltip"]
    assert_file "app/views/kiso/components/_tooltip.html.erb" do |content|
      assert_match(/locals:/, content)
      assert_match(/css_classes: ""/, content)
      assert_match(/\*\*component_options/, content)
      assert_match(/Kiso::Themes::Tooltip\.render/, content)
      assert_match(/slot: "tooltip"/, content)
      assert_no_match(/color:/, content)
      assert_no_match(/variant:/, content)
    end
  end

  test "generates Lookbook preview" do
    run_generator ["tooltip"]
    assert_file "test/components/previews/kiso/tooltip_preview.rb" do |content|
      assert_match(/class TooltipPreview < Lookbook::Preview/, content)
      assert_match(/def playground/, content)
      assert_no_match(/color/, content)
    end
  end

  test "generates Lookbook preview template" do
    run_generator ["tooltip"]
    assert_file "test/components/previews/kiso/tooltip_preview/playground.html.erb" do |content|
      assert_match(/kui\(:tooltip\)/, content)
    end
  end

  test "generates docs page" do
    run_generator ["tooltip"]
    assert_file "docs/src/components/tooltip.md" do |content|
      assert_match(/title: Tooltip/, content)
      assert_match(/layout: docs/, content)
      assert_match(/source: lib\/kiso\/themes\/tooltip\.rb/, content)
      assert_match(/kui\(:tooltip\)/, content)
    end
  end

  test "does not generate Stimulus controller by default" do
    run_generator ["tooltip"]
    assert_no_file "app/javascript/controllers/kiso/tooltip_controller.js"
  end

  test "does not generate sub-part partials by default" do
    run_generator ["tooltip"]
    assert_no_directory "app/views/kiso/components/tooltip"
  end

  # -- colored component --------------------------------------------------

  test "colored option generates compound variants" do
    run_generator ["notification", "--colored"]
    assert_file "lib/kiso/themes/notification.rb" do |content|
      assert_match(/COLORS\.index_with/, content)
      assert_match(/compound_variants/, content)
      assert_match(/bg-primary text-primary-foreground/, content)
      assert_match(/bg-inverted text-inverted-foreground/, content)
      assert_match(/text-primary ring-primary\/50/, content)
      assert_match(/bg-primary\/10 text-primary/, content)
      assert_match(/bg-primary\/10 text-primary ring-primary\/25/, content)
      assert_match(/text-foreground bg-elevated ring-accented/, content)
      assert_match(/defaults: \{color: :primary, variant: :soft\}/, content)
    end
  end

  test "colored partial includes color and variant locals" do
    run_generator ["notification", "--colored"]
    assert_file "app/views/kiso/components/_notification.html.erb" do |content|
      assert_match(/color: :primary, variant: :soft/, content)
      assert_match(/color: color, variant: variant/, content)
    end
  end

  test "colored preview includes color and variant params" do
    run_generator ["notification", "--colored"]
    assert_file "test/components/previews/kiso/notification_preview.rb" do |content|
      assert_match(/@param color select/, content)
      assert_match(/@param variant select/, content)
      assert_match(/color: color\.to_sym/, content)
    end
  end

  test "colored docs page includes color and variant locals table" do
    run_generator ["notification", "--colored"]
    assert_file "docs/src/components/notification.md" do |content|
      assert_match(/`color:`/, content)
      assert_match(/`variant:`/, content)
    end
  end

  # -- sub-parts -----------------------------------------------------------

  test "sub-parts option generates sub-part partials" do
    run_generator ["panel", "--sub-parts", "header", "content", "footer"]

    assert_file "app/views/kiso/components/panel/_header.html.erb" do |content|
      assert_match(/Kiso::Themes::PanelHeader\.render/, content)
      assert_match(/slot: "panel-header"/, content)
    end

    assert_file "app/views/kiso/components/panel/_content.html.erb" do |content|
      assert_match(/Kiso::Themes::PanelContent\.render/, content)
      assert_match(/slot: "panel-content"/, content)
    end

    assert_file "app/views/kiso/components/panel/_footer.html.erb" do |content|
      assert_match(/Kiso::Themes::PanelFooter\.render/, content)
      assert_match(/slot: "panel-footer"/, content)
    end
  end

  test "sub-parts option generates theme entries" do
    run_generator ["panel", "--sub-parts", "header", "footer"]
    assert_file "lib/kiso/themes/panel.rb" do |content|
      assert_match(/PanelHeader = ClassVariants\.build/, content)
      assert_match(/PanelFooter = ClassVariants\.build/, content)
    end
  end

  test "sub-parts adds ui local to root partial" do
    run_generator ["panel", "--sub-parts", "header"]
    assert_file "app/views/kiso/components/_panel.html.erb" do |content|
      assert_match(/ui: \{\}/, content)
    end
  end

  test "sub-parts docs page includes sub-parts table" do
    run_generator ["panel", "--sub-parts", "header", "footer"]
    assert_file "docs/src/components/panel.md" do |content|
      assert_match(/Sub-parts/, content)
      assert_match(/`:header`/, content)
      assert_match(/`:footer`/, content)
      assert_match(/kui\(:panel, :header\)/, content)
    end
  end

  # -- stimulus ------------------------------------------------------------

  test "stimulus option generates controller" do
    run_generator ["accordion", "--stimulus"]
    assert_file "app/javascript/controllers/kiso/accordion_controller.js" do |content|
      assert_match(/import \{ Controller \} from "@hotwired\/stimulus"/, content)
      assert_match(/kiso--accordion/, content)
      assert_match(/data-slot="accordion"/, content)
      assert_match(/connect\(\)/, content)
    end
  end

  # -- skip-docs -----------------------------------------------------------

  test "skip-docs option skips docs page" do
    run_generator ["tooltip", "--skip-docs"]
    assert_no_file "docs/src/components/tooltip.md"
  end

  # -- multi-word names ----------------------------------------------------

  test "multi-word component name uses correct casing" do
    run_generator ["dropdown_menu"]
    assert_file "lib/kiso/themes/dropdown_menu.rb" do |content|
      assert_match(/DropdownMenu = ClassVariants\.build/, content)
    end
    assert_file "app/views/kiso/components/_dropdown_menu.html.erb" do |content|
      assert_match(/slot: "dropdown-menu"/, content)
    end
  end

  test "multi-word sub-part name uses correct casing" do
    run_generator ["dropdown_menu", "--sub-parts", "trigger", "item_group"]
    assert_file "lib/kiso/themes/dropdown_menu.rb" do |content|
      assert_match(/DropdownMenuTrigger = ClassVariants\.build/, content)
      assert_match(/DropdownMenuItemGroup = ClassVariants\.build/, content)
    end
  end

  # -- combined options ----------------------------------------------------

  test "all options combined" do
    run_generator ["notification", "--colored", "--sub-parts", "title", "description", "--stimulus"]

    assert_file "lib/kiso/themes/notification.rb"
    assert_file "app/views/kiso/components/_notification.html.erb"
    assert_file "app/views/kiso/components/notification/_title.html.erb"
    assert_file "app/views/kiso/components/notification/_description.html.erb"
    assert_file "test/components/previews/kiso/notification_preview.rb"
    assert_file "test/components/previews/kiso/notification_preview/playground.html.erb"
    assert_file "app/javascript/controllers/kiso/notification_controller.js"
    assert_file "docs/src/components/notification.md"
  end
end
