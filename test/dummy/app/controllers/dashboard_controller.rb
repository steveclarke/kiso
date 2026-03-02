class DashboardController < ApplicationController
  layout "dashboard"

  before_action { @sidebar_open = cookies[:sidebar_open] != "false" }

  def index
  end
end
