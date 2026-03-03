module Kiso
  # @logical_path kiso
  class AvatarPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label With Badge
    def with_badge
      render_with_template
    end

    # @label Group
    def group
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end
  end
end
