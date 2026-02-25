require_relative "boot"

require "rails"
require "active_model/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "propshaft"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)
require "kiso"

module Dummy
  class Application < Rails::Application
    config.load_defaults 8.0
    config.eager_load = false
    config.secret_key_base = "test-secret-key-base-for-dummy-app"

    config.lookbook.project_name = "Kiso"
    config.lookbook.preview_layout = "preview"
  end
end
