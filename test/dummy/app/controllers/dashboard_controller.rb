class DashboardController < ApplicationController
  layout "dashboard"

  before_action { @sidebar_open = cookies[:sidebar_open] != "false" }
  before_action { @dark_mode = cookies[:theme] == "dark" }

  def index
  end
end
