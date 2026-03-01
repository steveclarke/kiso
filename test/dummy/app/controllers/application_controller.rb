class ApplicationController < ActionController::Base
  before_action :restore_sidebar_state
  before_action :restore_theme

  private

    def restore_sidebar_state
      @sidebar_open = cookies[:sidebar_open] != "false"
    end

    def restore_theme
      @dark_mode = cookies[:theme] == "dark"
    end
end
