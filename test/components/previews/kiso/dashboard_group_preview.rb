module Kiso
  # @label Dashboard Group
  # @logical_path kiso/dashboard
  class DashboardGroupPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Sidebar Closed
    def sidebar_closed
      render_with_template
    end

    # @label Custom Toggle Icon
    def custom_toggle_icons
      render_with_template
    end

    # @label Navbar Layout
    def navbar_layout
      render_with_template
    end
  end
end
