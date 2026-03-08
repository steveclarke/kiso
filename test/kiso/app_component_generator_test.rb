# frozen_string_literal: true

require "test_helper"
require "generators/kiso/app_component/app_component_generator"
require "rails/generators/test_case"

class Kiso::AppComponentGeneratorTest < Rails::Generators::TestCase
  tests Kiso::Generators::AppComponentGenerator
  destination File.expand_path("../tmp/generator_test", __dir__)

  setup do
    prepare_destination
  end

  test "generates theme file" do
    run_generator ["pricing_card"]

    assert_file "app/themes/pricing_card.rb" do |content|
      assert_match(/AppThemes::PricingCard = ClassVariants\.build/, content)
      assert_match(/base: ""/, content)
      assert_match(/variants: \{\}/, content)
      assert_match(/defaults: \{\}/, content)
    end
  end

  test "generates partial file" do
    run_generator ["pricing_card"]

    assert_file "app/views/components/_pricing_card.html.erb" do |content|
      assert_match(/locals:.*css_classes: ""/, content)
      assert_match(/AppThemes::PricingCard\.render/, content)
      assert_match(/slot: "pricing-card"/, content)
      assert_match(/<%= yield %>/, content)
    end
  end

  test "generates sub-part files" do
    run_generator ["pricing_card", "--sub-parts", "header", "footer"]

    # Root component
    assert_file "app/themes/pricing_card.rb"
    assert_file "app/views/components/_pricing_card.html.erb"

    # Header sub-part
    assert_file "app/themes/pricing_card_header.rb" do |content|
      assert_match(/AppThemes::PricingCardHeader = ClassVariants\.build/, content)
    end

    assert_file "app/views/components/pricing_card/_header.html.erb" do |content|
      assert_match(/AppThemes::PricingCardHeader\.render/, content)
      assert_match(/slot: "pricing-card-header"/, content)
    end

    # Footer sub-part
    assert_file "app/themes/pricing_card_footer.rb" do |content|
      assert_match(/AppThemes::PricingCardFooter = ClassVariants\.build/, content)
    end

    assert_file "app/views/components/pricing_card/_footer.html.erb" do |content|
      assert_match(/AppThemes::PricingCardFooter\.render/, content)
      assert_match(/slot: "pricing-card-footer"/, content)
    end
  end

  test "generated partial includes component_options splat" do
    run_generator ["pricing_card"]

    assert_file "app/views/components/_pricing_card.html.erb" do |content|
      assert_match(/\*\*component_options/, content)
    end
  end

  test "generated theme uses ClassVariants.build" do
    run_generator ["pricing_card"]

    assert_file "app/themes/pricing_card.rb" do |content|
      assert_match(/ClassVariants\.build/, content)
    end
  end

  test "data-slot uses kebab-case" do
    run_generator ["feature_card"]

    assert_file "app/views/components/_feature_card.html.erb" do |content|
      assert_match(/slot: "feature-card"/, content)
    end
  end
end
