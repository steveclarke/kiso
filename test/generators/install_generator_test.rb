# frozen_string_literal: true

require "test_helper"
require "generators/kiso/install/install_generator"
require "rails/generators/test_case"

class Kiso::Generators::InstallGeneratorTest < Rails::Generators::TestCase
  tests Kiso::Generators::InstallGenerator
  destination File.expand_path("../tmp/generator_test", __dir__)

  setup do
    prepare_destination
  end

  test "creates initializer with Kiso.configure block" do
    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/Kiso\.configure do \|config\|/, content)
    end
  end

  test "initializer includes preset examples" do
    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/apply_preset/, content)
      assert_match(/:rounded/, content)
      assert_match(/:sharp/, content)
    end
  end

  test "initializer includes theme override examples" do
    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/config\.theme\[:button\]/, content)
    end
  end

  test "initializer includes icon customization examples" do
    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/config\.icons/, content)
    end
  end

  test "initializer includes app_theme example" do
    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/app_theme/, content)
    end
  end

  test "skips initializer when it already exists" do
    run_generator ["--skip-design-system"]
    File.write(File.join(destination_root, "config/initializers/kiso.rb"), "# existing")

    run_generator ["--skip-design-system"]

    assert_file "config/initializers/kiso.rb" do |content|
      assert_equal "# existing", content
    end
  end

  test "creates design system doc with app name" do
    run_generator ["--no-skip-design-system", "--app-name=TestApp"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/TestApp/, content)
      assert_match(/Color Palette/, content)
      assert_match(/Typography/, content)
      assert_match(/Spacing/, content)
      assert_match(/Component Conventions/, content)
    end
  end

  test "skips design system doc with --skip-design-system" do
    run_generator ["--skip-design-system"]

    assert_no_file "DESIGN_SYSTEM.md"
  end

  test "design system doc uses default app name" do
    run_generator ["--no-skip-design-system"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/My App/, content)
    end
  end

  test "design system doc includes anti-patterns section" do
    run_generator ["--no-skip-design-system", "--app-name=TestApp"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/Anti-patterns/, content)
    end
  end
end
