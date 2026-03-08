# frozen_string_literal: true

require "test_helper"

class Kiso::ApplyPresetTest < ActiveSupport::TestCase
  setup do
    Kiso::ThemeOverrides.reset!
    Kiso.instance_variable_set(:@configuration, nil)
  end

  teardown do
    Kiso::ThemeOverrides.reset!
    Kiso.instance_variable_set(:@configuration, nil)
    reload_themes!
  end

  test "apply_preset populates config.theme" do
    Kiso.configure do |c|
      c.apply_preset(:rounded)
    end

    assert Kiso.config.theme.key?(:button)
    assert Kiso.config.theme.key?(:card)
  end

  test "apply_preset(:rounded) makes buttons rounded-full" do
    Kiso.configure do |c|
      c.apply_preset(:rounded)
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Button.render(color: :primary, variant: :solid, size: :md)
    assert_includes result, "rounded-full"
    refute_includes result, "rounded-md"
  end

  test "apply_preset(:rounded) makes cards rounded-2xl" do
    Kiso.configure do |c|
      c.apply_preset(:rounded)
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Card.render(variant: :outline)
    assert_includes result, "rounded-2xl"
    refute_includes result, "rounded-xl"
  end

  test "apply_preset(:sharp) makes buttons rounded-none" do
    Kiso.configure do |c|
      c.apply_preset(:sharp)
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Button.render(color: :primary, variant: :solid, size: :md)
    assert_includes result, "rounded-none"
    refute_includes result, "rounded-md"
  end

  test "apply_preset(:sharp) makes cards rounded-none" do
    Kiso.configure do |c|
      c.apply_preset(:sharp)
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Card.render(variant: :outline)
    assert_includes result, "rounded-none"
    refute_includes result, "rounded-xl"
  end

  test "apply_preset(:sharp) makes badges rounded-none" do
    Kiso.configure do |c|
      c.apply_preset(:sharp)
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Badge.render(color: :primary, variant: :soft, size: :md)
    assert_includes result, "rounded-none"
    refute_includes result, "rounded-full"
  end

  test "per-component overrides take priority over preset" do
    Kiso.configure do |c|
      c.apply_preset(:rounded)
      c.theme[:card] = {base: "rounded-3xl"}
    end
    Kiso::ThemeOverrides.apply!

    result = Kiso::Themes::Card.render(variant: :outline)
    assert_includes result, "rounded-3xl"
  end

  test "apply_preset raises for unknown preset" do
    assert_raises(ArgumentError) do
      Kiso.configure do |c|
        c.apply_preset(:nonexistent)
      end
    end
  end

  test "apply_preset merges with existing theme overrides" do
    Kiso.configure do |c|
      c.theme[:button] = {base: "shadow-lg"}
      c.apply_preset(:rounded)
    end

    # Shadow should still be present (merged, not replaced)
    assert_equal "shadow-lg", Kiso.config.theme[:button][:base]
    # Rounded variant override from preset should also be present
    assert Kiso.config.theme[:button][:variants]
  end

  private

  def reload_themes!
    original_verbose = $VERBOSE
    $VERBOSE = nil
    Dir[File.expand_path("../../lib/kiso/themes/*.rb", __dir__)].each { |f| load f }
  ensure
    $VERBOSE = original_verbose
  end
end
