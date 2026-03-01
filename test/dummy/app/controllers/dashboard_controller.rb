class DashboardController < ApplicationController
  include Kiso::DashboardConcern

  layout "kiso/dashboard"

  def index
  end
end
