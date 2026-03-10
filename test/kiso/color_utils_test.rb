# frozen_string_literal: true

require "test_helper"

class Kiso::ColorUtilsTest < ActiveSupport::TestCase
  test "returns white for dark and saturated colors" do
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#000000")
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#1e3a5f")
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#7c3aed") # violet-600
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#dc2626") # red-600
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#ef4444") # red-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#3b82f6") # blue-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#ec4899") # pink-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#0ea5e9") # sky-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#22c55e") # green-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#10b981") # emerald-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#14b8a6") # teal-500
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#06b6d4") # cyan-500
  end

  test "returns black for light colors" do
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#ffffff")
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#eab308") # yellow-500
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#84cc16") # lime-500
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#f59e0b") # amber-500
  end

  test "handles 3-digit hex" do
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#000")
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#fff")
  end

  test "handles hex without hash" do
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("000000")
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("ffffff")
  end

  test "accepts custom threshold" do
    # emerald-500 luminance is ~0.364 — white at default 0.42, black at 0.36
    assert_equal "white", Kiso::ColorUtils.contrast_text_color("#10b981", threshold: 0.42)
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#10b981", threshold: 0.36)
  end

  test "uses global config threshold" do
    original = Kiso.config.contrast_threshold
    Kiso.config.contrast_threshold = 0.2
    # red-500 luminance is ~0.23 — white at default 0.42, black at 0.2
    assert_equal "black", Kiso::ColorUtils.contrast_text_color("#ef4444")
  ensure
    Kiso.config.contrast_threshold = original
  end
end
