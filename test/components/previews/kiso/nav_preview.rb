module Kiso
  # @label Nav
  # @logical_path kiso/dashboard
  class NavPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Collapsible Sections
    def collapsible
      render_with_template
    end

    # @label With Badges
    def with_badges
      render_with_template
    end
  end
end
