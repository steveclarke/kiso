require_relative "boot"

require "rails"
require "active_model/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "propshaft"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)
require "kiso"

module KisoLookbook
  class Application < Rails::Application
    config.load_defaults 8.0
    config.eager_load = false
    config.secret_key_base = "lookbook-dev-secret-key-base"

    config.lookbook.project_name = "Kiso"
    config.lookbook.preview_layout = "preview"
    config.lookbook.preview_embeds.policy = "ALLOWALL"
    config.lookbook.preview_embeds.panels = ["source"]
    config.lookbook.preview_display_options = {theme: ["light", "dark"]}

    # Preview paths — the engine registers its own gem path, but in production
    # the gem is bundled separately from the repo. Point to the repo's previews.
    repo_root = File.expand_path("../..", __dir__)
    config.lookbook.preview_paths = [File.join(repo_root, "test/components/previews")]
  end
end
