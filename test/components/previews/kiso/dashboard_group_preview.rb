module Kiso
  # @label Dashboard Group
  class DashboardGroupPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Sidebar Closed
    def sidebar_closed
      render_with_template
    end
  end
end
