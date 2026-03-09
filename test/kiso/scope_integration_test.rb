# frozen_string_literal: true

require "test_helper"

class Kiso::ScopeIntegrationTest < ActionView::TestCase
  include Kiso::ComponentHelper
  include Kiso::AppComponentHelper
  include Kiso::UiContextHelper

  test "scope merges into parent partial kwargs" do
    task = {name: "Fix bug"}
    html = appui(:task_card, scope: {task: task}) { "content" }
    assert_includes html, 'data-slot="task-card"'
    assert_includes html, "content"
  end

  test "scope merges into sub-part kwargs" do
    task = {name: "Fix bug"}
    html = appui(:task_card, scope: {task: task}) do
      appui(:task_card, :title)
    end
    assert_includes html, "Fix bug"
    assert_includes html, 'data-slot="task-card-title"'
  end

  test "explicit kwargs override scope values" do
    task_from_scope = {name: "From scope"}
    task_override = {name: "Override"}
    html = appui(:task_card, scope: {task: task_from_scope}) do
      appui(:task_card, :title, task: task_override)
    end
    assert_includes html, "Override"
    refute_includes html, "From scope"
  end

  test "scope without sub-parts still works" do
    task = {name: "Solo"}
    html = appui(:task_card, scope: {task: task}) { "just content" }
    assert_includes html, "just content"
  end

  test "no scope still works (backward compatible)" do
    task = {name: "Direct"}
    html = appui(:task_card, task: task) { "direct" }
    assert_includes html, "direct"
  end
end
