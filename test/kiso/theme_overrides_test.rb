# frozen_string_literal: true

require "test_helper"

class Kiso::ThemeOverridesTest < ActiveSupport::TestCase
  setup do
    Kiso::ThemeOverrides.reset!
    Kiso.instance_variable_set(:@configuration, nil)
  end

  teardown do
    Kiso::ThemeOverrides.reset!
    Kiso.instance_variable_set(:@configuration, nil)
    reload_themes!
  end

  test "empty theme hash is a no-op" do
    assert_nothing_raised { Kiso::ThemeOverrides.apply! }
  end

  test "base override appends and TailwindMerge deduplicates" do
    # Button default base includes "rounded-md" (via size variants);
    # override base to rounded-full
    Kiso.config.theme[:badge] = {base: "rounded-full"}
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Badge.render(color: :primary, variant: :soft, size: :md)
    assert_includes result, "rounded-full"
  end

  test "variants override appends variant classes" do
    Kiso.config.theme[:button] = {variants: {size: {md: "h-10"}}}
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Button.render(color: :primary, variant: :solid, size: :md)
    # TailwindMerge keeps last: h-10 wins over h-9
    assert_includes result, "h-10"
    refute_includes result, "h-9"
  end

  test "defaults override changes default variant" do
    Kiso.config.theme[:button] = {defaults: {variant: :outline}}
    Kiso::ThemeOverrides.apply!

    # Render without specifying variant — should use outline (has "ring ring-inset")
    result = Kiso::Themes::Button.render(color: :primary, size: :md)
    assert_includes result, "ring"
  end

  test "compound_variants override appends new compounds" do
    # Add a custom compound variant for a specific color+variant combo
    Kiso.config.theme[:badge] = {
      compound_variants: [
        {color: :primary, variant: :solid, class: "shadow-lg"}
      ]
    }
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Badge.render(color: :primary, variant: :solid, size: :md)
    assert_includes result, "shadow-lg"
  end

  test "snake_case key maps to PascalCase constant" do
    Kiso.config.theme[:card_header] = {base: "p-8"}
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::CardHeader.render
    assert_includes result, "p-8"
  end

  test "multi-word snake_case key maps correctly" do
    Kiso.config.theme[:dropdown_menu_separator] = {base: "my-2"}
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::DropdownMenuSeparator.render
    assert_includes result, "my-2"
  end

  test "invalid key raises ArgumentError" do
    Kiso.config.theme[:nonexistent_widget] = {base: "foo"}

    error = assert_raises(ArgumentError) { Kiso::ThemeOverrides.apply! }
    assert_includes error.message, "Unknown theme key :nonexistent_widget"
  end

  test "typo key suggests closest match" do
    Kiso.config.theme[:buton] = {base: "rounded-full"}

    error = assert_raises(ArgumentError) { Kiso::ThemeOverrides.apply! }
    assert_includes error.message, "Did you mean :button?"
  end

  test "multiple overrides applied together" do
    Kiso.config.theme[:button] = {base: "tracking-wide"}
    Kiso.config.theme[:card] = {base: "overflow-hidden"}
    Kiso::ThemeOverrides.apply!

    button_result = Kiso::Themes::Button.render(color: :primary, variant: :solid, size: :md)
    card_result = Kiso::Themes::Card.render(variant: :outline)

    assert_includes button_result, "tracking-wide"
    assert_includes card_result, "overflow-hidden"
  end

  test "apply! is idempotent" do
    Kiso.config.theme[:badge] = {base: "shadow-lg"}
    Kiso::ThemeOverrides.apply!
    Kiso::ThemeOverrides.apply! # second call should be no-op

    result = Kiso::Themes::Badge.render(color: :primary, variant: :soft, size: :md)
    # shadow-lg should appear exactly once (not duplicated)
    assert_equal 1, result.scan("shadow-lg").length
  end

  private

  # Reload theme files to reset constants to their original definitions.
  # Suppresses "already initialized constant" warnings since we're
  # intentionally re-evaluating files to restore pristine state.
  def reload_themes!
    original_verbose = $VERBOSE
    $VERBOSE = nil
    %w[
      shared badge alert button card separator empty stats_card table
      pagination label field field_group field_set input textarea
      input_group checkbox radio_group switch breadcrumb toggle
      toggle_group select popover combobox command dropdown_menu kbd
    ].each do |name|
      load File.expand_path("../../lib/kiso/themes/#{name}.rb", __dir__)
    end
  ensure
    $VERBOSE = original_verbose
  end
end
