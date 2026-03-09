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
