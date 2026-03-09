# frozen_string_literal: true

require "test_helper"

class Kiso::ScopeTest < ActiveSupport::TestCase
  include Kiso::UiContextHelper

  test "push and read scope for a component" do
    kiso_push_scope(:room_card, {room: "test_room"})
    assert_equal({room: "test_room"}, kiso_current_scope(:room_card))
  ensure
    kiso_pop_scope(:room_card)
  end

  test "current scope returns empty hash when nothing pushed" do
    assert_equal({}, kiso_current_scope(:room_card))
  end

  test "pop removes most recent scope" do
    kiso_push_scope(:room_card, {room: "first"})
    kiso_push_scope(:room_card, {room: "second"})

    kiso_pop_scope(:room_card)
    assert_equal({room: "first"}, kiso_current_scope(:room_card))
  ensure
    kiso_pop_scope(:room_card)
  end

  test "scope is isolated per component" do
    kiso_push_scope(:room_card, {room: "test"})
    assert_equal({}, kiso_current_scope(:other_component))
  ensure
    kiso_pop_scope(:room_card)
  end

  test "nil scope is treated as empty hash" do
    kiso_push_scope(:room_card, nil)
    assert_equal({}, kiso_current_scope(:room_card))
  ensure
    kiso_pop_scope(:room_card)
  end

  test "empty scope hash is valid" do
    kiso_push_scope(:room_card, {})
    assert_equal({}, kiso_current_scope(:room_card))
  ensure
    kiso_pop_scope(:room_card)
  end
end
