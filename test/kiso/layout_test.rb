# frozen_string_literal: true

require "test_helper"

class Kiso::LayoutTest < ActiveSupport::TestCase
  test "App renders base classes by default" do
    result = Kiso::Themes::App.render
    assert_includes result, "bg-background"
    assert_includes result, "text-foreground"
    refute_includes result, "min-h-screen"
  end

  test "App renders centering classes when center: true" do
    result = Kiso::Themes::App.render(center: true)
    assert_includes result, "min-h-screen"
    assert_includes result, "flex"
    assert_includes result, "items-center"
    assert_includes result, "justify-center"
  end

  test "App does not render centering classes when center: false" do
    result = Kiso::Themes::App.render(center: false)
    refute_includes result, "min-h-screen"
    refute_includes result, "items-center"
  end
end
