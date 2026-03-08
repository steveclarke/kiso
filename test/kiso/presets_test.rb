# frozen_string_literal: true

require "test_helper"

class Kiso::PresetsTest < ActiveSupport::TestCase
  test "load returns a hash for :rounded" do
    preset = Kiso::Presets.load(:rounded)
    assert_kind_of Hash, preset
    assert preset.key?(:button)
    assert preset.key?(:card)
  end

  test "load returns a hash for :sharp" do
    preset = Kiso::Presets.load(:sharp)
    assert_kind_of Hash, preset
    assert preset.key?(:button)
    assert preset.key?(:card)
  end

  test "load accepts string names" do
    preset = Kiso::Presets.load("rounded")
    assert_kind_of Hash, preset
  end

  test "load raises ArgumentError for unknown preset" do
    error = assert_raises(ArgumentError) { Kiso::Presets.load(:nonexistent) }
    assert_includes error.message, "Unknown preset :nonexistent"
    assert_includes error.message, "Available presets:"
    assert_includes error.message, ":rounded"
  end

  test "available_presets returns sorted list" do
    presets = Kiso::Presets.available_presets
    assert_includes presets, :rounded
    assert_includes presets, :sharp
    assert_equal presets, presets.sort
  end

  test "rounded preset keys all map to valid theme constants" do
    preset = Kiso::Presets.load(:rounded)
    preset.each_key do |key|
      name = key.to_s.split("_").map(&:capitalize).join
      assert Kiso::Themes.const_defined?(name),
        "Rounded preset key :#{key} does not map to Kiso::Themes::#{name}"
      assert_kind_of ClassVariants::Instance, Kiso::Themes.const_get(name),
        "Kiso::Themes::#{name} is not a ClassVariants::Instance"
    end
  end

  test "sharp preset keys all map to valid theme constants" do
    preset = Kiso::Presets.load(:sharp)
    preset.each_key do |key|
      name = key.to_s.split("_").map(&:capitalize).join
      assert Kiso::Themes.const_defined?(name),
        "Sharp preset key :#{key} does not map to Kiso::Themes::#{name}"
      assert_kind_of ClassVariants::Instance, Kiso::Themes.const_get(name),
        "Kiso::Themes::#{name} is not a ClassVariants::Instance"
    end
  end
end
