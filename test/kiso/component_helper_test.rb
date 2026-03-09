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
end
