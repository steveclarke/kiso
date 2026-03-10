# frozen_string_literal: true

require "test_helper"

class Kiso::ComponentHelperTest < ActionView::TestCase
  include Kiso::ComponentHelper

  test "kui accepts scope: parameter" do
    method = method(:kui)
    params = method.parameters.map(&:last)
    assert_includes params, :scope
  end

  test "kui_tag is available as a helper" do
    assert_respond_to self, :kui_tag
  end

  test "kui_tag renders HTML element with block" do
    theme = ClassVariants.build(base: "text-red")
    html = kui_tag(:span, theme: theme, slot: "badge") { "Hello" }
    assert_includes html, "<span"
    assert_includes html, 'data-slot="badge"'
    assert_includes html, "text-red"
    assert_includes html, "Hello"
    assert_includes html, "</span>"
  end

  test "kui_tag renders self-closing element without block" do
    theme = ClassVariants.build(base: "size-2 rounded-full")
    html = kui_tag(:span, theme: theme, slot: "dot")
    assert_includes html, "<span"
    assert_includes html, 'data-slot="dot"'
    assert_includes html, "size-2"
    assert_includes html, "</span>"
  end

  test "kui_tag passes variants to theme render" do
    theme = ClassVariants.build(
      base: "shrink-0",
      variants: {status: {active: "bg-success", ended: "bg-muted"}},
      defaults: {status: :active}
    )
    html = kui_tag(:span, theme: theme, slot: "dot", variants: {status: :ended}) { "" }
    assert_includes html, "bg-muted"
    refute_includes html, "bg-success"
  end

  test "kui_tag merges css_classes" do
    theme = ClassVariants.build(base: "p-4")
    html = kui_tag(:div, theme: theme, slot: "box", css_classes: "mt-2") { "" }
    assert_includes html, "mt-2"
  end

  test "kui_tag forwards component_options as HTML attributes" do
    theme = ClassVariants.build(base: "")
    html = kui_tag(:div, theme: theme, slot: "box", id: "my-id") { "" }
    assert_includes html, 'id="my-id"'
  end

  # --- kiso_prepare_options ---

  test "kiso_prepare_options sets data-slot" do
    opts = {}
    result = kiso_prepare_options(opts, slot: "badge")
    assert_equal "badge", result[:slot]
  end

  test "kiso_prepare_options merges user data attributes" do
    opts = {data: {turbo_frame: "results"}}
    result = kiso_prepare_options(opts, slot: "badge")
    assert_equal "results", result[:turbo_frame]
    assert_equal "badge", result[:slot]
  end

  test "kiso_prepare_options concatenates data-action from user and component" do
    opts = {data: {action: "click->my-controller#doThing"}}
    result = kiso_prepare_options(opts, slot: "item", action: "click->kiso--dropdown-menu#selectItem")
    assert_equal "click->my-controller#doThing click->kiso--dropdown-menu#selectItem", result[:action]
  end

  test "kiso_prepare_options concatenates data-controller from user and component" do
    opts = {data: {controller: "my-controller"}}
    result = kiso_prepare_options(opts, slot: "widget", controller: "kiso--toggle")
    assert_equal "my-controller kiso--toggle", result[:controller]
  end

  test "kiso_prepare_options preserves user-only data-action" do
    opts = {data: {action: "click->my-controller#doThing"}}
    result = kiso_prepare_options(opts, slot: "item")
    assert_equal "click->my-controller#doThing", result[:action]
  end

  test "kiso_prepare_options preserves component-only data-action" do
    opts = {}
    result = kiso_prepare_options(opts, slot: "item", action: "click->kiso--dropdown-menu#selectItem")
    assert_equal "click->kiso--dropdown-menu#selectItem", result[:action]
  end

  test "kiso_prepare_options user data attributes do not overwrite component defaults" do
    opts = {data: {slot: "custom", turbo_frame: "results"}}
    result = kiso_prepare_options(opts, slot: "badge")
    # Component's slot wins (merged on top)
    assert_equal "badge", result[:slot]
    assert_equal "results", result[:turbo_frame]
  end

  test "kiso_prepare_options raises on class: key" do
    assert_raises(ArgumentError) do
      kiso_prepare_options({class: "foo"}, slot: "badge")
    end
  end

  # --- kui_tag (continued) ---

  test "kui_tag does not leak variant keys into HTML attributes" do
    theme = ClassVariants.build(
      base: "shrink-0",
      variants: {status: {active: "bg-success"}},
      defaults: {status: :active}
    )
    html = kui_tag(:span, theme: theme, slot: "dot", variants: {status: :active})
    refute_includes html, "status"
  end
end
