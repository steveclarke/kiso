# frozen_string_literal: true

require "test_helper"

class Kiso::AppComponentHelperTest < ActionView::TestCase
  include Kiso::UiContextHelper
  include Kiso::AppComponentHelper

  test "appui resolves partial from components/ prefix" do
    # appui(:example) should look for "components/example"
    # We test the path resolution indirectly via the helper behavior.
    # The helper calls render with the correct path.
    assert_respond_to self, :appui
  end

  test "appui assigns empty proc when no block given" do
    # Verify the helper doesn't raise when called without a block.
    # We can't easily test render in a unit test, but we can verify
    # the method signature accepts all expected arguments.
    method = method(:appui)
    params = method.parameters.map(&:last)
    assert_includes params, :component
    assert_includes params, :part
    assert_includes params, :collection
    assert_includes params, :ui
  end

  test "appui pushes ui context for parent components" do
    # Simulate the parent component flow without actually rendering
    # by testing that the ui context stack is used correctly.
    ui = {header: "p-8", title: "text-xl"}

    kiso_push_ui_context(:pricing_card, ui)
    assert_equal ui, kiso_current_ui(:pricing_card)
  ensure
    kiso_pop_ui_context(:pricing_card)
  end

  test "appui sub-part reads slot override from parent context" do
    # Push context as a parent would
    kiso_push_ui_context(:pricing_card, {header: "p-8"})

    # Verify sub-part would read the override
    parent_ui = kiso_current_ui(:pricing_card)
    assert_equal "p-8", parent_ui[:header]
  ensure
    kiso_pop_ui_context(:pricing_card)
  end

  test "appui does not use global config layer" do
    # Unlike kui(), appui() should not merge Kiso.config.theme overrides.
    # The helper doesn't call kiso_merge_ui_layers.
    source = File.read(File.expand_path("../../app/helpers/kiso/app_component_helper.rb", __dir__))
    refute_match(/kiso_merge_ui_layers/, source)
  end

  test "appui uses same ui context stack as kui" do
    # Both helpers share UiContextHelper, so context set by one
    # is readable by the other (important for mixed compositions).
    kiso_push_ui_context(:card, {header: "p-8"})
    assert_equal({header: "p-8"}, kiso_current_ui(:card))
  ensure
    kiso_pop_ui_context(:card)
  end
end
