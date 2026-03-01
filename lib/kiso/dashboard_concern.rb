module Kiso
  # Restores sidebar and theme state from cookies before rendering, eliminating
  # flash-of-unstyled-content (FOUC) on page load.
  #
  # Include this concern in any controller that uses the kiso/dashboard layout:
  #
  #   class DashboardController < ApplicationController
  #     include Kiso::DashboardConcern
  #     layout "kiso/dashboard"
  #   end
  #
  # The concern sets two instance variables read by the layout:
  #   @sidebar_open — boolean, controls data-sidebar-open on <body>
  #   @dark_mode    — boolean, adds class="dark" to <html> when true
  #
  # Both are persisted to one-year cookies by the kiso--sidebar and
  # kiso--theme Stimulus controllers respectively.
  module DashboardConcern
    extend ActiveSupport::Concern

    included do
      before_action :kiso_restore_sidebar_state
      before_action :kiso_restore_theme
    end

    private

    def kiso_restore_sidebar_state
      @sidebar_open = cookies[:sidebar_open] != "false"
    end

    def kiso_restore_theme
      @dark_mode = cookies[:theme] == "dark"
    end
  end
end
