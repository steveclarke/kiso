# frozen_string_literal: true

require "test_helper"

class Kiso::ConfigurationTest < ActiveSupport::TestCase
  setup do
    @config = Kiso::Configuration.new
  end

  test "default icons include chevron_right" do
    assert_equal "chevron-right", @config.icons[:chevron_right]
  end

  test "default icons include chevron_left" do
    assert_equal "chevron-left", @config.icons[:chevron_left]
  end

  test "default icons include ellipsis" do
    assert_equal "ellipsis", @config.icons[:ellipsis]
  end

  test "icons are overridable" do
    @config.icons[:chevron_right] = "heroicons:chevron-right"
    assert_equal "heroicons:chevron-right", @config.icons[:chevron_right]
  end

  test "Kiso.configure yields configuration" do
    Kiso.configure do |c|
      c.icons[:chevron_right] = "custom-arrow"
    end
    assert_equal "custom-arrow", Kiso.config.icons[:chevron_right]
  ensure
    Kiso.instance_variable_set(:@configuration, nil)
  end

  test "Kiso.config is an alias for Kiso.configuration" do
    assert_same Kiso.configuration, Kiso.config
  ensure
    Kiso.instance_variable_set(:@configuration, nil)
  end

  test "theme defaults to empty hash" do
    assert_equal({}, @config.theme)
  end

  test "theme accepts component overrides" do
    @config.theme[:button] = {base: "rounded-full"}
    assert_equal({base: "rounded-full"}, @config.theme[:button])
  end
end
