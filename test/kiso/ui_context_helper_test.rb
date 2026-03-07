# frozen_string_literal: true

require "test_helper"

class Kiso::UiContextHelperTest < ActiveSupport::TestCase
  include Kiso::UiContextHelper

  test "kiso_current_ui returns empty hash when no context pushed" do
    assert_equal({}, kiso_current_ui(:card))
  end

  test "push and read ui context" do
    kiso_push_ui_context(:card, {header: "p-8", title: "text-xl"})
    assert_equal({header: "p-8", title: "text-xl"}, kiso_current_ui(:card))
  ensure
    kiso_pop_ui_context(:card)
  end

  test "pop removes most recent context" do
    kiso_push_ui_context(:card, {header: "p-8"})
    kiso_pop_ui_context(:card)
    assert_equal({}, kiso_current_ui(:card))
  end

  test "nested contexts stack correctly" do
    kiso_push_ui_context(:card, {header: "p-8"})
    kiso_push_ui_context(:card, {header: "p-4"})

    assert_equal({header: "p-4"}, kiso_current_ui(:card))

    kiso_pop_ui_context(:card)
    assert_equal({header: "p-8"}, kiso_current_ui(:card))
  ensure
    kiso_pop_ui_context(:card)
  end

  test "different components have independent stacks" do
    kiso_push_ui_context(:card, {header: "p-8"})
    kiso_push_ui_context(:alert, {close: "opacity-50"})

    assert_equal({header: "p-8"}, kiso_current_ui(:card))
    assert_equal({close: "opacity-50"}, kiso_current_ui(:alert))
  ensure
    kiso_pop_ui_context(:card)
    kiso_pop_ui_context(:alert)
  end

  test "nil ui is treated as empty hash" do
    kiso_push_ui_context(:card, nil)
    assert_equal({}, kiso_current_ui(:card))
  ensure
    kiso_pop_ui_context(:card)
  end

  test "empty ui hash is valid" do
    kiso_push_ui_context(:card, {})
    assert_equal({}, kiso_current_ui(:card))
  ensure
    kiso_pop_ui_context(:card)
  end
end
