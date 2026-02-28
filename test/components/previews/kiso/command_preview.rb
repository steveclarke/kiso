module Kiso
  # @label Command
  class CommandPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Dialog
    def dialog
      render_with_template
    end

    # @label Groups
    def groups
      render_with_template
    end

    # @label Shortcuts
    def shortcuts
      render_with_template
    end

    # @label Scrollable
    def scrollable
      render_with_template
    end
  end
end
